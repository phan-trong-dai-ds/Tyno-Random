
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useSound } from "@/context/sound-context";

export function RandomNumberGenerator() {
  const { translations } = useLanguage();
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const { isSoundEnabled } = useSound();

  const playSound = (soundPath: string) => {
    if (isSoundEnabled) {
      const audio = new Audio(soundPath);
      audio.play().catch(error => {
        console.error(`Error playing sound: ${soundPath}`, error);
      });
    }
  };

  const handleGenerateNumber = () => {
    if (min >= max) {
      alert(translations.minMaxValidationAlert as string);
      return;
    }
    playSound('/sounds/billiards.mp3');
    setIsGenerating(true);
    setRandomNumber(null); 

    setTimeout(() => {
      const newRandomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      setRandomNumber(newRandomNumber);
      setAnimationKey(prev => prev + 1); 
      setIsGenerating(false);
    }, 100);
  };

  useEffect(() => {
    if (min >= max) return;
    const initialRandomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    setRandomNumber(initialRandomNumber);
    setAnimationKey(prev => prev + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <Label htmlFor="min" className="text-sm font-medium">{translations.minValLabel as string}</Label>
          <Input
            id="min"
            type="number"
            value={min}
            onChange={(e) => setMin(parseInt(e.target.value) || 0)}
            className="mt-1"
            disabled={isGenerating}
          />
        </div>
        <div>
          <Label htmlFor="max" className="text-sm font-medium">{translations.maxValLabel as string}</Label>
          <Input
            id="max"
            type="number"
            value={max}
            onChange={(e) => setMax(parseInt(e.target.value) || 0)}
            className="mt-1"
            disabled={isGenerating}
          />
        </div>
      </div>
      <Button onClick={handleGenerateNumber} disabled={isGenerating} className="w-full">
        <Hash className="mr-2 h-5 w-5" />
        {isGenerating ? translations.generatingButton as string : translations.generateNumberButton as string}
      </Button>

      {randomNumber !== null && (
        <Card className="mt-6 text-center">
          <CardHeader>
            <CardTitle className="text-xl">{translations.generatedNumberTitle as string}</CardTitle>
          </CardHeader>
          <CardContent>
            <div key={animationKey} className="animate-pop-in text-6xl font-bold text-primary p-8">
              {randomNumber}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
