
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash } from "lucide-react";

export function RandomNumberGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const handleGenerateNumber = () => {
    if (min >= max) {
      alert("Minimum value must be less than maximum value.");
      return;
    }
    setIsGenerating(true);
    setRandomNumber(null); // Clear previous for animation

    // Generate number after a short delay for effect
    setTimeout(() => {
      const newRandomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      setRandomNumber(newRandomNumber);
      setAnimationKey(prev => prev + 1); // Trigger animation remount
      setIsGenerating(false);
    }, 100);
  };

  useEffect(() => {
    // Generate an initial number on load
    handleGenerateNumber();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <Label htmlFor="min" className="text-sm font-medium">Minimum Value</Label>
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
          <Label htmlFor="max" className="text-sm font-medium">Maximum Value</Label>
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
        {isGenerating ? "Generating..." : "Generate Number"}
      </Button>

      {randomNumber !== null && (
        <Card className="mt-6 text-center">
          <CardHeader>
            <CardTitle className="text-xl">Generated Number</CardTitle>
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
