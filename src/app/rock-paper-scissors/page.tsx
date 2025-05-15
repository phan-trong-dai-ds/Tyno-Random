
'use client';

import { RockPaperScissors } from "@/components/games/rock-paper-scissors";
import { GamePageLayout } from "@/components/layout/game-page-layout";
import { Swords } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function RockPaperScissorsPage() {
  const { translations } = useLanguage();
  return (
    <GamePageLayout
      title={translations.rockPaperScissors_page_title as string}
      description={translations.rockPaperScissors_page_description as string}
      icon={<Swords className="w-10 h-10" />}
    >
      <RockPaperScissors />
    </GamePageLayout>
  );
}
