import { NextResponse } from "next/server";
import { advanceReveal, GameError } from "@/lib/game/server";

export async function POST(request: Request, context: RouteContext<"/api/game/rooms/[code]/advance-reveal">) {
  try {
    const { code } = await context.params;
    const body: unknown = await request.json();
    const token = body && typeof body === "object" ? (body as Record<string, unknown>).playerToken : "";
    await advanceReveal(code, typeof token === "string" ? token : "");
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof GameError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Errore imprevisto." }, { status: 500 });
  }
}
