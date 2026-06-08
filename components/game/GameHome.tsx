"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Plus, Users } from "lucide-react";
import type { Subject } from "@/lib/types";
import type { GameContentMode, GameCreateResult } from "@/lib/game/types";

type Props = {
  subjects: Subject[];
};

type ApiError = {
  message?: string;
};

export default function GameHome({ subjects }: Props) {
  const router = useRouter();
  const [createUsername, setCreateUsername] = useState("");
  const [joinUsername, setJoinUsername] = useState("");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [mode, setMode] = useState<GameContentMode>("MIXED");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const selectedSubject = useMemo(() => subjects.find((subject) => subject.id === subjectId), [subjectId, subjects]);

  async function submitCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await post<GameCreateResult>("/api/game/rooms", { username: createUsername, subjectId, mode });
      saveToken(result.code, result.playerId, result.playerToken);
      router.push(`/game/${result.code}`);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Errore durante la creazione.");
    } finally {
      setBusy(false);
    }
  }

  async function submitJoin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await post<GameCreateResult>("/api/game/rooms/join", { username: joinUsername, code });
      saveToken(result.code, result.playerId, result.playerToken);
      router.push(`/game/${result.code}`);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Errore durante il join.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-shell game-page">
      <div className="page-header">
        <p className="section-kicker">Game</p>
        <h1 className="page-title">Room multiplayer</h1>
        <p className="page-subtitle">Crea una stanza o entra con un codice. Gli username valgono solo dentro la room.</p>
      </div>

      {error && <div className="game-error">{error}</div>}

      <div className="game-home-grid">
        <section className="game-panel">
          <div className="game-panel-head">
            <Plus className="h-5 w-5" />
            <h2>Crea room</h2>
          </div>
          <form onSubmit={submitCreate} className="game-form">
            <label>
              Username
              <input value={createUsername} onChange={(event) => setCreateUsername(event.target.value)} maxLength={24} required />
            </label>
            <label>
              Materia
              <select value={subjectId} onChange={(event) => setSubjectId(event.target.value)} required>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="game-mode-grid" role="radiogroup" aria-label="Modalita contenuti">
              {modeOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setMode(option.value)}
                  className={mode === option.value ? "active" : ""}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="game-help">
              {selectedSubject?.name ?? "Materia"}: il sistema usera tutti gli item compatibili della materia.
            </p>
            <button className="primary-button" disabled={busy || subjects.length === 0}>
              <Users className="h-4 w-4" />
              Crea
            </button>
          </form>
        </section>

        <section className="game-panel">
          <div className="game-panel-head">
            <LogIn className="h-5 w-5" />
            <h2>Join room</h2>
          </div>
          <form onSubmit={submitJoin} className="game-form">
            <label>
              Username
              <input value={joinUsername} onChange={(event) => setJoinUsername(event.target.value)} maxLength={24} required />
            </label>
            <label>
              Codice
              <input
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                maxLength={6}
                required
                className="game-code-input"
              />
            </label>
            <button className="secondary-button" disabled={busy}>
              <LogIn className="h-4 w-4" />
              Entra
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

const modeOptions: { value: GameContentMode; label: string }[] = [
  { value: "MIXED", label: "Entrambi" },
  { value: "QUIZ", label: "Solo quiz" },
  { value: "FLASHCARD", label: "Solo flashcard" },
];

async function post<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as ApiError;
    throw new Error(error.message ?? "Richiesta non riuscita.");
  }
  return response.json() as Promise<T>;
}

function saveToken(code: string, playerId: string, playerToken: string) {
  window.localStorage.setItem(`plantasia-game-${code}`, JSON.stringify({ playerId, playerToken }));
}
