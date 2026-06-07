import exportedDb from "@/basedati-flashcard/test.json";
import gestoriDbms from "@/basedati-flashcard/gestori-flashcards.json";
import struttureDbms from "@/basedati-flashcard/strutture-flashcards.json";
import mongodb from "@/basedati-flashcard/parte-2-set/mongodb.json";
import ottimizzazione from "@/basedati-flashcard/parte-2-set/ottimizzazione.json";
import struttureParteDue from "@/basedati-flashcard/parte-2-set/strutture.json";
import { flashcardSets, toFlashcardItem } from "./flashcards";
import { quizQuestions, toQuizItem } from "./quiz";
import type { Subject, StudyItem } from "./types";

type QuestionAnswer = {
  question: string;
  answer: string;
};

type ExportedFlashcard = {
  id: number;
  front: string;
  back: string;
  setId: number;
  subjectId: number;
};

function flashcardSetFromQa(slug: string, name: string, cards: QuestionAnswer[]) {
  return {
    id: `basedati-${slug}`,
    name,
    slug,
    description: null,
    items: cards.map((card, index): StudyItem => ({
      id: `basedati-${slug}-${index + 1}`,
      kind: "FLASHCARD",
      prompt: card.question,
      answer: card.answer,
      options: null,
      correctOptionIndexes: [],
      allowMultiple: false,
      explanation: null,
      order: index,
    })),
  };
}

const exportedBasiDiDatiCards = (exportedDb.flashcards as ExportedFlashcard[])
  .filter((card) => card.subjectId === 14)
  .map((card, index): StudyItem => ({
    id: `basedati-export-${card.id}`,
    kind: "FLASHCARD",
    prompt: card.front,
    answer: card.back,
    options: null,
    correctOptionIndexes: [],
    allowMultiple: false,
    explanation: null,
    order: index,
  }));

export const seedSubjects: Subject[] = [
  {
    id: "subject-reti",
    name: "Reti",
    slug: "reti",
    description: "Architetture, protocolli, indirizzamento e livelli TCP/IP.",
    sets: [
      ...flashcardSets.map((set) => ({
        id: `reti-set-${set.id}`,
        name: set.name,
        slug: `set-${set.id}`,
        description: null,
        items: set.cards.map((card, index) => toFlashcardItem(card, index)),
      })),
      {
        id: "reti-set-quiz-esame",
        name: "quiz-esame",
        slug: "quiz-esame",
        description: "Tutti i quiz d'esame di Reti in un unico set.",
        items: quizQuestions.map((question, index) => toQuizItem(question, index)),
      },
    ],
  },
  {
    id: "subject-basi-di-dati",
    name: "Basi di Dati",
    slug: "basi-di-dati",
    description: "Gestione del buffer, strutture fisiche, ottimizzazione e MongoDB.",
    sets: [
      {
        id: "basedati-export-gestore-buffer",
        name: "Gestore del Buffer",
        slug: "gestore-del-buffer",
        description: null,
        items: exportedBasiDiDatiCards,
      },
      flashcardSetFromQa("gestori-dbms", "Gestori DBMS", gestoriDbms as QuestionAnswer[]),
      flashcardSetFromQa("strutture-fisiche", "Strutture fisiche", struttureDbms as QuestionAnswer[]),
      flashcardSetFromQa("strutture-parte-2", "Strutture parte 2", struttureParteDue as QuestionAnswer[]),
      flashcardSetFromQa("ottimizzazione", "Ottimizzazione", ottimizzazione as QuestionAnswer[]),
      flashcardSetFromQa("mongodb", "MongoDB", mongodb as QuestionAnswer[]),
    ],
  },
];
