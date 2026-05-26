import Link from "next/link";
import { BookOpen, HelpCircle, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-xl">
        {/* Flashcard */}
        <Link href="/flashcard" className="group block">
          <div
            className="relative overflow-hidden rounded-2xl border p-7 h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
              style={{
                background:
                  "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 60%)",
              }}
            />
            <div className="relative">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: "var(--accent-subtle)" }}
              >
                <BookOpen className="w-5 h-5" style={{ color: "var(--accent)" }} />
              </div>
              <h2 className="text-xl font-semibold mb-1" style={{ color: "var(--text)" }}>
                Flashcard
              </h2>
              <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
                4 set · 34 carte
              </p>
              <div
                className="flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all"
                style={{ color: "var(--accent)" }}
              >
                Inizia
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>

        {/* Quiz */}
        <Link href="/quiz" className="group block">
          <div
            className="relative overflow-hidden rounded-2xl border p-7 h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
              style={{
                background:
                  "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--success) 8%, transparent) 0%, transparent 60%)",
              }}
            />
            <div className="relative">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: "var(--success-subtle)" }}
              >
                <HelpCircle className="w-5 h-5" style={{ color: "var(--success)" }} />
              </div>
              <h2 className="text-xl font-semibold mb-1" style={{ color: "var(--text)" }}>
                Quiz
              </h2>
              <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
                57 domande
              </p>
              <div
                className="flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all"
                style={{ color: "var(--success)" }}
              >
                Inizia
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
