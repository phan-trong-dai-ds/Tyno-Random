
'use client';

import { DiceRoller } from "@/components/games/dice-roller";
import { GamePageLayout } from "@/components/layout/game-page-layout";
import { Dices } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function DiceRollerPage() {
  const { translations } = useLanguage();
  return (
    <GamePageLayout
      title={translations.diceRoller_page_title as string}
      description={translations.diceRoller_page_description as string}
      icon={<Dices className="w-10 h-10" />}
    >
      <DiceRoller />
    </GamePageLayout>
  );
}
