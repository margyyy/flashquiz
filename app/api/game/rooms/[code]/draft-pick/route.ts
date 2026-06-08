import { NextResponse } from "next/server";
import { draftPick, GameError } from "@/lib/game/server";

export async function POST(request: Request, context: RouteContext<"/api/game/rooms/[code]/draft-pick">) {
  try {
    const { code } = await context.params;
    const body: unknown = await request.json();
    const data = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    await draftPick(
      code,
      typeof data.playerToken === "string" ? data.playerToken : "",
      typeof data.cardId === "string" ? data.cardId : "",
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof GameError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Errore imprevisto." }, { status: 500 });
  }
}
