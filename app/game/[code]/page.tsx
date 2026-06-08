import GameRoomClient from "@/components/game/GameRoomClient";

export const metadata = {
  title: "Room game - Plantasia",
};

export default async function GameRoomPage({ params }: PageProps<"/game/[code]">) {
  const { code } = await params;
  return <GameRoomClient code={code.toUpperCase()} />;
}
