
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dices, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useSound } from "@/context/sound-context";
import { CustomDice1Icon } from "@/components/icons/custom-dice1-icon";

const DiceIcon = ({ value }: { value: number }) => {
  const colorClass = (value === 1 || value === 4) ? "text-destructive" : "text-primary";
  const iconClassName = `w-10 h-10 ${colorClass}`;

  if (value === 1) {
    return <CustomDice1Icon className={iconClassName} />;
  }
  const icons = [CustomDice1Icon, Dice2, Dice3, Dice4, Dice5, Dice6];
  const IconComponent = icons[value - 1] || CustomDice1Icon;
  return <IconComponent className={iconClassName} />;
};

interface DiceResult {
  id: string;
  value: number;
}

export function DiceRoller() {
  const { translations } = useLanguage();
  const [numDice, setNumDice] = useState(1);
  const [results, setResults] = useState<DiceResult[]>([]);
  const [isRolling, setIsRolling] = useState(false);
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

  const handleRollDice = () => {
    if (numDice <= 0 || numDice > 20) {
      alert(translations.numDiceValidationAlert as string);
      return;
    }

    playSound('/sounds/dice-roll.mp3');
    setIsRolling(true);
    setResults([]);

    const newResults: DiceResult[] = [];
    const newAnimationKeys: Record<string, number> = {};

    for (let i = 0; i < numDice; i++) {
      const dieId = `die-${i}`;
      newResults.push({ id: dieId, value: Math.floor(Math.random() * 6) + 1 });
      newAnimationKeys[dieId] = (animationKeys[dieId] || 0) + 1;
    }
    
    setTimeout(() => {
        setResults(newResults);
        setAnimationKeys(newAnimationKeys);
        setIsRolling(false);
    }, 100); 
  };
  
  useEffect(() => {
    if (results.length === 0 && !isRolling && numDice > 0) {
       const initialDieId = `die-0`;
       setResults([{id: initialDieId, value: 1}]);
       setAnimationKeys(prev => ({...prev, [initialDieId]: 1}));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <Label htmlFor="numDice" className="text-sm font-medium">{translations.numDiceLabel as string}</Label>
          <Input
            id="numDice"
            type="number"
            value={numDice}
            onChange={(e) => setNumDice(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
            min="1"
            max="20"
            className="mt-1"
            disabled={isRolling}
          />
        </div>
        <Button onClick={handleRollDice} disabled={isRolling} className="w-full sm:w-auto">
          <Dices className="mr-2 h-5 w-5" />
          {isRolling ? translations.rollingButton as string : translations.rollDiceButton as string}
        </Button>
      </div>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{translations.resultsTitle as string}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {results.map((result, index) => (
                <div
                  key={result.id + animationKeys[result.id]}
                  className="animate-pop-in flex flex-col items-center justify-center p-3 border rounded-lg shadow-sm aspect-square bg-background"
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <DiceIcon value={result.value} />
                  <span className="text-sm text-muted-foreground mt-1">
                    {result.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
             {translations.total as string}: {results.reduce((sum, r) => sum + r.value, 0)}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
