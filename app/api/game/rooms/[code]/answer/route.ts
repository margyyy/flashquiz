import { NextResponse } from "next/server";
import { answerCard, GameError } from "@/lib/game/server";

export async function POST(request: Request, context: RouteContext<"/api/game/rooms/[code]/answer">) {
  try {
    const { code } = await context.params;
    const body: unknown = await request.json();
    const data = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    await answerCard(code, typeof data.playerToken === "string" ? data.playerToken : "", {
      selectedIndexes: Array.isArray(data.selectedIndexes)
        ? data.selectedIndexes.map((item) => Number(item)).filter((item) => Number.isInteger(item))
        : undefined,
      correct: typeof data.correct === "boolean" ? data.correct : undefined,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof GameError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Errore imprevisto." }, { status: 500 });
  }
}
