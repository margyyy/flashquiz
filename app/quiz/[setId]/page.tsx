import { notFound } from "next/navigation";
import { connection } from "next/server";
import QuizGame from "@/components/QuizGame";
import { getSet } from "@/lib/data";
import type { QuizQuestion, StudyItem } from "@/lib/types";

export const metadata = {
  title: "Quiz - Plantasia",
};

export default async function QuizSetPage({ params }: PageProps<"/quiz/[setId]">) {
  await connection();
  const { setId } = await params;
  const set = await getSet(setId);

  if (!set) notFound();

  const questions = set.items.filter(
    (item): item is StudyItem & QuizQuestion => item.kind === "MULTIPLE_CHOICE" || item.kind === "TRUE_FALSE",
  );
  if (questions.length === 0) notFound();

  return <QuizGame subjectSlug={set.subject.slug} setName={set.name} questions={questions} />;
}
