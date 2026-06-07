import { notFound } from "next/navigation";
import FlashcardStudy from "@/components/FlashcardStudy";
import { getSet } from "@/lib/data";
import type { StudyItem } from "@/lib/types";

export const metadata = {
  title: "Flashcard - Plantasia",
};

export default async function FlashcardStudyPage({ params }: PageProps<"/flashcard/[setId]">) {
  const { setId } = await params;
  const set = await getSet(setId);

  if (!set) notFound();

  const cards = set.items
    .filter((item): item is StudyItem & { kind: "FLASHCARD" } => item.kind === "FLASHCARD")
    .map((item) => ({ ...item, setId: set.id, setName: set.name }));

  if (cards.length === 0) notFound();

  return <FlashcardStudy subjectSlug={set.subject.slug} setName={set.name} cards={cards} />;
}
