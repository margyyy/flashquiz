import type { StudyItemKind } from "@/lib/types";

export type GameContentMode = "QUIZ" | "FLASHCARD" | "MIXED";
export type GameRoomStatus = "LOBBY" | "DRAFT" | "PLAYING" | "FINISHED";

export type GameCard = {
  id: string;
  kind: StudyItemKind;
  prompt: string;
  answer: string | null;
  options: string[] | null;
  correctOptionIndexes: number[];
  allowMultiple: boolean;
  explanation: string | null;
  setName: string;
};

export type GamePlayerState = {
  id: string;
  username: string;
  joinOrder: number;
  score: number;
  deckCount: number;
  draftPicks: number;
  isHost: boolean;
};

export type ActiveCardState = {
  card: GameCard;
  playedById: string;
  targetPlayerId: string;
};

export type RevealState = ActiveCardState & {
  correct: boolean;
};

export type GameRoomState = {
  code: string;
  subject: { id: string; name: string; slug: string };
  mode: GameContentMode;
  status: GameRoomStatus;
  hostPlayerId: string | null;
  currentPlayerId: string | null;
  currentResponderId: string | null;
  activeCard: ActiveCardState | null;
  reveal: RevealState | null;
  revealUntil: string | null;
  deckSize: number;
  validDeckSizes: number[];
  handCards: GameCard[];
  timerEnabled: boolean;
  timerSeconds: number;
  responderDeadlineAt: string | null;
  draftOffer: GameCard[];
  players: GamePlayerState[];
  selfPlayerId: string | null;
  contentCount: number;
  poolCount: number;
  expiresAt: string;
};

export type GameCreateResult = {
  code: string;
  playerId: string;
  playerToken: string;
};
