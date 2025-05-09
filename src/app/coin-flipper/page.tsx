
import { CoinFlipper } from "@/components/games/coin-flipper";
import { GamePageLayout } from "@/components/layout/game-page-layout";
import { Coins } from "lucide-react";

export default function CoinFlipperPage() {
  return (
    <GamePageLayout
      title="Coin Flipper"
      description="Toss one or more virtual coins. Will fortune favor you with heads or tails? Adjust the number of coins and see the random outcomes!"
      icon={<Coins className="w-10 h-10" />}
    >
      <CoinFlipper />
    </GamePageLayout>
  );
}
