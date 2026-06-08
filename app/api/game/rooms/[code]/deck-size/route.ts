import { NextResponse } from "next/server";
import { GameError, setDeckSize } from "@/lib/game/server";

export async function POST(request: Request, context: RouteContext<"/api/game/rooms/[code]/deck-size">) {
  try {
    const { code } = await context.params;
    const body: unknown = await request.json();
    const data = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    await setDeckSize(
      code,
      typeof data.playerToken === "string" ? data.playerToken : "",
      Number.parseInt(String(data.deckSize), 10),
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof GameError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Errore imprevisto." }, { status: 500 });
  }
}
