"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma, hasDatabaseUrl } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import type { StudyItemKind } from "@/lib/types";

const ADMIN_ACCESS_COOKIE = "plantasia_admin_access";
export type AdminActionState = {
  ok: boolean;
  message: string;
};

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getDb() {
  if (!hasDatabaseUrl() || !prisma) {
    throw new Error("DATABASE_URL non configurato.");
  }
  return prisma;
}

export async function unlockAdmin(formData: FormData) {
  const code = text(formData, "code");
  const adminAccessCode = process.env.ADMIN_ACCESS_CODE;

  if (!adminAccessCode || code !== adminAccessCode) {
    redirect("/admin?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: ADMIN_ACCESS_COOKIE,
    value: "ok",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/admin");
}

export async function createSubject(formData: FormData) {
  const db = getDb();
  const name = text(formData, "name");
  const description = text(formData, "description") || null;
  const slug = text(formData, "slug") || slugify(name);

  if (!name || !slug) throw new Error("Nome materia obbligatorio.");

  await db.subject.create({
    data: { name, slug, description },
  });

  revalidatePath("/admin");
  revalidatePath("/study");
}

export async function createSet(formData: FormData) {
  const db = getDb();
  const subjectId = text(formData, "subjectId");
  const name = text(formData, "name");
  const description = text(formData, "description") || null;
  const slug = text(formData, "slug") || slugify(name);

  if (!subjectId || !name || !slug) throw new Error("Materia e nome set obbligatori.");

  await db.cardSet.create({
    data: { subjectId, name, slug, description },
  });

  revalidatePath("/admin");
  revalidatePath("/study");
}

function getOptions(formData: FormData) {
  const repeatedOptions = formData
    .getAll("options")
    .map((option) => (typeof option === "string" ? option.trim() : ""))
    .filter(Boolean);
  const optionsInput = text(formData, "options");

  return repeatedOptions.length > 1
    ? repeatedOptions
    : optionsInput
        .split("\n")
        .map((option) => option.trim())
        .filter(Boolean);
}

function getCorrectIndexes(formData: FormData, optionCount: number) {
  const repeatedIndexes = formData
    .getAll("correctOptionIndexes")
    .map((index) => (typeof index === "string" ? Number.parseInt(index, 10) : Number.NaN))
    .filter((index) => Number.isInteger(index) && index >= 0 && index < optionCount);
  const correctInput = text(formData, "correctOptionIndexes");

  return repeatedIndexes.length > 0
    ? repeatedIndexes
    : correctInput
        .split(",")
        .map((index) => Number.parseInt(index.trim(), 10) - 1)
        .filter((index) => Number.isInteger(index) && index >= 0 && index < optionCount);
}

function studyItemData(formData: FormData) {
  const kind = text(formData, "kind") as StudyItemKind;
  const prompt = text(formData, "prompt");
  const answer = text(formData, "answer") || null;
  const explanation = text(formData, "explanation") || null;
  const allowMultiple = text(formData, "allowMultiple") === "on";
  const correctInput = text(formData, "correctOptionIndexes");

  if (!prompt) throw new Error("Domanda o fronte obbligatorio.");
  if (!["FLASHCARD", "MULTIPLE_CHOICE", "TRUE_FALSE"].includes(kind)) {
    throw new Error("Tipologia non valida.");
  }

  let options: string[] | undefined;
  let correctOptionIndexes: number[] = [];
  let itemAnswer = answer;
  let itemAllowMultiple = false;

  if (kind === "TRUE_FALSE") {
    options = ["Vero", "Falso"];
    correctOptionIndexes = [correctInput === "1" || correctInput.toLowerCase() === "falso" ? 1 : 0];
    itemAnswer = options[correctOptionIndexes[0]];
  }

  if (kind === "MULTIPLE_CHOICE") {
    options = getOptions(formData).slice(0, 5);
    correctOptionIndexes = getCorrectIndexes(formData, options.length);
    itemAnswer = correctOptionIndexes.map((index) => options?.[index]).filter(Boolean).join("; ") || null;
    if (options.length < 2 || correctOptionIndexes.length === 0) {
      throw new Error("Le domande a scelta richiedono almeno due opzioni e una risposta corretta.");
    }
    itemAllowMultiple = allowMultiple;
  }

  return {
    kind,
    prompt,
    answer: itemAnswer,
    options,
    correctOptionIndexes,
    allowMultiple: itemAllowMultiple,
    explanation,
  };
}

function revalidateContent() {
  revalidatePath("/admin");
  revalidatePath("/study");
  revalidatePath("/study/[subjectSlug]", "page");
  revalidatePath("/flashcard");
  revalidatePath("/flashcard/[setId]", "page");
  revalidatePath("/quiz");
  revalidatePath("/quiz/[setId]", "page");
}

function parseJsonObject(input: string) {
  try {
    const value: unknown = JSON.parse(input);
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Il JSON deve essere un oggetto.");
    }
    return value as Record<string, unknown>;
  } catch (error) {
    if (error instanceof Error && error.message === "Il JSON deve essere un oggetto.") {
      throw error;
    }
    throw new Error("JSON non valido.");
  }
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function requiredString(value: unknown, label: string) {
  const normalized = optionalString(value);
  if (!normalized) throw new Error(`${label} obbligatorio.`);
  return normalized;
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function indexArray(value: unknown, optionCount: number) {
  return Array.isArray(value)
    ? value
        .map((item) => (typeof item === "number" ? item : Number.parseInt(String(item), 10)))
        .filter((item) => Number.isInteger(item) && item >= 0 && item < optionCount)
    : [];
}

function hasNonEmptyArray(value: unknown) {
  return Array.isArray(value) && value.length > 0;
}

function hasTrueValue(value: unknown) {
  return value === true || value === "true" || value === "on";
}

function assertNoFlashcardQuizFields(item: Record<string, unknown>, order: number) {
  if (item.options !== undefined && item.options !== null && hasNonEmptyArray(item.options)) {
    throw new Error(`Item ${order + 1}: una FLASHCARD non puo avere options.`);
  }

  if (hasNonEmptyArray(item.correctOptionIndexes)) {
    throw new Error(`Item ${order + 1}: una FLASHCARD non puo avere correctOptionIndexes.`);
  }

  if (hasTrueValue(item.allowMultiple)) {
    throw new Error(`Item ${order + 1}: una FLASHCARD non puo avere allowMultiple true.`);
  }
}

function assertMultipleChoiceFields(item: Record<string, unknown>, order: number) {
  if (!Array.isArray(item.options)) {
    throw new Error(`Item ${order + 1}: un MULTIPLE_CHOICE deve avere options come array.`);
  }

  if (!Array.isArray(item.correctOptionIndexes)) {
    throw new Error(`Item ${order + 1}: un MULTIPLE_CHOICE deve avere correctOptionIndexes come array.`);
  }
}

function assertTrueFalseFields(item: Record<string, unknown>, order: number) {
  if (item.options !== undefined && item.options !== null) {
    const options = stringArray(item.options);
    if (options.length !== 2 || options[0] !== "Vero" || options[1] !== "Falso") {
      throw new Error(`Item ${order + 1}: un TRUE_FALSE puo avere solo options ["Vero", "Falso"].`);
    }
  }

  if (hasTrueValue(item.allowMultiple)) {
    throw new Error(`Item ${order + 1}: un TRUE_FALSE non puo avere allowMultiple true.`);
  }

  if (!Array.isArray(item.correctOptionIndexes)) {
    throw new Error(`Item ${order + 1}: un TRUE_FALSE deve avere correctOptionIndexes come array.`);
  }
}

function studyItemJsonData(value: unknown, order: number) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Ogni item deve essere un oggetto.");
  }

  const item = value as Record<string, unknown>;
  const kind = requiredString(item.kind, "kind") as StudyItemKind;
  const prompt = requiredString(item.prompt, "prompt");
  const explanation = optionalString(item.explanation);

  if (!["FLASHCARD", "MULTIPLE_CHOICE", "TRUE_FALSE"].includes(kind)) {
    throw new Error(`Tipologia item non valida: ${kind}`);
  }

  if (kind === "FLASHCARD") {
    assertNoFlashcardQuizFields(item, order);

    return {
      id: optionalString(item.id),
      data: {
        kind,
        prompt,
        answer: requiredString(item.answer, "answer"),
        options: Prisma.JsonNull,
        correctOptionIndexes: [],
        allowMultiple: false,
        explanation,
        order,
      },
    };
  }

  if (kind === "TRUE_FALSE") {
    assertTrueFalseFields(item, order);

    const correctOptionIndexes = indexArray(item.correctOptionIndexes, 2);
    const correctIndex = correctOptionIndexes[0] ?? 0;
    return {
      id: optionalString(item.id),
      data: {
        kind,
        prompt,
        answer: correctIndex === 1 ? "Falso" : "Vero",
        options: ["Vero", "Falso"],
        correctOptionIndexes: [correctIndex],
        allowMultiple: false,
        explanation,
        order,
      },
    };
  }

  assertMultipleChoiceFields(item, order);

  const options = stringArray(item.options).slice(0, 5);
  const correctOptionIndexes = indexArray(item.correctOptionIndexes, options.length);
  const allowMultiple = item.allowMultiple === true;

  if (options.length < 2 || correctOptionIndexes.length === 0) {
    throw new Error("I quiz MULTIPLE_CHOICE richiedono almeno due opzioni e una risposta corretta.");
  }

  return {
    id: optionalString(item.id),
    data: {
      kind,
      prompt,
      answer: correctOptionIndexes.map((index) => options[index]).filter(Boolean).join("; ") || null,
      options,
      correctOptionIndexes,
      allowMultiple,
      explanation,
      order,
    },
  };
}

export async function createStudyItem(formData: FormData) {
  const db = getDb();
  const setId = text(formData, "setId");

  if (!setId) throw new Error("Set obbligatorio.");

  const lastItem = await db.studyItem.findFirst({
    where: { setId },
    orderBy: { order: "desc" },
  });

  await db.studyItem.create({
    data: {
      setId,
      ...studyItemData(formData),
      order: (lastItem?.order ?? -1) + 1,
    },
  });

  revalidateContent();
}

export async function updateSubject(formData: FormData) {
  const db = getDb();
  const id = text(formData, "id");
  const name = text(formData, "name");
  const description = text(formData, "description") || null;
  const slug = text(formData, "slug") || slugify(name);

  if (!id || !name || !slug) throw new Error("Nome materia obbligatorio.");

  await db.subject.update({
    where: { id },
    data: { name, slug, description },
  });

  revalidateContent();
}

export async function updateSubjectJson(formData: FormData) {
  const db = getDb();
  const id = text(formData, "id");
  const json = text(formData, "json");
  const data = parseJsonObject(json);
  const name = requiredString(data.name, "Nome materia");
  const slug = optionalString(data.slug) || slugify(name);
  const description = optionalString(data.description);

  if (!id) throw new Error("Materia obbligatoria.");

  await db.subject.update({
    where: { id },
    data: { name, slug, description },
  });

  revalidateContent();
}

export async function saveSubjectJson(_prevState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    await updateSubjectJson(formData);
    return { ok: true, message: "Subject salvata correttamente." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Errore durante il salvataggio." };
  }
}

export async function deleteSubject(formData: FormData) {
  const db = getDb();
  const id = text(formData, "id");

  if (!id) throw new Error("Materia obbligatoria.");

  await db.subject.delete({
    where: { id },
  });

  revalidateContent();
}

export async function updateSet(formData: FormData) {
  const db = getDb();
  const id = text(formData, "id");
  const subjectId = text(formData, "subjectId");
  const name = text(formData, "name");
  const description = text(formData, "description") || null;
  const slug = text(formData, "slug") || slugify(name);

  if (!id || !subjectId || !name || !slug) throw new Error("Materia e nome set obbligatori.");

  await db.cardSet.update({
    where: { id },
    data: { subjectId, name, slug, description },
  });

  revalidateContent();
}

export async function updateSetJson(formData: FormData) {
  const db = getDb();
  const id = text(formData, "id");
  const json = text(formData, "json");
  const data = parseJsonObject(json);
  const subjectId = optionalString(data.subjectId) || text(formData, "subjectId");
  const name = requiredString(data.name, "Nome set");
  const slug = optionalString(data.slug) || slugify(name);
  const description = optionalString(data.description);
  const rawItems = Array.isArray(data.items) ? data.items : [];
  const items = rawItems.map((item, index) => studyItemJsonData(item, index));

  if (!id || !subjectId) throw new Error("Set e materia obbligatori.");

  await db.$transaction(async (tx) => {
    await tx.cardSet.update({
      where: { id },
      data: { subjectId, name, slug, description },
    });

    const existingItems = await tx.studyItem.findMany({
      where: { setId: id },
      select: { id: true },
    });
    const existingIds = new Set(existingItems.map((item) => item.id));
    const keptIds = items.map((item) => item.id).filter((itemId): itemId is string => Boolean(itemId));

    await tx.studyItem.deleteMany({
      where: {
        setId: id,
        id: { notIn: keptIds },
      },
    });

    for (const item of items) {
      if (item.id && existingIds.has(item.id)) {
        await tx.studyItem.update({
          where: { id: item.id },
          data: {
            setId: id,
            ...item.data,
          },
        });
      } else {
        await tx.studyItem.create({
          data: {
            ...(item.id ? { id: item.id } : {}),
            setId: id,
            ...item.data,
          },
        });
      }
    }
  });

  revalidateContent();
}

export async function saveSetJson(_prevState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    await updateSetJson(formData);
    return { ok: true, message: "Set salvato correttamente." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Errore durante il salvataggio." };
  }
}

export async function deleteSet(formData: FormData) {
  const db = getDb();
  const id = text(formData, "id");

  if (!id) throw new Error("Set obbligatorio.");

  await db.cardSet.delete({
    where: { id },
  });

  revalidateContent();
}

export async function updateStudyItem(formData: FormData) {
  const db = getDb();
  const id = text(formData, "id");
  const setId = text(formData, "setId");
  const order = Number.parseInt(text(formData, "order"), 10);

  if (!id || !setId) throw new Error("Item e set obbligatori.");

  await db.studyItem.update({
    where: { id },
    data: {
      setId,
      ...studyItemData(formData),
      order: Number.isInteger(order) ? order : 0,
    },
  });

  revalidateContent();
}

export async function deleteStudyItem(formData: FormData) {
  const db = getDb();
  const id = text(formData, "id");

  if (!id) throw new Error("Item obbligatorio.");

  await db.studyItem.delete({
    where: { id },
  });

  revalidateContent();
}
