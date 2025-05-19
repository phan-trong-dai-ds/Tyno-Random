
'use client';

import { BlindBox } from "@/components/games/blind-box"; // Renamed component and path
import { GamePageLayout } from "@/components/layout/game-page-layout";
import { Gift } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function BlindBoxPage() { // Renamed function
  const { translations } = useLanguage();
  return (
    <GamePageLayout
      title={translations.blindBox_page_title as string} // Updated translation key
      description={translations.blindBox_page_description as string} // Updated translation key
      icon={<Gift className="w-10 h-10" />}
    >
      <BlindBox /> {/* Renamed component */}
    </GamePageLayout>
  );
}
