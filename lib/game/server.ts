import { createHash, randomBytes } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma, hasDatabaseUrl } from "@/lib/prisma";
import type { GameCard, GameContentMode, GameRoomState } from "./types";

const DECK_SIZE = 8;
const OFFER_SIZE = 3;
const MAX_PLAYERS = 6;
const ROOM_TTL_HOURS = 24;

type GameDb = NonNullable<typeof prisma> | Prisma.TransactionClient;

type RoomWithPlayers = Awaited<ReturnType<typeof findRoom>>;

function getDb(): GameDb {
  if (!hasDatabaseUrl() || !prisma) throw new GameError("Il database e richiesto per le room multiplayer.", 503);
  return prisma;
}

export class GameError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function parseMode(value: unknown): GameContentMode {
  const mode = cleanText(value).toUpperCase();
  if (mode === "QUIZ" || mode === "FLASHCARD" || mode === "MIXED") return mode;
  throw new GameError("Modalita contenuti non valida.");
}

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function makeToken() {
  return randomBytes(24).toString("base64url");
}

function makeCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

function expiresAt() {
  return new Date(Date.now() + ROOM_TTL_HOURS * 60 * 60 * 1000);
}

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [next[index], next[target]] = [next[target], next[index]];
  }
  return next;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function cardsArray(value: unknown): GameCard[] {
  return Array.isArray(value)
    ? value.filter((item): item is GameCard => Boolean(item) && typeof item === "object" && "id" in item)
    : [];
}

function activeCardData(value: unknown): { cardId: string; playedById: string } | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  return typeof data.cardId === "string" && typeof data.playedById === "string"
    ? { cardId: data.cardId, playedById: data.playedById }
    : null;
}

function responseMap(value: unknown): Record<string, boolean> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, boolean] => typeof entry[1] === "boolean"),
  );
}

function getCard(content: GameCard[], cardId: string) {
  const card = content.find((item) => item.id === cardId);
  if (!card) throw new GameError("Carta non trovata nello snapshot della room.", 409);
  return card;
}

async function findRoom(db: GameDb, code: string) {
  return db.gameRoom.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      subject: { select: { id: true, name: true, slug: true } },
      players: { orderBy: { joinOrder: "asc" } },
    },
  });
}

function assertRoom(room: NonNullable<RoomWithPlayers>) {
  if (room.expiresAt.getTime() < Date.now()) throw new GameError("Room scaduta.", 410);
}

function assertPlayer(room: NonNullable<RoomWithPlayers>, playerToken: string) {
  const hash = tokenHash(playerToken);
  const player = room.players.find((item) => item.tokenHash === hash);
  if (!player) throw new GameError("Player non riconosciuto per questa room.", 401);
  return player;
}

async function loadRoomForPlayer(db: GameDb, code: string, playerToken?: string) {
  const room = await findRoom(db, code);
  if (!room) throw new GameError("Room non trovata.", 404);
  assertRoom(room);
  const player = playerToken ? assertPlayer(room, playerToken) : null;
  return { room, player };
}

async function cleanupExpiredRooms(db: GameDb) {
  await db.gameRoom.deleteMany({ where: { expiresAt: { lt: new Date() } } });
}

async function buildContentSnapshot(db: GameDb, subjectId: string, mode: GameContentMode): Promise<GameCard[]> {
  const subject = await db.subject.findUnique({
    where: { id: subjectId },
    include: { sets: { include: { items: { orderBy: { order: "asc" } } }, orderBy: { name: "asc" } } },
  });

  if (!subject) throw new GameError("Materia non trovata.", 404);

  return subject.sets.flatMap((set) =>
    set.items
      .filter((item) => {
        if (mode === "MIXED") return true;
        if (mode === "FLASHCARD") return item.kind === "FLASHCARD";
        return item.kind === "MULTIPLE_CHOICE" || item.kind === "TRUE_FALSE";
      })
      .map((item) => ({
        id: item.id,
        kind: item.kind,
        prompt: item.prompt,
        answer: item.answer,
        options: Array.isArray(item.options) ? item.options.filter((option): option is string => typeof option === "string") : null,
        correctOptionIndexes: item.correctOptionIndexes,
        allowMultiple: item.allowMultiple,
        explanation: item.explanation,
        setName: set.name,
      })),
  );
}

