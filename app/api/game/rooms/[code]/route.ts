import { NextResponse } from "next/server";
import { GameError, getGameRoomState } from "@/lib/game/server";

export async function GET(request: Request, context: RouteContext<"/api/game/rooms/[code]">) {
  try {
    const { code } = await context.params;
    const token = new URL(request.url).searchParams.get("token") ?? undefined;
    const state = await getGameRoomState(code, token);
    return NextResponse.json(state);
  } catch (error) {
    if (error instanceof GameError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Errore imprevisto." }, { status: 500 });
  }
}
