"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ChevronLeft, RotateCcw, SkipForward, X } from "lucide-react";
import { shuffle } from "@/lib/flashcards";
import type { FlashcardCard } from "@/lib/types";

type Props = {
  subjectSlug: string;
  setName: string;
  cards: FlashcardCard[];
};

export default function FlashcardStudy({ subjectSlug, setName, cards }: Props) {
  const [deck, setDeck] = useState(() => shuffle(cards));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answers, setAnswers] = useState<Record<string, "known" | "unknown">>({});
  const [finished, setFinished] = useState(false);

  const current = deck[index];
  const progress = deck.length > 0 ? (index / deck.length) * 100 : 0;
  const known = useMemo(() => Object.values(answers).filter((answer) => answer === "known").length, [answers]);
  const unknown = useMemo(() => Object.values(answers).filter((answer) => answer === "unknown").length, [answers]);
  const score = useMemo(() => {
    const answered = known + unknown;
    return answered > 0 ? Math.round((known / answered) * 100) : 0;
  }, [known, unknown]);

  function advance(mark: "known" | "unknown") {
    setAnswers((value) => ({ ...value, [current.id]: mark }));
    setFlipped(false);
    if (index + 1 >= deck.length) setFinished(true);
    else setIndex((value) => value + 1);
  }

  function previous() {
    if (index === 0) return;
    setFinished(false);
    setFlipped(false);
    setIndex((value) => value - 1);
  }

  function skip() {
    setDeck((value) => {
      const next = [...value];
      const [card] = next.splice(index, 1);
      if (card) next.push(card);
      return next;
    });
    setFlipped(false);
  }

  function restart() {
    setDeck(shuffle(cards));
    setIndex(0);
    setFlipped(false);
    setAnswers({});
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="study-shell">
        <section className="result-panel">
          <p className="section-kicker">{setName}</p>
          <h1>Sessione completata</h1>
          <div className="score-value">{score}%</div>
          <div className="result-grid">
            <div>
              <strong>{known}</strong>
              <span>Conosciute</span>
            </div>
            <div>
              <strong>{unknown}</strong>
              <span>Da ripassare</span>
            </div>
          </div>
          <div className="button-row">
            <button onClick={restart} className="primary-button">
              <RotateCcw className="h-4 w-4" />
              Ricomincia
            </button>
            <Link href={`/study/${subjectSlug}`} className="secondary-button">
              <ArrowLeft className="h-4 w-4" />
              Set
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="study-shell">
      <div className="study-topbar">
        <Link href={`/study/${subjectSlug}`} className="back-link">
          <ArrowLeft className="h-4 w-4" />
          {setName}
        </Link>
        <span>
          {index + 1} / {deck.length}
        </span>
      </div>
      <div className="progress-track">
        <div style={{ width: `${progress}%` }} />
      </div>

      <button className={`flip-card ${flipped ? "flipped" : ""}`} onClick={() => setFlipped((value) => !value)}>
        <span className="flip-face flip-front">
          <small>Domanda</small>
          <strong>{current.prompt}</strong>
          <em>Tocca per vedere la risposta</em>
        </span>
        <span className="flip-face flip-back">
          <small>Risposta</small>
          <strong>{current.answer}</strong>
        </span>
      </button>

      <div className="study-actions">
        <button onClick={previous} disabled={index === 0} className="neutral-action">
          <ChevronLeft className="h-5 w-5" />
          Indietro
        </button>
        <button onClick={() => advance("unknown")} className="danger-action">
          <X className="h-5 w-5" />
          Non lo so
        </button>
        <button onClick={skip} className="neutral-action">
          <SkipForward className="h-5 w-5" />
          Salta
        </button>
        <button onClick={() => advance("known")} className="success-action">
          <Check className="h-5 w-5" />
          Lo so
        </button>
      </div>
    </div>
  );
}
