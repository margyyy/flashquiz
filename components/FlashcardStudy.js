"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { flashcardSets, getAllCards, shuffle } from "@/lib/flashcards";
import {
  ArrowLeft,
  Check,
  X,
  SkipForward,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function getCards(setId) {
  if (setId === "all") return getAllCards();
  const id = parseInt(setId, 10);
  const set = flashcardSets.find((s) => s.id === id);
  if (!set) return [];
  return set.cards.map((c) => ({ ...c, setName: set.name, setId: set.id }));
}

export default function FlashcardStudy({ setId }) {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]); // card ids marked "lo so"
  const [unknown, setUnknown] = useState([]); // card ids marked "non lo so"
  const [skipped, setSkipped] = useState([]); // card ids skipped (will be appended)
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const raw = getCards(setId);
    setCards(shuffle(raw));
    setIndex(0);
    setFlipped(false);
    setKnown([]);
    setUnknown([]);
    setSkipped([]);
    setFinished(false);
  }, [setId]);

  const current = cards[index];
  const total = cards.length;
  const progress = total > 0 ? ((index) / total) * 100 : 0;

  const setName =
    setId === "all"
      ? "Tutti i set"
      : flashcardSets.find((s) => s.id === parseInt(setId, 10))?.name ?? "Set";

  const handleKnown = useCallback(() => {
    if (!current) return;
    setKnown((prev) => [...prev, current.id]);
    advance();
  }, [current, index, cards]);

  const handleUnknown = useCallback(() => {
    if (!current) return;
    setUnknown((prev) => [...prev, current.id]);
    advance();
  }, [current, index, cards]);

  const handleSkip = useCallback(() => {
    if (!current) return;
    // Move current card to end
    setCards((prev) => {
      const next = [...prev];
      const [card] = next.splice(index, 1);
      next.push(card);
      return next;
    });
    setFlipped(false);
    setSkipped((prev) => [...prev, current.id]);
    // index stays same (next card comes up)
  }, [current, index]);

  const advance = useCallback(() => {
    setFlipped(false);
    setTimeout(() => {
      if (index + 1 >= cards.length) {
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
      }
    }, 150);
  }, [index, cards]);

  const restart = () => {
    const raw = getCards(setId);
    setCards(shuffle(raw));
    setIndex(0);
    setFlipped(false);
    setKnown([]);
    setUnknown([]);
    setSkipped([]);
    setFinished(false);
  };

  if (!current && !finished) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <p style={{ color: "var(--text-muted)" }}>Set non trovato.</p>
      </div>
    );
  }

  if (finished) {
    const knownCount = known.length;
    const unknownCount = unknown.length;
    const total = knownCount + unknownCount;
    const pct = total > 0 ? Math.round((knownCount / total) * 100) : 0;

    return (
      <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-md rounded-3xl border p-10 text-center"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="text-6xl mb-4">
            {pct >= 80 ? "🎉" : pct >= 50 ? "💪" : "📚"}
          </div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
            Studio completato!
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            {setName}
          </p>

          {/* Score */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-5xl font-bold" style={{ color: "var(--accent)" }}>
              {pct}%
            </span>
          </div>

          {/* Bar */}
          <div className="h-3 rounded-full mb-6 overflow-hidden" style={{ backgroundColor: "var(--surface-2)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                backgroundColor: pct >= 80 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--danger)",
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: "var(--success-subtle)" }}
            >
              <div className="text-2xl font-bold mb-1" style={{ color: "var(--success)" }}>
                {knownCount}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                Lo sapevo ✓
              </div>
            </div>
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: "var(--danger-subtle)" }}
            >
              <div className="text-2xl font-bold mb-1" style={{ color: "var(--danger)" }}>
                {unknownCount}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                Da ripassare ✗
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={restart}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--accent)", color: "#fff" }}
            >
              <RotateCcw className="w-4 h-4" />
              Studia di nuovo
            </button>
            <button
              onClick={() => router.push("/flashcard")}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--surface-2)", color: "var(--text)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Cambia set
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center px-4 py-8">
      {/* Header */}
      <div className="w-full max-w-xl mb-6">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => router.push("/flashcard")}
            className="flex items-center gap-1 text-sm hover:opacity-70 transition-opacity"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            {setName}
          </button>
          <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            {index + 1} / {total}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface-2)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: "var(--accent)" }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-xl flex-1 flex items-center justify-center">
        <div
          className="w-full perspective-1000"
          style={{ perspective: "1000px" }}
        >
          <div
            className="relative w-full cursor-pointer"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              minHeight: "280px",
            }}
            onClick={() => setFlipped((f) => !f)}
          >
            {/* Front */}
            <div
              className="absolute inset-0 rounded-3xl border p-8 flex flex-col items-center justify-center"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-4 px-3 py-1 rounded-full"
                style={{ backgroundColor: "var(--accent-subtle)", color: "var(--accent)" }}
              >
                Domanda
              </div>
              <p
                className="text-center text-lg font-medium leading-relaxed"
                style={{ color: "var(--text)" }}
              >
                {current.front}
              </p>
              <p className="mt-6 text-xs" style={{ color: "var(--text-muted)" }}>
                Tocca per vedere la risposta
              </p>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 rounded-3xl border p-8 flex flex-col items-center justify-center overflow-y-auto"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                backgroundColor: "var(--accent-subtle)",
                borderColor: "var(--accent-light)",
              }}
            >
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-4 px-3 py-1 rounded-full"
                style={{ backgroundColor: "var(--accent)", color: "#fff" }}
              >
                Risposta
              </div>
              <p
                className="text-center text-sm leading-relaxed"
                style={{ color: "var(--text)" }}
              >
                {current.back}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-xl mt-8 space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleUnknown}
            className="flex flex-col items-center gap-1 py-4 rounded-2xl border font-medium transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--danger-subtle)",
              borderColor: "var(--danger)",
              color: "var(--danger)",
            }}
          >
            <X className="w-5 h-5" />
            <span className="text-xs">Non lo so</span>
          </button>

          <button
            onClick={handleSkip}
            className="flex flex-col items-center gap-1 py-4 rounded-2xl border font-medium transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--surface-2)",
              borderColor: "var(--border)",
              color: "var(--text-muted)",
            }}
          >
            <SkipForward className="w-5 h-5" />
            <span className="text-xs">Salta</span>
          </button>

          <button
            onClick={handleKnown}
            className="flex flex-col items-center gap-1 py-4 rounded-2xl border font-medium transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--success-subtle)",
              borderColor: "var(--success)",
              color: "var(--success)",
            }}
          >
            <Check className="w-5 h-5" />
            <span className="text-xs">Lo so</span>
          </button>
        </div>
      </div>
    </div>
  );
}
