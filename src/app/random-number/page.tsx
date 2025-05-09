
import { RandomNumberGenerator } from "@/components/games/random-number-generator";
import { GamePageLayout } from "@/components/layout/game-page-layout";
import { Hash } from "lucide-react";

export default function RandomNumberPage() {
  return (
    <GamePageLayout
      title="Random Number Generator"
      description="Need a random number? Specify your minimum and maximum values, and let us pick one for you. Simple, quick, and unbiased."
      icon={<Hash className="w-10 h-10" />}
    >
      <RandomNumberGenerator />
    </GamePageLayout>
  );
}
