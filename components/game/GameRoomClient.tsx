"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Clock, Copy, Crown, Play, RefreshCcw, Trophy, X } from "lucide-react";
import type { GameCard, GameCreateResult, GameRoomState } from "@/lib/game/types";

type Props = {
  code: string;
};

type StoredPlayer = {
  playerId: string;
  playerToken: string;
};

const optionLetters = ["A", "B", "C", "D", "E"];

export default function GameRoomClient({ code }: Props) {
  const [stored, setStored] = useState<StoredPlayer | null>(() => (typeof window === "undefined" ? null : loadToken(code)));
  const [state, setState] = useState<GameRoomState | null>(null);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const timeoutSentFor = useRef<string | null>(null);

  const me = useMemo(() => state?.players.find((player) => player.id === state.selfPlayerId) ?? null, [state]);
  const host = useMemo(() => state?.players.find((player) => player.isHost) ?? null, [state]);
  const activePlayer = useMemo(() => state?.players.find((player) => player.id === state.currentPlayerId) ?? null, [state]);
  const responder = useMemo(() => state?.players.find((player) => player.id === state.currentResponderId) ?? null, [state]);
  const playedBy = useMemo(() => state?.players.find((player) => player.id === state.activeCard?.playedById) ?? null, [state]);

  const timeoutAction = useCallback(async () => {
    if (!stored) return;
    try {
      await post(`/api/game/rooms/${code}/timeout`, { playerToken: stored.playerToken });
      const next = await getState(code, stored.playerToken);
      setState(next);
      setSelected([]);
    } catch {
      // Another client may have advanced the timeout first.
    }
  }, [code, stored]);

  useEffect(() => {
    if (!stored) return;
    const currentStored = stored;
    let alive = true;

    async function refresh() {
      try {
        const next = await getState(code, currentStored.playerToken);
        if (alive) {
          setState(next);
          setError("");
        }
      } catch (apiError) {
        if (alive) setError(apiError instanceof Error ? apiError.message : "Errore di sincronizzazione.");
      }
    }

    refresh();
    const interval = window.setInterval(refresh, state?.status === "FINISHED" ? 5000 : 1500);
    return () => {
      alive = false;
      window.clearInterval(interval);
    };
  }, [code, stored, state?.status]);

  useEffect(() => {
    if (!stored || !state?.timerEnabled || !state.responderDeadlineAt || !state.activeCard) {
      timeoutSentFor.current = null;
      return;
    }

    const deadlineKey = `${state.activeCard.card.id}-${state.currentResponderId}-${state.responderDeadlineAt}`;
    const tick = () => {
      const remaining = Math.ceil((new Date(state.responderDeadlineAt ?? "").getTime() - Date.now()) / 1000);
      setRemainingSeconds(Math.max(0, remaining));
      if (remaining <= 0 && timeoutSentFor.current !== deadlineKey) {
        timeoutSentFor.current = deadlineKey;
        timeoutAction();
      }
    };

    const interval = window.setInterval(tick, 250);
    return () => window.clearInterval(interval);
  }, [state?.timerEnabled, state?.responderDeadlineAt, state?.activeCard, state?.currentResponderId, stored, timeoutAction]);

  async function join(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await post<GameCreateResult>("/api/game/rooms/join", { code, username });
      saveToken(result.code, result.playerId, result.playerToken);
      setStored({ playerId: result.playerId, playerToken: result.playerToken });
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Join non riuscito.");
    } finally {
      setBusy(false);
    }
  }

  async function action(path: string, body: Record<string, unknown> = {}) {
    if (!stored) return;
    setBusy(true);
    setError("");
    try {
      await post(`/api/game/rooms/${code}/${path}`, { ...body, playerToken: stored.playerToken });
      const next = await getState(code, stored.playerToken);
      setState(next);
      setSelected([]);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Azione non riuscita.");
    } finally {
      setBusy(false);
    }
  }

  if (!stored) {
    return (
      <div className="page-shell game-page">
        <Link href="/game" className="back-link">
          <ArrowLeft className="h-4 w-4" />
          Game
        </Link>
        <section className="game-panel game-join-panel">
          <p className="section-kicker">Room {code}</p>
          <h1>Entra nella room</h1>
          {error && <div className="game-error">{error}</div>}
          <form onSubmit={join} className="game-form">
            <label>
              Username
              <input value={username} onChange={(event) => setUsername(event.target.value)} maxLength={24} required />
            </label>
            <button className="primary-button" disabled={busy}>
              Entra
            </button>
          </form>
        </section>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="study-shell">
        <section className="intro-panel">
          <RefreshCcw className="h-5 w-5 text-[var(--accent)]" />
          <h1>Sincronizzazione room</h1>
          {error && <p className="game-inline-error">{error}</p>}
        </section>
      </div>
    );
  }

  return (
    <div className="page-shell game-page">
      <div className="game-room-topbar">
        <Link href="/game" className="back-link">
          <ArrowLeft className="h-4 w-4" />
          Game
        </Link>
        <button type="button" className="secondary-button compact-button" onClick={() => navigator.clipboard?.writeText(code)}>
          <Copy className="h-4 w-4" />
          {code}
        </button>
      </div>

      <div className="page-header">
        <p className="section-kicker">{state.subject.name}</p>
        <h1 className="page-title">Room {state.code}</h1>
        <p className="page-subtitle">
          {modeLabel(state.mode)} · {timerLabel(state)} · {state.players.length}/6 giocatori · Host: {host?.username ?? "n/d"}
        </p>
      </div>

      {error && <div className="game-error">{error}</div>}

      <div className="game-room-grid">
        <aside className="game-scoreboard">
          <h2>Giocatori</h2>
          {state.players.map((player) => (
            <div key={player.id} className={`game-player-row ${player.id === me?.id ? "self" : ""}`}>
              <span>
                {player.isHost && <Crown className="h-4 w-4" />}
                {player.username}
              </span>
              <strong>{player.score}</strong>
              <em>{player.deckCount}</em>
            </div>
          ))}
        </aside>

        {state.status === "LOBBY" && (
          <section className="game-panel">
            <p className="section-kicker">Lobby</p>
            <h2>In attesa del draft</h2>
            <p className="game-help">
              {state.contentCount} carte disponibili. Le carte per mazzo devono essere multipli di {Math.max(1, state.players.length - 1)}.
            </p>
            {me?.isHost ? (
              <div className="game-lobby-controls">
                <label>
                  Carte per mazzo
                  <select
                    value={state.validDeckSizes.includes(state.deckSize) ? state.deckSize : ""}
                    onChange={(event) => action("deck-size", { deckSize: Number.parseInt(event.target.value, 10) })}
                    disabled={busy || state.validDeckSizes.length === 0}
                  >
                    {!state.validDeckSizes.includes(state.deckSize) && <option value="">Scegli</option>}
                    {state.validDeckSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="primary-button"
                  onClick={() => action("start-draft")}
                  disabled={busy || state.players.length < 2 || !state.validDeckSizes.includes(state.deckSize)}
                >
                  <Play className="h-4 w-4" />
                  Inizia draft
                </button>
              </div>
            ) : (
              <p className="game-help">
                Carte per mazzo: {state.validDeckSizes.includes(state.deckSize) ? state.deckSize : "da scegliere"}. Aspetta che il creatore avvii il draft.
              </p>
            )}
          </section>
        )}

        {state.status === "DRAFT" && (
          <DraftView state={state} busy={busy} onPick={(cardId) => action("draft-pick", { cardId })} />
        )}

        {state.status === "PLAYING" && (
          <PlayingView
            state={state}
            meId={me?.id ?? ""}
            activePlayerName={activePlayer?.username ?? ""}
            responderName={responder?.username ?? ""}
            playedByName={playedBy?.username ?? ""}
            selected={selected}
            setSelected={setSelected}
            busy={busy}
            onPlay={(cardId) => action("play-card", { cardId })}
            onAnswer={(body) => action("answer", body)}
            remainingSeconds={remainingSeconds}
          />
        )}

        {state.status === "FINISHED" && <ResultsView players={state.players} />}
      </div>
    </div>
  );
}

