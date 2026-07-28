'use client';

import { GroupDivider } from "@/components/games/group-divider";
import { GamePageLayout } from "@/components/layout/game-page-layout";
import { Users } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function GroupDividerPage() {
  const { translations } = useLanguage();
  return (
    <GamePageLayout
      title={translations.groupDivider_page_title as string}
      description={translations.groupDivider_page_description as string}
      icon={<Users className="w-10 h-10" />}
    >
      <GroupDivider />
    </GamePageLayout>
  );
}
