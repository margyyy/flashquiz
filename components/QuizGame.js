"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { quizQuestions } from "@/lib/quiz";
import { shuffle } from "@/lib/flashcards";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  RotateCcw,
  Shuffle,
} from "lucide-react";

const OPTION_LETTERS = ["A", "B", "C", "D", "E"];

export default function QuizGame() {
  const router = useRouter();
  const [phase, setPhase] = useState("intro"); // "intro" | "playing" | "results"
  const [questions, setQuestions] = useState(quizQuestions); // active question order
  const [shuffled, setShuffled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedIndex }
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const question = questions[currentIndex];
  const total = questions.length;
  const progress = (currentIndex / total) * 100;

  const handleSelect = (optIndex) => {
    if (confirmed) return;
    setSelected(optIndex);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    setAnswers((prev) => ({ ...prev, [question.id]: selected }));
  };

  const handleNext = () => {
    if (currentIndex + 1 >= total) {
      setPhase("results");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  const handleRestart = (keepShuffle = false) => {
    setPhase("intro");
    setCurrentIndex(0);
    setAnswers({});
    setSelected(null);
    setConfirmed(false);
    if (!keepShuffle) {
      setQuestions(quizQuestions);
      setShuffled(false);
    }
  };

  const handleShuffle = () => {
    setQuestions(shuffle(quizQuestions));
    setShuffled(true);
  };

  const handleUnshuffle = () => {
    setQuestions(quizQuestions);
    setShuffled(false);
  };

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-sm rounded-3xl border p-8 text-center"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <h1 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>
            Quiz
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            {total} domande
          </p>

          {/* Shuffle toggle */}
          <div
            className="flex items-center justify-between rounded-xl px-4 py-3 mb-6 border"
            style={{
              backgroundColor: shuffled ? "var(--accent-subtle)" : "var(--surface-2)",
              borderColor: shuffled ? "var(--accent-light)" : "var(--border)",
            }}
          >
            <div className="flex items-center gap-2">
              <Shuffle
                className="w-4 h-4"
                style={{ color: shuffled ? "var(--accent)" : "var(--text-muted)" }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: shuffled ? "var(--accent)" : "var(--text-muted)" }}
              >
                {shuffled ? "Ordine casuale" : "Ordine originale"}
              </span>
            </div>
            <button
              onClick={shuffled ? handleUnshuffle : handleShuffle}
              className="text-xs font-semibold px-3 py-1 rounded-lg transition-all hover:opacity-80"
              style={{
                backgroundColor: shuffled ? "var(--accent)" : "var(--border)",
                color: shuffled ? "#fff" : "var(--text-muted)",
              }}
            >
              {shuffled ? "Rimuovi" : "Mescola"}
            </button>
          </div>

          <button
            onClick={() => setPhase("playing")}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--accent)", color: "#fff" }}
          >
            Inizia
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── RESULTS ────────────────────────────────────────────────────────────────
  if (phase === "results") {
    const correct = questions.filter((q) => answers[q.id] === q.correct).length;
    const wrong = questions.filter(
      (q) => answers[q.id] !== undefined && answers[q.id] !== q.correct
    ).length;
    const skipped = total - correct - wrong;
    const pct = Math.round((correct / total) * 100);

    const grade =
      pct >= 90 ? "Eccellente! 🏆" : pct >= 75 ? "Molto bene! 🎉" : pct >= 60 ? "Quasi! 💪" : "Da ripassare 📚";

    return (
      <div className="min-h-[calc(100vh-56px)] px-4 py-10 max-w-2xl mx-auto">
        {/* Score card */}
        <div
          className="rounded-3xl border p-8 text-center mb-8"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>
            {grade}
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Quiz completato
          </p>

          <div className="text-6xl font-bold mb-4" style={{ color: "var(--accent)" }}>
            {pct}%
          </div>

          <div className="h-3 rounded-full mb-6 overflow-hidden" style={{ backgroundColor: "var(--surface-2)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                backgroundColor:
                  pct >= 75 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--danger)",
              }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-xl p-3" style={{ backgroundColor: "var(--success-subtle)" }}>
              <div className="text-xl font-bold" style={{ color: "var(--success)" }}>
                {correct}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                Corrette
              </div>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: "var(--danger-subtle)" }}>
              <div className="text-xl font-bold" style={{ color: "var(--danger)" }}>
                {wrong}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                Errate
              </div>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: "var(--surface-2)" }}>
              <div className="text-xl font-bold" style={{ color: "var(--text-muted)" }}>
                {skipped}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                Saltate
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleRestart(true)}
              className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--accent)", color: "#fff" }}
            >
              <RotateCcw className="w-4 h-4" />
              Rifai
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--surface-2)", color: "var(--text)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </button>
          </div>
        </div>

        {/* Review */}
        <h3 className="font-bold mb-4" style={{ color: "var(--text)" }}>
          Riepilogo domande
        </h3>
        <div className="space-y-3">
          {questions.map((q, i) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correct;
            const wasAnswered = userAnswer !== undefined;

            return (
              <div
                key={q.id}
                className="rounded-xl border p-4"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: isCorrect
                    ? "var(--success)"
                    : wasAnswered
                    ? "var(--danger)"
                    : "var(--border)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5"
                    style={{
                      backgroundColor: isCorrect
                        ? "var(--success-subtle)"
                        : wasAnswered
                        ? "var(--danger-subtle)"
                        : "var(--surface-2)",
                      color: isCorrect
                        ? "var(--success)"
                        : wasAnswered
                        ? "var(--danger)"
                        : "var(--text-muted)",
                    }}
                  >
                    {isCorrect ? <Check className="w-3.5 h-3.5" /> : wasAnswered ? <X className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
                      {q.question}
                    </p>
                    {!isCorrect && (
                      <p className="text-xs" style={{ color: "var(--success)" }}>
                        ✓ Risposta corretta: {OPTION_LETTERS[q.correct]}. {q.options[q.correct]}
                      </p>
                    )}
                    {!isCorrect && wasAnswered && (
                      <p className="text-xs mt-0.5" style={{ color: "var(--danger)" }}>
                        ✗ Tua risposta: {OPTION_LETTERS[userAnswer]}. {q.options[userAnswer]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── PLAYING ────────────────────────────────────────────────────────────────
  const isCorrect = selected === question.correct;

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col px-4 py-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => handleRestart(shuffled)}
            className="flex items-center gap-1 text-sm hover:opacity-70 transition-opacity"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Esci
          </button>
          <div className="flex items-center gap-3">
            {shuffled && (
              <span
                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "var(--accent-subtle)", color: "var(--accent)" }}
              >
                <Shuffle className="w-3 h-3" />
                Shuffle
              </span>
            )}
            <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              {currentIndex + 1} / {total}
            </span>
          </div>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface-2)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: "var(--accent)" }}
          />
        </div>
      </div>

      {/* Question */}
      <div
        className="rounded-2xl border p-6 mb-5"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: "var(--accent)" }}
        >
          Domanda {currentIndex + 1}
        </div>
        <p className="text-lg font-semibold leading-relaxed" style={{ color: "var(--text)" }}>
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3 flex-1">
        {question.options.map((opt, i) => {
          let borderColor = "var(--border)";
          let bgColor = "var(--surface)";
          let textColor = "var(--text)";
          let icon = null;

          if (confirmed) {
            if (i === question.correct) {
              borderColor = "var(--success)";
              bgColor = "var(--success-subtle)";
              textColor = "var(--success)";
              icon = <Check className="w-4 h-4 shrink-0" />;
            } else if (i === selected && selected !== question.correct) {
              borderColor = "var(--danger)";
              bgColor = "var(--danger-subtle)";
              textColor = "var(--danger)";
              icon = <X className="w-4 h-4 shrink-0" />;
            } else {
              textColor = "var(--text-muted)";
            }
          } else if (i === selected) {
            borderColor = "var(--accent)";
            bgColor = "var(--accent-subtle)";
            textColor = "var(--accent)";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={confirmed}
              className="w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.01] disabled:cursor-default"
              style={{
                backgroundColor: bgColor,
                borderColor: borderColor,
                color: textColor,
              }}
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  backgroundColor:
                    i === selected || (confirmed && i === question.correct)
                      ? "color-mix(in srgb, currentColor 20%, transparent)"
                      : "var(--surface-2)",
                }}
              >
                {OPTION_LETTERS[i]}
              </span>
              <span className="text-sm font-medium flex-1">{opt}</span>
              {icon}
            </button>
          );
        })}
      </div>

      {/* Action button */}
      <div className="mt-6">
        {!confirmed ? (
          <button
            onClick={handleConfirm}
            disabled={selected === null}
            className="w-full py-3.5 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--accent)", color: "#fff" }}
          >
            Conferma risposta
          </button>
        ) : (
          <div className="space-y-3">
            <div
              className="rounded-xl p-3 text-center text-sm font-medium"
              style={{
                backgroundColor: isCorrect ? "var(--success-subtle)" : "var(--danger-subtle)",
                color: isCorrect ? "var(--success)" : "var(--danger)",
              }}
            >
              {isCorrect
                ? "✓ Risposta corretta!"
                : `✗ Sbagliato — La risposta era: ${OPTION_LETTERS[question.correct]}. ${question.options[question.correct]}`}
            </div>
            <button
              onClick={handleNext}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--accent)", color: "#fff" }}
            >
              {currentIndex + 1 >= total ? "Vedi risultati" : "Prossima domanda"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
