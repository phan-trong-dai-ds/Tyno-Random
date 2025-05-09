
'use client';

import { RandomNumberGenerator } from "@/components/games/random-number-generator";
import { GamePageLayout } from "@/components/layout/game-page-layout";
import { Hash } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function RandomNumberPage() {
  const { translations } = useLanguage();
  return (
    <GamePageLayout
      title={translations.randomNumber_page_title as string}
      description={translations.randomNumber_page_description as string}
      icon={<Hash className="w-10 h-10" />}
    >
      <RandomNumberGenerator />
    </GamePageLayout>
  );
}
