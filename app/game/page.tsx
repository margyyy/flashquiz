import { connection } from "next/server";
import GameHome from "@/components/game/GameHome";
import { getSubjects } from "@/lib/data";

export const metadata = {
  title: "Game - Plantasia",
};

export default async function GamePage() {
  await connection();
  const subjects = await getSubjects();

  return <GameHome subjects={subjects} />;
}
