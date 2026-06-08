import { NextResponse } from "next/server";
import { createGameRoom, GameError, parseMode, parseTimerSeconds } from "@/lib/game/server";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const data = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    const result = await createGameRoom({
      subjectId: typeof data.subjectId === "string" ? data.subjectId : "",
      mode: parseMode(data.mode),
      username: typeof data.username === "string" ? data.username : "",
      timerEnabled: data.timerEnabled === true,
      timerSeconds: parseTimerSeconds(data.timerSeconds),
    });
    return NextResponse.json(result);
  } catch (error) {
    return gameError(error);
  }
}

function gameError(error: unknown) {
  if (error instanceof GameError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }
  return NextResponse.json({ message: "Errore imprevisto." }, { status: 500 });
}
