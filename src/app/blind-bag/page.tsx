
'use client';

import { BlindBag } from "@/components/games/blind-bag";
import { GamePageLayout } from "@/components/layout/game-page-layout";
import { Gift } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function BlindBagPage() {
  const { translations } = useLanguage();
  return (
    <GamePageLayout
      title={translations.blindBag_page_title as string}
      description={translations.blindBag_page_description as string}
      icon={<Gift className="w-10 h-10" />}
    >
      <BlindBag />
    </GamePageLayout>
  );
}