function DraftView({ state, busy, onPick }: { state: GameRoomState; busy: boolean; onPick: (cardId: string) => void }) {
  const me = state.players.find((player) => player.id === state.selfPlayerId);
  const done = me ? me.draftPicks >= state.deckSize : false;

  return (
    <section className="game-panel">
      <p className="section-kicker">Draft</p>
      <h2>Scegli una carta</h2>
      <p className="game-help">Deck: {me?.draftPicks ?? 0}/{state.deckSize}</p>
      {done ? (
        <p className="game-help">Deck completato. Aspetta gli altri giocatori.</p>
      ) : (
        <div className="game-card-choice-grid">
          {state.draftOffer.map((card) => (
            <button key={card.id} className="game-card-choice" onClick={() => onPick(card.id)} disabled={busy}>
              <span>{card.kind === "FLASHCARD" ? "Flashcard" : "Quiz"}</span>
              <strong>{card.prompt}</strong>
              <em>{card.setName}</em>
            </button>
          ))}
        </div>
      )}
      <div className="game-draft-progress">
        {state.players.map((player) => (
          <span key={player.id}>
            {player.username}: {player.draftPicks}/{state.deckSize}
          </span>
        ))}
      </div>
    </section>
  );
}

function PlayingView({
  state,
  meId,
  activePlayerName,
  responderName,
  playedByName,
  selected,
  setSelected,
  busy,
  onPlay,
  onAnswer,
  remainingSeconds,
}: {
  state: GameRoomState;
  meId: string;
  activePlayerName: string;
  responderName: string;
  playedByName: string;
  selected: number[];
  setSelected: (value: number[]) => void;
  busy: boolean;
  onPlay: (cardId: string) => void;
  onAnswer: (body: Record<string, unknown>) => void;
  remainingSeconds: number | null;
}) {
  const card = state.activeCard?.card ?? null;

  function toggle(card: GameCard, index: number) {
    if (!card.allowMultiple) {
      setSelected([index]);
      return;
    }
    setSelected(selected.includes(index) ? selected.filter((item) => item !== index) : [...selected, index]);
  }

  if (!card) {
    return (
      <section className="game-panel">
        <p className="section-kicker">Turno</p>
        <h2>{activePlayerName} contro {responderName}</h2>
        {state.currentPlayerId === meId ? (
          <>
            <p className="game-help">Scegli una carta dalla tua mano per questo avversario.</p>
            <div className="game-hand-grid">
              {state.handCards.map((handCard) => (
                <button key={handCard.id} className="game-card-choice" disabled={busy} onClick={() => onPlay(handCard.id)}>
                  <span>{handCard.kind === "FLASHCARD" ? "Flashcard" : "Quiz"}</span>
                  <strong>{handCard.prompt}</strong>
                  <em>{handCard.setName}</em>
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="game-help">Aspetta che giochi la prossima carta.</p>
        )}
      </section>
    );
  }

  const isQuiz = card.kind !== "FLASHCARD";
  const isResponder = state.currentResponderId === meId;
  const isJudge = state.activeCard?.playedById === meId;

  return (
    <section className="game-panel">
      <p className="section-kicker">
        {playedByName} ha giocato · Risponde {responderName}
      </p>
      {state.timerEnabled && remainingSeconds !== null && (
        <div className={`game-timer ${remainingSeconds <= 5 ? "danger" : ""}`}>
          <Clock className="h-4 w-4" />
          {remainingSeconds}s
        </div>
      )}
      <div className="game-active-card">
        <span>{isQuiz ? "Quiz" : "Flashcard"}</span>
        <h2>{card.prompt}</h2>
        {!isQuiz && isJudge && <p>{card.answer}</p>}
      </div>

      {isQuiz && isResponder && (
        <>
          <div className="game-answer-list">
            {(card.options ?? []).map((option, index) => (
              <button
                key={option}
                type="button"
                className={selected.includes(index) ? "active" : ""}
                onClick={() => toggle(card, index)}
              >
                <span>{optionLetters[index]}</span>
                {option}
              </button>
            ))}
          </div>
          <button className="primary-button" disabled={busy || selected.length === 0} onClick={() => onAnswer({ selectedIndexes: selected })}>
            Conferma
          </button>
        </>
      )}

      {!isQuiz && isJudge && (
        <div className="game-judge-actions">
          <button className="game-judge-button success" disabled={busy} onClick={() => onAnswer({ correct: true })}>
            <Check className="h-5 w-5" />
            La sa
          </button>
          <button className="game-judge-button danger" disabled={busy} onClick={() => onAnswer({ correct: false })}>
            <X className="h-5 w-5" />
            Non la sa
          </button>
        </div>
      )}

      {((isQuiz && !isResponder) || (!isQuiz && !isJudge)) && (
        <p className="game-help">In attesa della risposta o della valutazione.</p>
      )}
    </section>
  );
}

function ResultsView({ players }: { players: GameRoomState["players"] }) {
  const ranking = [...players].sort((a, b) => b.score - a.score || a.joinOrder - b.joinOrder);

  return (
    <section className="game-panel">
      <p className="section-kicker">Risultati</p>
      <h2>Classifica finale</h2>
      <div className="game-ranking">
        {ranking.map((player, index) => (
          <div key={player.id} className="game-ranking-row">
            <span>
              {index === 0 && <Trophy className="h-4 w-4" />}
              {index + 1}. {player.username}
            </span>
            <strong>{player.score}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function modeLabel(mode: GameRoomState["mode"]) {
  if (mode === "QUIZ") return "Solo quiz";
  if (mode === "FLASHCARD") return "Solo flashcard";
  return "Quiz e flashcard";
}

function timerLabel(state: GameRoomState) {
  return state.timerEnabled ? `Timer ${state.timerSeconds}s` : "Timer off";
}

function loadToken(code: string): StoredPlayer | null {
  try {
    const raw = window.localStorage.getItem(`plantasia-game-${code}`);
    if (!raw) return null;
    const value = JSON.parse(raw) as StoredPlayer;
    return typeof value.playerToken === "string" && typeof value.playerId === "string" ? value : null;
  } catch {
    return null;
  }
}

function saveToken(code: string, playerId: string, playerToken: string) {
  window.localStorage.setItem(`plantasia-game-${code}`, JSON.stringify({ playerId, playerToken }));
}

async function getState(code: string, token: string) {
  const response = await fetch(`/api/game/rooms/${code}?token=${encodeURIComponent(token)}`, { cache: "no-store" });
  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(error.message ?? "Room non disponibile.");
  }
  return response.json() as Promise<GameRoomState>;
}

async function post<T = { ok: true }>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(error.message ?? "Richiesta non riuscita.");
  }
  return response.json() as Promise<T>;
}