export async function createGameRoom(input: { subjectId: string; mode: GameContentMode; username: string }) {
  const db = getDb();
  await cleanupExpiredRooms(db);

  const username = cleanText(input.username);
  if (!username) throw new GameError("Username obbligatorio.");
  if (username.length > 24) throw new GameError("Username troppo lungo.");

  const content = shuffle(await buildContentSnapshot(db, input.subjectId, input.mode));
  if (content.length < DECK_SIZE + OFFER_SIZE - 1) {
    throw new GameError("La materia selezionata non ha abbastanza carte per una partita.");
  }

  const playerToken = makeToken();
  const playerHash = tokenHash(playerToken);

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = makeCode();
    try {
      const result = await db.gameRoom.create({
        data: {
          code,
          subjectId: input.subjectId,
          mode: input.mode,
          contentSnapshot: content,
          pool: content.map((card) => card.id),
          expiresAt: expiresAt(),
          players: {
            create: { username, tokenHash: playerHash, joinOrder: 0 },
          },
        },
        include: { players: true },
      });
      const host = result.players[0];
      await db.gameRoom.update({ where: { id: result.id }, data: { hostPlayerId: host.id } });
      return { code, playerId: host.id, playerToken };
    } catch (error) {
      if (attempt === 7) throw error;
    }
  }

  throw new GameError("Impossibile generare un codice room univoco.", 500);
}

export async function joinGameRoom(input: { code: string; username: string }) {
  const db = getDb();
  const username = cleanText(input.username);
  if (!username) throw new GameError("Username obbligatorio.");
  if (username.length > 24) throw new GameError("Username troppo lungo.");

  const room = await findRoom(db, cleanText(input.code));
  if (!room) throw new GameError("Room non trovata.", 404);
  assertRoom(room);
  if (room.status !== "LOBBY") throw new GameError("La partita e gia iniziata.", 409);
  if (room.players.length >= MAX_PLAYERS) throw new GameError("Room piena.", 409);
  if (room.players.some((player) => player.username.toLowerCase() === username.toLowerCase())) {
    throw new GameError("Username gia presente in questa room.", 409);
  }

  const playerToken = makeToken();
  const player = await db.gamePlayer.create({
    data: {
      roomId: room.id,
      username,
      tokenHash: tokenHash(playerToken),
      joinOrder: room.players.length,
    },
  });

  return { code: room.code, playerId: player.id, playerToken };
}

function drawOffer(pool: string[]) {
  if (pool.length < OFFER_SIZE) throw new GameError("Pool carte insufficiente per proporre 3 carte diverse.", 409);
  return { offer: pool.slice(0, OFFER_SIZE), pool: pool.slice(OFFER_SIZE) };
}

function playerDeck(player: { deck: unknown }) {
  return stringArray(player.deck);
}

function nextPlayerWithCards(players: { id: string; deck: unknown }[], turnOrder: string[], afterIndex: number) {
  for (let offset = 1; offset <= turnOrder.length; offset += 1) {
    const index = (afterIndex + offset) % turnOrder.length;
    const player = players.find((item) => item.id === turnOrder[index]);
    if (player && playerDeck(player).length > 0) return index;
  }
  return -1;
}

function responderAt(turnOrder: string[], activePlayerId: string, responderIndex: number, responses: Record<string, boolean>) {
  const responders = turnOrder.filter((id) => id !== activePlayerId && responses[id] === undefined);
  return responders[responderIndex] ?? null;
}

function sameIndexes(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  const left = [...a].sort((x, y) => x - y);
  const right = [...b].sort((x, y) => x - y);
  return left.every((value, index) => value === right[index]);
}

export async function getGameRoomState(code: string, playerToken?: string) {
  const db = getDb();
  const { room, player } = await loadRoomForPlayer(db, code, playerToken);
  if (player) {
    await db.gamePlayer.update({ where: { id: player.id }, data: { lastSeenAt: new Date() } });
  }
  return toRoomState(room, player?.id ?? null);
}

