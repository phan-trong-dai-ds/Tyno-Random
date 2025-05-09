
'use client';

import { NameWheel } from "@/components/games/name-wheel";
import { GamePageLayout } from "@/components/layout/game-page-layout";
import { Disc3 } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function NameWheelPage() {
  const { translations } = useLanguage();
  return (
    <GamePageLayout
      title={translations.nameWheel_page_title as string}
      description={translations.nameWheel_page_description as string}
      icon={<Disc3 className="w-10 h-10" />}
    >
      <NameWheel />
    </GamePageLayout>
  );
}
