//
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Shuffle, ArrowDownAZ, Trash2, X, PackageOpen } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Confetti } from "@/components/effects/confetti";
import { useLanguage } from "@/context/language-context";
import { useSound } from "@/context/sound-context";
import { cn } from "@/lib/utils";

export function BlindBox() {
  const { translations } = useLanguage();
  const [itemsInput, setItemsInput] = useState("Candy\nToy\nCoupon\nSticker\nKeychain");
  const [itemsList, setItemsList] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [animationState, setAnimationState] = useState<'idle' | 'shaking' | 'opened'>('idle');
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();
  const { isSoundEnabled } = useSound();

  const playSound = (soundPath: string) => {
    if (isSoundEnabled) {
      const audio = new Audio(soundPath);
      audio.play().catch(error => {
        console.error(`Error playing sound: ${soundPath}`, error);
      });
    }
  };

  useEffect(() => {
    const parsedItems = itemsInput.split("\n").map(item => item.trim()).filter(item => item.length > 0);
    setItemsList(parsedItems);
  }, [itemsInput]);

  const handleShuffleItems = () => {
    const shuffled = [...itemsList].sort(() => Math.random() - 0.5);
    setItemsInput(shuffled.join("\n"));
  };

  const handleSortItems = () => {
    const sorted = [...itemsList].sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
    );
    setItemsInput(sorted.join("\n"));
  };

  const handleOpenBox = useCallback(() => {
    if (itemsList.length === 0) {
      toast({
        title: translations.noItemsToOpenErrorTitle as string,
        description: translations.noItemsToOpenErrorDescription as string,
        variant: "destructive",
      });
      return;
    }
    setIsOpening(true);
    setSelectedItem(null);
    setShowConfetti(false);
    setAnimationState('shaking');

    setTimeout(() => {
      const winnerIndex = Math.floor(Math.random() * itemsList.length);
      const winner = itemsList[winnerIndex];
      setSelectedItem(winner);
      setAnimationState('opened');
      setShowConfetti(true);
      playSound('/sounds/applause.mp3');
      setTimeout(() => setShowConfetti(false), 7500);
      setIsOpening(false);
    }, 3000);
  }, [itemsList, toast, translations, playSound]);

  const handleRemoveItem = () => {
    if (!selectedItem) return;
    const newItemsList = itemsList.filter(item => item !== selectedItem);
    setItemsInput(newItemsList.join("\n"));
    const removedItem = selectedItem;
    setSelectedItem(null);
    setShowConfetti(false);
    setAnimationState('idle');
    toast({
      title: translations.itemRemovedToastTitle as string,
      description: (translations.itemRemovedToastDescription as (name: string) => string)(removedItem),
      duration: 3000,
    });
  };

  const handleCloseAlert = () => {
    setSelectedItem(null);
    setShowConfetti(false);
    setAnimationState('idle');
  };

  const itemsEnteredText = typeof translations.itemsEnteredSuffix === 'function'
  ? translations.itemsEnteredSuffix(itemsList.length)
  : `${itemsList.length} ${translations.itemsEnteredSuffix}`;

  return (
    <div className="space-y-6">
      {showConfetti && <Confetti />}
      <div>
        <div className="flex justify-between items-center mb-1">
          <Label htmlFor="itemsInput" className="text-sm font-medium">{translations.enterItemsLabel as string}</Label>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleShuffleItems} disabled={isOpening || itemsList.length < 2} aria-label={translations.shuffleItemsButtonLabel as string}>
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleSortItems} disabled={isOpening || itemsList.length < 2} aria-label={translations.sortItemsButtonLabel as string}>
              <ArrowDownAZ className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Textarea
          id="itemsInput"
          value={itemsInput}
          onChange={(e) => setItemsInput(e.target.value)}
          rows={6}
          className="mt-1"
          placeholder={translations.itemsPlaceholder as string}
          disabled={isOpening}
        />
        <p className="text-xs text-muted-foreground mt-1">{itemsEnteredText}</p>
      </div>

      <div className="relative flex flex-col items-center space-y-4">
        <div
          className={cn(
            "p-6 rounded-lg flex items-center justify-center", 
            animationState === 'shaking' && "animate-shake-box"
          )}
          style={{ perspective: '1000px', minHeight: '176px' }} 
        >
          {animationState === 'opened' && selectedItem ? (
            <PackageOpen
              className="w-32 h-32 text-primary animate-pop-in"
            />
          ) : (
            <Gift
              className="w-32 h-32 text-primary"
            />
          )}
        </div>

        {itemsList.length === 0 && animationState === 'idle' && (
           <Card className="w-full max-w-xs aspect-square flex flex-col items-center justify-center bg-muted/50 border-dashed -mt-44 mb-4">
            <Gift className="w-24 h-24 text-muted-foreground mb-4 opacity-50" />
            <CardTitle className="text-muted-foreground">{translations.addItemsPrompt as string}</CardTitle>
          </Card>
        )}


        <Button onClick={handleOpenBox} disabled={isOpening || itemsList.length === 0} className="w-full max-w-xs py-3 text-lg">
          <Gift className="mr-2 h-6 w-6" />
          {isOpening ? translations.openingBoxButton as string : translations.openBoxButton as string}
        </Button>
      </div>

      {selectedItem && !isOpening && (
        <Alert className="mt-6 bg-green-50 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300 relative overflow-hidden">
          {animationState === 'opened' ? (
            <PackageOpen className="h-5 w-5 !text-green-700 dark:!text-green-300" />
          ) : (
            <Gift className="h-5 w-5 !text-green-700 dark:!text-green-300" />
          )}
          <AlertTitle className="font-semibold text-lg">{translations.itemDrawnAlertTitle as string}</AlertTitle>
          <AlertDescription className="text-2xl font-bold animate-pop-in mb-4">
            {selectedItem}
          </AlertDescription>
          <div className="flex justify-end space-x-2 mt-2">
            <Button variant="outline" size="sm" onClick={handleRemoveItem} className="border-green-600 text-green-700 hover:bg-green-600 hover:text-white dark:border-green-500 dark:text-green-300 dark:hover:bg-green-600 dark:hover:text-white">
              <Trash2 className="mr-1 h-4 w-4" /> {translations.removeItemButton as string}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseAlert}
              className="text-green-700 dark:text-green-300 hover:bg-red-600 hover:text-white dark:hover:bg-red-700 dark:hover:text-white"
            >
              <X className="mr-1 h-4 w-4" /> {translations.closeWinnerAlertButton as string}
            </Button>
          </div>
        </Alert>
      )}
    </div>
  );
}