export async function startDraft(code: string, playerToken: string) {
  const db = getDb();

  await db.$transaction(async (tx) => {
    const { room, player } = await loadRoomForPlayer(tx, code, playerToken);
    if (room.hostPlayerId !== player?.id) throw new GameError("Solo il creatore puo avviare il draft.", 403);
    if (room.status !== "LOBBY") throw new GameError("Il draft non puo essere avviato in questa fase.", 409);
    if (room.players.length < 2) throw new GameError("Servono almeno 2 giocatori.", 409);

    const content = cardsArray(room.contentSnapshot);
    const requiredCards = room.players.length * DECK_SIZE + OFFER_SIZE - 1;
    if (content.length < requiredCards) {
      throw new GameError(`Servono almeno ${requiredCards} carte per ${room.players.length} giocatori.`, 409);
    }

    let pool = shuffle(content.map((card) => card.id));
    for (const draftPlayer of room.players) {
      const draw = drawOffer(pool);
      pool = draw.pool;
      await tx.gamePlayer.update({
        where: { id: draftPlayer.id },
        data: { deck: [], draftOffer: draw.offer, draftPicks: 0, score: 0 },
      });
    }

    await tx.gameRoom.update({
      where: { id: room.id },
      data: {
        status: "DRAFT",
        pool,
        activeCard: Prisma.JsonNull,
        activeResponses: Prisma.JsonNull,
        currentTurnIndex: 0,
        currentResponderIndex: 0,
        turnOrder: room.players.map((item) => item.id),
        expiresAt: expiresAt(),
      },
    });
  });
}

export async function draftPick(code: string, playerToken: string, selectedCardId: string) {
  const db = getDb();

  await db.$transaction(async (tx) => {
    const { room, player } = await loadRoomForPlayer(tx, code, playerToken);
    if (!player) throw new GameError("Player non riconosciuto.", 401);
    if (room.status !== "DRAFT") throw new GameError("Non sei nella fase draft.", 409);
    if (player.draftPicks >= DECK_SIZE) throw new GameError("Deck gia completato.", 409);

    const offer = stringArray(player.draftOffer);
    if (!offer.includes(selectedCardId)) throw new GameError("Carta non presente nell'offerta corrente.", 409);

    const deck = [...playerDeck(player), selectedCardId];
    const rejected = offer.filter((id) => id !== selectedCardId);
    let pool = shuffle([...stringArray(room.pool), ...rejected]);
    const draftPicks = player.draftPicks + 1;
    let nextOffer: string[] | null = null;

    if (draftPicks < DECK_SIZE) {
      const draw = drawOffer(pool);
      nextOffer = draw.offer;
      pool = draw.pool;
    }

    await tx.gamePlayer.update({
      where: { id: player.id },
      data: { deck, draftOffer: nextOffer ?? Prisma.JsonNull, draftPicks },
    });

    const players = room.players.map((item) => (item.id === player.id ? { ...item, draftPicks, deck } : item));
    const allDone = players.every((item) => item.draftPicks >= DECK_SIZE);
    await tx.gameRoom.update({
      where: { id: room.id },
      data: {
        pool,
        status: allDone ? "PLAYING" : "DRAFT",
        currentTurnIndex: 0,
        currentResponderIndex: 0,
        activeCard: Prisma.JsonNull,
        activeResponses: Prisma.JsonNull,
        expiresAt: expiresAt(),
      },
    });
  });
}

export async function playCard(code: string, playerToken: string) {
  const db = getDb();

  await db.$transaction(async (tx) => {
    const { room, player } = await loadRoomForPlayer(tx, code, playerToken);
    if (!player) throw new GameError("Player non riconosciuto.", 401);
    if (room.status !== "PLAYING") throw new GameError("La partita non e in corso.", 409);
    if (room.activeCard) throw new GameError("C'e gia una carta al centro.", 409);

    const turnOrder = room.turnOrder.length > 0 ? room.turnOrder : room.players.map((item) => item.id);
    const activePlayerId = turnOrder[room.currentTurnIndex] ?? turnOrder[0];
    if (activePlayerId !== player.id) throw new GameError("Non e il tuo turno.", 409);

    const deck = playerDeck(player);
    if (deck.length === 0) throw new GameError("Il tuo deck e vuoto.", 409);
    const [cardId, ...remainingDeck] = deck;

    await tx.gamePlayer.update({ where: { id: player.id }, data: { deck: remainingDeck } });
    await tx.gameRoom.update({
      where: { id: room.id },
      data: {
        activeCard: { cardId, playedById: player.id },
        activeResponses: {},
        currentResponderIndex: 0,
        expiresAt: expiresAt(),
      },
    });
  });
}

