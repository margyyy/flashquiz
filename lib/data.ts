import { hasDatabaseUrl, prisma } from "./prisma";
import { seedSubjects } from "./seed-data";
import type { CardSet, Subject, StudyItem } from "./types";

function normalizeItem(item: {
  id: string;
  kind: StudyItem["kind"];
  prompt: string;
  answer: string | null;
  options: unknown;
  correctOptionIndexes: number[];
  allowMultiple: boolean;
  explanation: string | null;
  order: number;
}): StudyItem {
  return {
    ...item,
    options: Array.isArray(item.options) ? item.options.filter((option): option is string => typeof option === "string") : null,
  };
}

function normalizeSet(set: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  items: Parameters<typeof normalizeItem>[0][];
}): CardSet {
  return {
    ...set,
    items: set.items.map(normalizeItem),
  };
}

function normalizeSubject(subject: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sets: Parameters<typeof normalizeSet>[0][];
}): Subject {
  return {
    ...subject,
    sets: subject.sets.map(normalizeSet),
  };
}

export async function getSubjects(): Promise<Subject[]> {
  if (!hasDatabaseUrl() || !prisma) return seedSubjects;

  const subjects = await prisma.subject.findMany({
    orderBy: { name: "asc" },
    include: {
      sets: {
        orderBy: { name: "asc" },
        include: { items: { orderBy: { order: "asc" } } },
      },
    },
  });

  return subjects.map(normalizeSubject);
}

export async function getSubject(slug: string): Promise<Subject | null> {
  if (!hasDatabaseUrl() || !prisma) {
    return seedSubjects.find((subject) => subject.slug === slug) ?? null;
  }

  const subject = await prisma.subject.findUnique({
    where: { slug },
    include: {
      sets: {
        orderBy: { name: "asc" },
        include: { items: { orderBy: { order: "asc" } } },
      },
    },
  });

  return subject ? normalizeSubject(subject) : null;
}

export async function getSet(setId: string): Promise<(CardSet & { subject: Pick<Subject, "id" | "name" | "slug"> }) | null> {
  if (!hasDatabaseUrl() || !prisma) {
    for (const subject of seedSubjects) {
      const set = subject.sets.find((candidate) => candidate.id === setId || candidate.slug === setId);
      if (set) return { ...set, subject: { id: subject.id, name: subject.name, slug: subject.slug } };
    }
    return null;
  }

  const set = await prisma.cardSet.findUnique({
    where: { id: setId },
    include: {
      subject: { select: { id: true, name: true, slug: true } },
      items: { orderBy: { order: "asc" } },
    },
  });

  return set ? { ...normalizeSet(set), subject: set.subject } : null;
}

export async function getAllFlashcards() {
  const subjects = await getSubjects();
  return subjects.flatMap((subject) =>
    subject.sets.flatMap((set) =>
      set.items
        .filter((item): item is StudyItem & { kind: "FLASHCARD" } => item.kind === "FLASHCARD")
        .map((item) => ({ ...item, setId: set.id, setName: set.name, subjectName: subject.name })),
    ),
  );
}
