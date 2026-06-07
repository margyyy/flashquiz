"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Shuffle, X } from "lucide-react";
import { shuffle } from "@/lib/flashcards";
import type { QuizQuestion } from "@/lib/types";

const optionLetters = ["A", "B", "C", "D", "E", "F"];

type Props = {
  subjectSlug: string;
  setName: string;
  questions: QuizQuestion[];
};

export default function QuizGame({ subjectSlug, setName, questions: initialQuestions }: Props) {
  const [phase, setPhase] = useState<"intro" | "playing" | "results">("intro");
  const [questions, setQuestions] = useState(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [isShuffled, setIsShuffled] = useState(false);

  const question = questions[currentIndex];
  const total = questions.length;
  const progress = total > 0 ? (currentIndex / total) * 100 : 0;

  const results = useMemo(() => {
    const correct = questions.filter((item) => {
      const answer = answers[item.id] ?? [];
      return sameIndexes(answer, item.correctOptionIndexes);
    }).length;
    return {
      correct,
      wrong: Math.max(0, Object.keys(answers).length - correct),
      score: Math.round((correct / total) * 100),
    };
  }, [answers, questions, total]);

  function toggleOption(index: number) {
    if (confirmed) return;
    if (!question.allowMultiple) {
      setSelected([index]);
      return;
    }
    setSelected((value) => (value.includes(index) ? value.filter((item) => item !== index) : [...value, index]));
  }

  function confirm() {
    if (selected.length === 0) return;
    setAnswers((value) => ({ ...value, [question.id]: selected }));
    setConfirmed(true);
  }

  function next() {
    if (currentIndex + 1 >= total) {
      setPhase("results");
      return;
    }
    setCurrentIndex((value) => value + 1);
    setSelected([]);
    setConfirmed(false);
  }

  function restart(keepOrder = false) {
    setPhase("intro");
    setCurrentIndex(0);
    setSelected([]);
    setConfirmed(false);
    setAnswers({});
    if (!keepOrder) {
      setQuestions(initialQuestions);
      setIsShuffled(false);
    }
  }

  function toggleShuffle() {
    if (isShuffled) {
      setQuestions(initialQuestions);
      setIsShuffled(false);
    } else {
      setQuestions(shuffle(initialQuestions));
      setIsShuffled(true);
    }
  }

  if (phase === "intro") {
    return (
      <div className="study-shell">
        <section className="intro-panel">
          <p className="section-kicker">{setName}</p>
          <h1>Quiz</h1>
          <p>{total} domande disponibili.</p>
          <div className="button-row">
            <button onClick={toggleShuffle} className="secondary-button">
              <Shuffle className="h-4 w-4" />
              {isShuffled ? "Ordine originale" : "Mescola"}
            </button>
            <button onClick={() => setPhase("playing")} className="primary-button">
              Inizia
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (phase === "results") {
    return (
      <div className="study-shell">
        <section className="result-panel wide">
          <p className="section-kicker">{setName}</p>
          <h1>Risultati</h1>
          <div className="score-value">{results.score}%</div>
          <div className="result-grid three">
            <div>
              <strong>{results.correct}</strong>
              <span>Corrette</span>
            </div>
            <div>
              <strong>{results.wrong}</strong>
              <span>Errate</span>
            </div>
            <div>
              <strong>{total - Object.keys(answers).length}</strong>
              <span>Saltate</span>
            </div>
          </div>
          <div className="button-row">
            <button onClick={() => restart(true)} className="primary-button">
              <RotateCcw className="h-4 w-4" />
              Rifai
            </button>
            <Link href={`/study/${subjectSlug}`} className="secondary-button">
              <ArrowLeft className="h-4 w-4" />
              Set
            </Link>
          </div>

          <div className="review-list">
            {questions.map((item, index) => {
              const answer = answers[item.id] ?? [];
              const ok = sameIndexes(answer, item.correctOptionIndexes);
              return (
                <article key={item.id} className={`review-row ${ok ? "ok" : "ko"}`}>
                  <div className="review-index">{ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}</div>
                  <div>
                    <p>{index + 1}. {item.prompt}</p>
                    {!ok && <span>Corretta: {formatAnswer(item)}</span>}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  const correct = sameIndexes(selected, question.correctOptionIndexes);

  return (
    <div className="quiz-shell">
      <div className="study-topbar">
        <button onClick={() => restart(isShuffled)} className="back-link">
          <ArrowLeft className="h-4 w-4" />
          Esci
        </button>
        <span>
          {currentIndex + 1} / {total}
        </span>
      </div>
      <div className="progress-track">
        <div style={{ width: `${progress}%` }} />
      </div>

      <section className="question-panel">
        <p className="section-kicker">Domanda {currentIndex + 1}</p>
        <h1>{question.prompt}</h1>
      </section>

      <div className="option-list">
        {(question.options ?? []).map((option, index) => {
          const active = selected.includes(index);
          const isCorrect = question.correctOptionIndexes.includes(index);
          const state = confirmed ? (isCorrect ? "correct" : active ? "wrong" : "") : active ? "active" : "";
          return (
            <button key={option} onClick={() => toggleOption(index)} disabled={confirmed} className={`option-button ${state}`}>
              <span>{optionLetters[index]}</span>
              {option}
              {confirmed && isCorrect && <Check className="ml-auto h-4 w-4" />}
              {confirmed && active && !isCorrect && <X className="ml-auto h-4 w-4" />}
            </button>
          );
        })}
      </div>

      <div className="quiz-actions">
        {!confirmed ? (
          <button onClick={confirm} disabled={selected.length === 0} className="primary-button">
            Conferma risposta
          </button>
        ) : (
          <>
            <div className={`answer-banner ${correct ? "correct" : "wrong"}`}>
              {correct ? "Risposta corretta" : `Risposta corretta: ${formatAnswer(question)}`}
            </div>
            <button onClick={next} className="primary-button">
              {currentIndex + 1 >= total ? "Vedi risultati" : "Prossima domanda"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function sameIndexes(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  return [...a].sort().every((value, index) => value === [...b].sort()[index]);
}

function formatAnswer(question: QuizQuestion) {
  return question.correctOptionIndexes
    .map((index) => `${optionLetters[index]}. ${question.options?.[index] ?? ""}`)
    .join("; ");
}
