export type StudyItemKind = "FLASHCARD" | "MULTIPLE_CHOICE" | "TRUE_FALSE";

export type StudyItem = {
  id: string;
  kind: StudyItemKind;
  prompt: string;
  answer: string | null;
  options: string[] | null;
  correctOptionIndexes: number[];
  allowMultiple: boolean;
  explanation: string | null;
  order: number;
};

export type CardSet = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  items: StudyItem[];
};

export type Subject = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sets: CardSet[];
};

export type FlashcardCard = StudyItem & {
  kind: "FLASHCARD";
  setId: string;
  setName: string;
};

export type QuizQuestion = StudyItem & {
  kind: "MULTIPLE_CHOICE" | "TRUE_FALSE";
};
