import { NextResponse } from "next/server";
import { GameError, joinGameRoom } from "@/lib/game/server";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const data = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    const result = await joinGameRoom({
      code: typeof data.code === "string" ? data.code : "",
      username: typeof data.username === "string" ? data.username : "",
    });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof GameError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Errore imprevisto." }, { status: 500 });
  }
}
