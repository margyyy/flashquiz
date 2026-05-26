"use client";
import Link from "next/link";
import { flashcardSets, getAllCards } from "@/lib/flashcards";
import { BookOpen, Layers, ArrowRight, ArrowLeft } from "lucide-react";

const setColors = [
  { bg: "#eef2ff", text: "#6366f1", dark_bg: "#1e1e3f", label: "Architettura" },
  { bg: "#fef3c7", text: "#d97706", dark_bg: "#3b1a00", label: "Indirizzi IP" },
  { bg: "#d1fae5", text: "#059669", dark_bg: "#064e3b", label: "Livello App" },
  { bg: "#fce7f3", text: "#db2777", dark_bg: "#500724", label: "Trasporto" },
];

export default function FlashcardMenu() {
  const totalCards = getAllCards().length;

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 py-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm mb-6 hover:opacity-70 transition-opacity"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Torna alla home
        </Link>
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>
          Flashcard
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          {flashcardSets.length} set disponibili · {totalCards} carte totali
        </p>
      </div>

      {/* Study all */}
      <Link href="/flashcard/all" className="group block mb-6">
        <div
          className="relative overflow-hidden rounded-2xl border p-6 transition-all duration-200 hover:scale-[1.01] hover:shadow-xl"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--accent-light)" }}
        >
          <div
            className="absolute inset-0 opacity-20 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, var(--accent-subtle), transparent)",
            }}
          />
          <div className="relative flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--accent-subtle)" }}
            >
              <Layers className="w-6 h-6" style={{ color: "var(--accent)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-lg" style={{ color: "var(--text)" }}>
                🎲 Studia tutti i set
              </h2>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Tutte le {totalCards} carte mescolate casualmente
              </p>
            </div>
            <div
              className="flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all shrink-0"
              style={{ color: "var(--accent)" }}
            >
              Inizia
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>

      {/* Individual sets */}
      <div className="grid gap-4">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Oppure scegli un set specifico
        </p>
        {flashcardSets.map((set, i) => {
          const color = setColors[i % setColors.length];
          return (
            <Link key={set.id} href={`/flashcard/${set.id}`} className="group block">
              <div
                className="rounded-2xl border p-5 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg flex items-center gap-4"
                style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg font-bold"
                  style={{ backgroundColor: color.bg, color: color.text }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold" style={{ color: "var(--text)" }}>
                    {set.name}
                  </h3>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {set.cards.length} carte
                  </p>
                </div>
                <div
                  className="flex items-center gap-1 text-xs font-medium group-hover:gap-2 transition-all shrink-0"
                  style={{ color: color.text }}
                >
                  Studia
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
