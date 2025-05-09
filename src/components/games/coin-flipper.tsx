
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";

interface CoinResult {
  id: string;
  value: "H" | "T";
}

export function CoinFlipper() {
  const [numCoins, setNumCoins] = useState(1);
  const [results, setResults] = useState<CoinResult[]>([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [animationKeys, setAnimationKeys] = useState<Record<string, number>>({});

  const handleFlipCoins = () => {
    if (numCoins <= 0 || numCoins > 50) {
      // Basic validation, can be improved with react-hook-form
      alert("Please enter a number of coins between 1 and 50.");
      return;
    }
    setIsFlipping(true);
    setResults([]); // Clear previous results immediately

    // Stagger the appearance of coins
    const newResults: CoinResult[] = [];
    const newAnimationKeys: Record<string, number> = {};

    for (let i = 0; i < numCoins; i++) {
      const coinId = `coin-${i}`;
      newResults.push({ id: coinId, value: Math.random() < 0.5 ? "H" : "T" });
      newAnimationKeys[coinId] = (animationKeys[coinId] || 0) + 1;
    }
    
    // Set results after a short delay to allow clearing and then animation
    setTimeout(() => {
        setResults(newResults);
        setAnimationKeys(newAnimationKeys);
        setIsFlipping(false);
    }, 100);
  };

  useEffect(() => {
    // Initialize with one coin shown if results are empty and not flipping
    if (results.length === 0 && !isFlipping && numCoins > 0) {
       const initialCoinId = `coin-0`;
       setResults([{id: initialCoinId, value: 'H'}]);
       setAnimationKeys(prev => ({...prev, [initialCoinId]: 1}));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <Label htmlFor="numCoins" className="text-sm font-medium">Number of Coins (1-50)</Label>
          <Input
            id="numCoins"
            type="number"
            value={numCoins}
            onChange={(e) => setNumCoins(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
            min="1"
            max="50"
            className="mt-1"
            disabled={isFlipping}
          />
        </div>
        <Button onClick={handleFlipCoins} disabled={isFlipping} className="w-full sm:w-auto">
          <Coins className="mr-2 h-5 w-5" />
          {isFlipping ? "Flipping..." : "Flip Coins"}
        </Button>
      </div>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {results.map((result, index) => (
                <div
                  key={result.id + animationKeys[result.id]}
                  className={`animate-pop-in flex flex-col items-center justify-center p-3 border rounded-lg shadow-sm aspect-square
                    ${result.value === "H" ? "bg-amber-400/20 border-amber-500" : "bg-slate-400/20 border-slate-500"}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className={`text-3xl font-bold ${result.value === "H" ? "text-amber-600" : "text-slate-600"}`}>
                    {result.value}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {result.value === "H" ? "Heads" : "Tails"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
           <CardFooter className="text-sm text-muted-foreground">
            Total Heads: {results.filter(r => r.value === 'H').length}, Total Tails: {results.filter(r => r.value === 'T').length}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
