
'use client';

import { CoinFlipper } from "@/components/games/coin-flipper";
import { GamePageLayout } from "@/components/layout/game-page-layout";
import { Coins } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function CoinFlipperPage() {
  const { translations } = useLanguage();
  return (
    <GamePageLayout
      title={translations.coinFlipper_page_title as string}
      description={translations.coinFlipper_page_description as string}
      icon={<Coins className="w-10 h-10" />}
    >
      <CoinFlipper />
    </GamePageLayout>
  );
}
