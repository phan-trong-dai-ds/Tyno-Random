
import { DiceRoller } from "@/components/games/dice-roller";
import { GamePageLayout } from "@/components/layout/game-page-layout";
import { Dices } from "lucide-react";

export default function DiceRollerPage() {
  return (
    <GamePageLayout
      title="Dice Roller"
      description="Roll one or more standard 6-sided dice. Great for board games, RPGs, or when you just need a random number from 1 to 6."
      icon={<Dices className="w-10 h-10" />}
    >
      <DiceRoller />
    </GamePageLayout>
  );
}
