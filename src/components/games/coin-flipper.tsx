
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useSound } from "@/context/sound-context";
import { HeadsCoinIcon } from "@/components/icons/heads-coin-icon";
import { TailsCoinIcon } from "@/components/icons/tails-coin-icon";

interface CoinResult {
  id: string;
  value: "H" | "T";
}

export function CoinFlipper() {
  const { translations } = useLanguage();
  const [numCoins, setNumCoins] = useState(1);
  const [results, setResults] = useState<CoinResult[]>([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [animationKeys, setAnimationKeys] = useState<Record<string, number>>({});
  const { isSoundEnabled } = useSound();

  const playSound = (soundPath: string) => {
    if (isSoundEnabled) {
      const audio = new Audio(soundPath);
      audio.play().catch(error => {
        console.error("Error playing sound:", error);
      });
    }
  };

  const handleFlipCoins = () => {
    if (numCoins <= 0 || numCoins > 20) {
      alert(translations.numCoinsValidationAlert as string);
      return;
    }
    
    playSound('/sounds/coin-flip.mp3');
    setIsFlipping(true);
    setResults([]); 

    const newResults: CoinResult[] = [];
    const newAnimationKeys: Record<string, number> = {};

    for (let i = 0; i < numCoins; i++) {
      const coinId = `coin-${i}`;
      newResults.push({ id: coinId, value: Math.random() < 0.5 ? "H" : "T" });
      newAnimationKeys[coinId] = (animationKeys[coinId] || 0) + 1;
    }
    
    setTimeout(() => {
        setResults(newResults);
        setAnimationKeys(newAnimationKeys);
        setIsFlipping(false);
    }, 100); 
  };

  useEffect(() => {
    if (results.length === 0 && !isFlipping && numCoins > 0 && numCoins <= 20) {
       const initialCoinId = `coin-0`;
       setResults([{id: initialCoinId, value: 'H'}]);
       setAnimationKeys(prev => ({...prev, [initialCoinId]: (prev[initialCoinId] || 0) + 1}));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numCoins]);


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <Label htmlFor="numCoins" className="text-sm font-medium">{translations.numCoinsLabel as string}</Label>
          <Input
            id="numCoins"
            type="number"
            value={numCoins}
            onChange={(e) => setNumCoins(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
            min="1"
            max="20"
            className="mt-1"
            disabled={isFlipping}
          />
        </div>
        <Button onClick={handleFlipCoins} disabled={isFlipping} className="w-full sm:w-auto">
          <Coins className="mr-2 h-5 w-5" />
          {isFlipping ? translations.flippingButton as string : translations.flipCoinsButton as string}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3 text-foreground">{translations.resultsTitle as string}</h2>
          <div className="p-4 border rounded-lg shadow-sm bg-muted/30">
            <div className="flex flex-wrap gap-4 justify-center">
              {results.map((result, index) => (
                <div
                  key={result.id + (animationKeys[result.id] || 0)}
                  className={`animate-pop-in p-3 rounded-lg flex flex-col items-center justify-center shadow-sm w-24 
                    ${result.value === "H" ? "bg-amber-400/30 border border-amber-500/50" : "bg-slate-400/30 border border-slate-500/50"}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  title={result.value === "H" ? translations.heads as string : translations.tails as string}
                >
                  {result.value === "H" ? (
                    <HeadsCoinIcon className="w-10 h-10" />
                  ) : (
                    <TailsCoinIcon className="w-10 h-10" />
                  )}
                  <span className="mt-2 text-sm font-medium text-foreground">
                    {result.value === "H" ? translations.heads as string : translations.tails as string}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {translations.totalHeads as string}: {results.filter(r => r.value === 'H').length}, {translations.totalTails as string}: {results.filter(r => r.value === 'T').length}
          </p>
        </div>
      )}
    </div>
  );
}
