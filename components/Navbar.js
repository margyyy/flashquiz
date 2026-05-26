"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun, Wifi, BookOpen, HelpCircle } from "lucide-react";

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const pathname = usePathname();

  const isActive = (href) => pathname.startsWith(href);

  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{
        backgroundColor: "color-mix(in srgb, var(--surface) 80%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center"
          style={{ color: "var(--accent)" }}
        >
          <Wifi className="w-5 h-5" />
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link
            href="/flashcard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              color: isActive("/flashcard") ? "var(--accent)" : "var(--text-muted)",
              backgroundColor: isActive("/flashcard") ? "var(--accent-subtle)" : "transparent",
            }}
          >
            <BookOpen className="w-4 h-4" />
            Flashcard
          </Link>
          <Link
            href="/quiz"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              color: isActive("/quiz") ? "var(--accent)" : "var(--text-muted)",
              backgroundColor: isActive("/quiz") ? "var(--accent-subtle)" : "transparent",
            }}
          >
            <HelpCircle className="w-4 h-4" />
            Quiz
          </Link>

          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            className="ml-2 p-2 rounded-lg transition-all hover:opacity-80"
            style={{
              backgroundColor: "var(--surface-2)",
              color: "var(--text-muted)",
            }}
            title={dark ? "Modalità chiara" : "Modalità scura"}
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
