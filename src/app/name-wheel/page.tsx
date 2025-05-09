
import { NameWheel } from "@/components/games/name-wheel";
import { GamePageLayout } from "@/components/layout/game-page-layout";
import { Disc3 } from "lucide-react";

export default function NameWheelPage() {
  return (
    <GamePageLayout
      title="Name Wheel"
      description="Enter a list of names or items, then spin the wheel to randomly select one. Perfect for making choices, giveaways, or classroom activities!"
      icon={<Disc3 className="w-10 h-10" />}
    >
      <NameWheel />
    </GamePageLayout>
  );
}
