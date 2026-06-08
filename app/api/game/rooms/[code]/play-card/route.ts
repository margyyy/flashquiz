import { NextResponse } from "next/server";
import { GameError, playCard } from "@/lib/game/server";

export async function POST(request: Request, context: RouteContext<"/api/game/rooms/[code]/play-card">) {
  try {
    const { code } = await context.params;
    const body: unknown = await request.json();
    const token = body && typeof body === "object" ? (body as Record<string, unknown>).playerToken : "";
    await playCard(code, typeof token === "string" ? token : "");
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof GameError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Errore imprevisto." }, { status: 500 });
  }
}
