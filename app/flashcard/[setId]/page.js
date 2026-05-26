import FlashcardStudy from "@/components/FlashcardStudy";

export const metadata = {
  title: "Studio Flashcard - RetiStudy",
};

export default async function FlashcardStudyPage({ params }) {
  const { setId } = await params;
  return <FlashcardStudy setId={setId} />;
}