export async function answerCard(
  code: string,
  playerToken: string,
  input: { selectedIndexes?: number[]; correct?: boolean },
) {
  const db = getDb();

  await db.$transaction(async (tx) => {
    const { room, player } = await loadRoomForPlayer(tx, code, playerToken);
    if (!player) throw new GameError("Player non riconosciuto.", 401);
    if (room.status !== "PLAYING") throw new GameError("La partita non e in corso.", 409);

    const active = activeCardData(room.activeCard);
    if (!active) throw new GameError("Non c'e una carta attiva.", 409);

    const content = cardsArray(room.contentSnapshot);
    const card = getCard(content, active.cardId);
    const turnOrder = room.turnOrder.length > 0 ? room.turnOrder : room.players.map((item) => item.id);
    const responses = responseMap(room.activeResponses);
    const responderId = responderAt(turnOrder, active.playedById, room.currentResponderIndex, responses);
    if (!responderId) throw new GameError("Non ci sono rispondenti in attesa.", 409);

    let correct = false;
    if (card.kind === "FLASHCARD") {
      if (player.id !== active.playedById) throw new GameError("Solo chi ha giocato la carta valuta la flashcard.", 403);
      correct = input.correct === true;
    } else {
      if (player.id !== responderId) throw new GameError("Non e il tuo turno di risposta.", 409);
      const selected = Array.isArray(input.selectedIndexes)
        ? input.selectedIndexes.filter((index) => Number.isInteger(index))
        : [];
      if (selected.length === 0) throw new GameError("Seleziona una risposta.");
      correct = sameIndexes(selected, card.correctOptionIndexes);
    }

    const nextResponses = { ...responses, [responderId]: correct };
    if (correct) {
      await tx.gamePlayer.update({ where: { id: responderId }, data: { score: { increment: 1 } } });
    }

    const stillWaiting = turnOrder.filter((id) => id !== active.playedById && nextResponses[id] === undefined);
    if (stillWaiting.length > 0) {
      await tx.gameRoom.update({
        where: { id: room.id },
        data: {
          activeResponses: nextResponses,
          currentResponderIndex: 0,
          expiresAt: expiresAt(),
        },
      });
      return;
    }

    const nextTurnIndex = nextPlayerWithCards(room.players, turnOrder, room.currentTurnIndex);
    await tx.gameRoom.update({
      where: { id: room.id },
      data: {
        status: nextTurnIndex === -1 ? "FINISHED" : "PLAYING",
        activeCard: Prisma.JsonNull,
        activeResponses: Prisma.JsonNull,
        currentTurnIndex: Math.max(nextTurnIndex, 0),
        currentResponderIndex: 0,
        expiresAt: expiresAt(),
      },
    });
  });
}

function toRoomState(room: NonNullable<RoomWithPlayers>, selfPlayerId: string | null): GameRoomState {
  const content = cardsArray(room.contentSnapshot);
  const active = activeCardData(room.activeCard);
  const responses = responseMap(room.activeResponses);
  const turnOrder = room.turnOrder.length > 0 ? room.turnOrder : room.players.map((player) => player.id);
  const currentPlayerId = room.status === "PLAYING" ? turnOrder[room.currentTurnIndex] ?? null : null;
  const currentResponderId = active ? responderAt(turnOrder, active.playedById, room.currentResponderIndex, responses) : null;
  const self = room.players.find((player) => player.id === selfPlayerId);

  return {
    code: room.code,
    subject: room.subject,
    mode: room.mode,
    status: room.status,
    hostPlayerId: room.hostPlayerId,
    currentPlayerId,
    currentResponderId,
    activeCard: active ? { card: getCard(content, active.cardId), playedById: active.playedById } : null,
    draftOffer: self ? stringArray(self.draftOffer).map((id) => getCard(content, id)) : [],
    players: room.players.map((player) => ({
      id: player.id,
      username: player.username,
      joinOrder: player.joinOrder,
      score: player.score,
      deckCount: playerDeck(player).length,
      draftPicks: player.draftPicks,
      isHost: player.id === room.hostPlayerId,
    })),
    selfPlayerId,
    contentCount: content.length,
    poolCount: stringArray(room.pool).length,
    expiresAt: room.expiresAt.toISOString(),
  };
}
