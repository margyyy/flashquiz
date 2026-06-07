"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma, hasDatabaseUrl } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import type { StudyItemKind } from "@/lib/types";

const ADMIN_ACCESS_COOKIE = "plantasia_admin_access";

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
  revalidatePath("/flashcard");
  revalidatePath("/quiz");
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
