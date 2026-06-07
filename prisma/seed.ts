import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedSubjects } from "../lib/seed-data";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL non configurato.");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const subject of seedSubjects) {
    await prisma.subject.upsert({
      where: { slug: subject.slug },
      update: {
        name: subject.name,
        description: subject.description,
      },
      create: {
        name: subject.name,
        slug: subject.slug,
        description: subject.description,
      },
    });

    const dbSubject = await prisma.subject.findUniqueOrThrow({
      where: { slug: subject.slug },
    });

    if (subject.slug === "basi-di-dati") {
      await prisma.cardSet.deleteMany({
        where: { subjectId: dbSubject.id },
      });
    }

    for (const set of subject.sets) {
      await prisma.cardSet.upsert({
        where: {
          subjectId_slug: {
            subjectId: dbSubject.id,
            slug: set.slug,
          },
        },
        update: {
          name: set.name,
          description: set.description,
        },
        create: {
          subjectId: dbSubject.id,
          name: set.name,
          slug: set.slug,
          description: set.description,
        },
      });

      const dbSet = await prisma.cardSet.findUniqueOrThrow({
        where: {
          subjectId_slug: {
            subjectId: dbSubject.id,
            slug: set.slug,
          },
        },
      });

      for (const item of set.items) {
        await prisma.studyItem.upsert({
          where: { id: item.id },
          update: {
            setId: dbSet.id,
            kind: item.kind,
            prompt: item.prompt,
            answer: item.answer,
            options: item.options ?? undefined,
            correctOptionIndexes: item.correctOptionIndexes,
            allowMultiple: item.allowMultiple,
            explanation: item.explanation,
            order: item.order,
          },
          create: {
            id: item.id,
            setId: dbSet.id,
            kind: item.kind,
            prompt: item.prompt,
            answer: item.answer,
            options: item.options ?? undefined,
            correctOptionIndexes: item.correctOptionIndexes,
            allowMultiple: item.allowMultiple,
            explanation: item.explanation,
            order: item.order,
          },
        });
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
