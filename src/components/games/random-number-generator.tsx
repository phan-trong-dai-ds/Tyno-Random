
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volleyball } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useSound } from "@/context/sound-context";
import { motion, AnimatePresence } from "framer-motion";

export function RandomNumberGenerator() {
  const { translations } = useLanguage();
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [initialPos, setInitialPos] = useState({ x: 0, y: -300, rotate: -720, scale: 0.5, opacity: 0 });
  const [ballColor, setBallColor] = useState("#3b82f6");
  const { playSound } = useSound();

  const colors = [
    "#3b82f6", // blue
    "#22c55e", // green
    "#dc2626", // strong red
    "#eab308", // yellow
    "#ec4899", // pink
    "#f97316", // orange
  ];

  const updateRandomDirectionAndColor = () => {
    const directions = [
      { x: -500, y: -500, rotate: -1080, scale: 0.2, opacity: 0 },
      { x: 500, y: -500, rotate: 1080, scale: 0.2, opacity: 0 },
      { x: -500, y: 500, rotate: -1080, scale: 0.2, opacity: 0 },
      { x: 500, y: 500, rotate: 1080, scale: 0.2, opacity: 0 },
      { x: -600, y: 0, rotate: -1080, scale: 0.2, opacity: 0 },
      { x: 600, y: 0, rotate: 1080, scale: 0.2, opacity: 0 },
      { x: 0, y: -600, rotate: -1080, scale: 0.2, opacity: 0 },
    ];
    setInitialPos(directions[Math.floor(Math.random() * directions.length)]);
    setBallColor(colors[Math.floor(Math.random() * colors.length)]);
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
      updateRandomDirectionAndColor();
      setRandomNumber(newRandomNumber);
      setAnimationKey(prev => prev + 1); 
      setIsGenerating(false);
    }, 100);
  };

  useEffect(() => {
    if (min >= max) return;
    const initialRandomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    updateRandomDirectionAndColor();
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
            min="0"
            max="1000"
            onChange={(e) => setMin(Math.max(0, Math.min(1000, parseInt(e.target.value) || 0)))}
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
            min="0"
            max="1000"
            onChange={(e) => setMax(Math.max(0, Math.min(1000, parseInt(e.target.value) || 0)))}
            className="mt-1"
            disabled={isGenerating}
          />
        </div>
      </div>
      <Button onClick={handleGenerateNumber} disabled={isGenerating} className="w-full">
        <Volleyball className="mr-2 h-5 w-5" />
        {isGenerating ? translations.generatingButton as string : translations.generateNumberButton as string}
      </Button>

      {randomNumber !== null && (
        <Card className="mt-6 text-center overflow-hidden relative">
          <CardHeader>
            <CardTitle className="text-xl">{translations.generatedNumberTitle as string}</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[200px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={animationKey}
                initial={initialPos}
                animate={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-32 h-32 rounded-full flex items-center justify-center"
                style={{
                  boxShadow: 'inset -15px -15px 25px rgba(0,0,0,0.4), inset 10px 10px 25px rgba(255,255,255,0.4), 10px 10px 20px rgba(0,0,0,0.3)',
                  background: `radial-gradient(circle at 35% 35%, ${ballColor}cc 0%, ${ballColor} 50%, ${ballColor}80 100%)`
                }}
              >
                <span className="text-5xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                  {randomNumber}
                </span>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
