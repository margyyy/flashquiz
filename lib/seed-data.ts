import concorrenza from "@/basedati-flashcard/concorrenza.json";
import concorrenzaQuiz from "@/basedati-quiz/concorrenza.json";
import domandeEsame from "@/basedati-flashcard/domande-esame.json";
import domandeEsameQuiz from "@/basedati-quiz/domande-esame.json";
import mongodb from "@/basedati-flashcard/mongodb.json";
import mongodbQuiz from "@/basedati-quiz/mongodb.json";
import ottimizzazione from "@/basedati-flashcard/ottimizzazione.json";
import ottimizzazioneQuiz from "@/basedati-quiz/ottimizzazione.json";
import struttureIndici from "@/basedati-flashcard/strutture-indici.json";
import struttureIndiciQuiz from "@/basedati-quiz/strutture-indici.json";
import transazioniAffidabilita from "@/basedati-flashcard/transazioni-affidabilita.json";
import transazioniAffidabilitaQuiz from "@/basedati-quiz/transazioni-affidabilita.json";
import { flashcardSets, toFlashcardItem } from "./flashcards";
import { quizQuestions, toQuizItem } from "./quiz";
import type { Subject, StudyItem } from "./types";

type QuestionAnswer = {
  question: string;
  answer: string;
};

type QuizSeedItem = {
  id: number;
  kind: "MULTIPLE_CHOICE" | "TRUE_FALSE";
  prompt: string;
  answer: string;
  options: string[];
  correctOptionIndexes: number[];
  allowMultiple: boolean;
  explanation: string | null;
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

function quizSetFromItems(slug: string, name: string, items: QuizSeedItem[]) {
  return {
    id: `basedati-quiz-${slug}`,
    name,
    slug: `quiz-${slug}`,
    description: null,
    items: items.map((item, index): StudyItem => ({
      id: `basedati-quiz-${slug}-${item.id}`,
      kind: item.kind,
      prompt: item.prompt,
      answer: item.answer,
      options: item.options,
      correctOptionIndexes: item.correctOptionIndexes,
      allowMultiple: item.allowMultiple,
      explanation: item.explanation,
      order: index,
    })),
  };
}

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
    description: "Transazioni, concorrenza, strutture di accesso, ottimizzazione e MongoDB.",
    sets: [
      flashcardSetFromQa("transazioni-affidabilita", "Transazioni e affidabilita", transazioniAffidabilita as QuestionAnswer[]),
      flashcardSetFromQa("concorrenza", "Concorrenza", concorrenza as QuestionAnswer[]),
      flashcardSetFromQa("strutture-indici", "Strutture e indici", struttureIndici as QuestionAnswer[]),
      flashcardSetFromQa("ottimizzazione", "Ottimizzazione", ottimizzazione as QuestionAnswer[]),
      flashcardSetFromQa("mongodb", "MongoDB", mongodb as QuestionAnswer[]),
      flashcardSetFromQa("domande-esame", "Domande d'esame", domandeEsame as QuestionAnswer[]),
      quizSetFromItems("transazioni-affidabilita", "Quiz - Transazioni e affidabilita", transazioniAffidabilitaQuiz as QuizSeedItem[]),
      quizSetFromItems("concorrenza", "Quiz - Concorrenza", concorrenzaQuiz as QuizSeedItem[]),
      quizSetFromItems("strutture-indici", "Quiz - Strutture e indici", struttureIndiciQuiz as QuizSeedItem[]),
      quizSetFromItems("ottimizzazione", "Quiz - Ottimizzazione", ottimizzazioneQuiz as QuizSeedItem[]),
      quizSetFromItems("mongodb", "Quiz - MongoDB", mongodbQuiz as QuizSeedItem[]),
      quizSetFromItems("domande-esame", "Quiz - Domande d'esame", domandeEsameQuiz as QuizSeedItem[]),
    ],
  },
];
