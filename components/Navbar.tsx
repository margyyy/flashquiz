"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { BookOpen, Moon, Settings, Sprout, Sun } from "lucide-react";

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <nav className="nav-shell">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-[var(--text)]">
          <Sprout className="h-5 w-5 text-[var(--accent)]" />
          <span className="font-semibold tracking-wide">plantasia</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link className={`nav-link ${isActive("/study") ? "active" : ""}`} href="/study">
            <BookOpen className="h-4 w-4" />
            Studio
          </Link>
          <Link className={`nav-link ${isActive("/admin") ? "active" : ""}`} href="/admin">
            <Settings className="h-4 w-4" />
            Admin
          </Link>
          <button
            onClick={toggle}
            className="icon-button"
            title={dark ? "Modalita chiara" : "Modalita scura"}
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
