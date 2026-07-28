"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Disc3, VenetianMask, Shuffle, ArrowDownAZ, Trash2, X, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Confetti } from "@/components/effects/confetti";
import { useLanguage } from "@/context/language-context";
import { useSound } from "@/context/sound-context";

const POINTER_HEIGHT = 25;
const POINTER_WIDTH = 24;
const MARGIN_FROM_SVG_EDGE = 30;

const WHEEL_COLORS = [
  "hsl(0, 75%, 60%)",   // Red
  "hsl(120, 75%, 45%)", // Green
  "hsl(60, 85%, 55%)",  // Yellow
  "hsl(220, 75%, 55%)", // Blue
  "hsl(30, 85%, 53%)",  // Orange
  "hsl(325, 75%, 58%)", // Lotus Pink (Vibrant Pink)
];

interface Segment {
  id: string;
  name: string;
  startAngle: number;
  endAngle: number;
  pathD: string;
  textColor: string;
  fillColor: string;
  textX: number;
  textY: number;
  displayName: string;
  textTransform: string;
  textAnchor: string;
  dominantBaseline: string;
}

interface WheelState {
  id: string;
  name: string; // Dynamic label like "1", "2", etc.
  isSpinning: boolean;
  wheelRotation: number;
  visualRotation: number;
  selectedName: string | null;
  isSelected: boolean;
}

export function NameWheel() {
  const { translations } = useLanguage();
  const [namesInput, setNamesInput] = useState("Alice\nBob\nCharlie\nDavid\nEve\nFrank\nGrace\nHenry");
  const [namesList, setNamesList] = useState<string[]>([]);
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);
  const { playSound } = useSound();

  // Manage multiple wheels (max 6)
  const [wheels, setWheels] = useState<WheelState[]>([
    {
      id: "wheel-default",
      name: "1",
      isSpinning: false,
      wheelRotation: 0,
      visualRotation: 0,
      selectedName: null,
      isSelected: true,
    }
  ]);

  // Adjust wheel size dynamically based on the total number of wheels
  const dynamicWheelSize = useMemo(() => {
    const count = wheels.length;
    if (count === 1) return 280;
    if (count === 2) return 230;
    if (count === 3) return 210;
    return 190; // 4 to 6 wheels
  }, [wheels.length]);

  // Adjust card width dynamically based on whether it is a single wheel or multiple
  const dynamicCardWidthClass = useMemo(() => {
    return wheels.length === 1 ? "max-w-[340px]" : "max-w-[280px]";
  }, [wheels.length]);

  const wheelRadiusForSegments = useMemo(() => {
    return dynamicWheelSize / 2 - MARGIN_FROM_SVG_EDGE;
  }, [dynamicWheelSize]);

  useEffect(() => {
    const parsedNames = namesInput.split("\n").map(name => name.trim()).filter(name => name.length > 0);
    setNamesList(parsedNames);
  }, [namesInput]);

  const handleShuffleNames = () => {
    const shuffled = [...namesList].sort(() => Math.random() - 0.5);
    setNamesInput(shuffled.join("\n"));
  };

  const handleSortNames = () => {
    const sorted = [...namesList].sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
    );
    setNamesInput(sorted.join("\n"));
  };

  const handleClearNames = () => {
    setNamesInput("");
    setWheels(prev => prev.map(w => ({ ...w, selectedName: null })));
  };

  const handleAddWheel = () => {
    if (wheels.length >= 6) return;
    setWheels(prev => [
      ...prev,
      {
        id: `wheel-${Date.now()}`,
        name: (prev.length + 1).toString(),
        isSpinning: false,
        wheelRotation: 0,
        visualRotation: 0,
        selectedName: null,
        isSelected: true,
      }
    ]);
  };

  const handleRemoveWheel = (id: string) => {
    if (wheels.length <= 1) return;
    setWheels(prev => {
      const filtered = prev.filter(w => w.id !== id);
      return filtered.map((w, idx) => ({
        ...w,
        name: (idx + 1).toString(),
      }));
    });
  };

  const handleToggleSelectWheel = (id: string) => {
    setWheels(prev => prev.map(w => {
      if (w.id === id) {
        return {
          ...w,
          isSelected: !w.isSelected,
        };
      }
      return w;
    }));
  };

  const calculateSegmentPath = (cx: number, cy: number, radius: number, startAngleDeg: number, endAngleDeg: number): string => {
    const startAngleRad = (startAngleDeg - 90) * Math.PI / 180;
    const endAngleRad = (endAngleDeg - 90) * Math.PI / 180;

    const x1 = cx + radius * Math.cos(startAngleRad);
    const y1 = cy + radius * Math.sin(startAngleRad);
    const x2 = cx + radius * Math.cos(endAngleRad);
    const y2 = cy + radius * Math.sin(endAngleRad);

    const largeArcFlag = (endAngleDeg - startAngleDeg) <= 180 ? "0" : "1";

    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const segments = useMemo((): Segment[] => {
    if (namesList.length === 0) return [];
    const anglePerSegment = 360 / namesList.length;
    const numNames = namesList.length;

    return namesList.map((name, index) => {
      const startAngle = index * anglePerSegment;
      const endAngle = (index + 1) * anglePerSegment;
      const segmentId = `segment-${index}`;

      const visualMidAngleDeg = (startAngle + endAngle) / 2;
      const midAngleRadCartesian = (visualMidAngleDeg - 90) * Math.PI / 180;

      const textPositionRadiusFactor = 0.8; 
      const textX = dynamicWheelSize / 2 + (wheelRadiusForSegments * textPositionRadiusFactor) * Math.cos(midAngleRadCartesian);
      const textY = dynamicWheelSize / 2 + (wheelRadiusForSegments * textPositionRadiusFactor) * Math.sin(midAngleRadCartesian);

      const textRotationAngle = visualMidAngleDeg + 90; 

      let displayName = name;
      let charDisplayLimit = 7;
      if (numNames >= 16) charDisplayLimit = 3;
      else if (numNames >= 10) charDisplayLimit = 4;
      else if (numNames >= 8) charDisplayLimit = 5;

      if (name.length > charDisplayLimit) {
        if (charDisplayLimit <= 2) {
          displayName = name.substring(0, charDisplayLimit);
        } else {
          displayName = name.substring(0, charDisplayLimit - 2) + "...";
        }
      }

      return {
        id: segmentId,
        name,
        displayName,
        startAngle,
        endAngle,
        pathD: calculateSegmentPath(dynamicWheelSize / 2, dynamicWheelSize / 2, wheelRadiusForSegments, startAngle, endAngle),
        fillColor: WHEEL_COLORS[index % WHEEL_COLORS.length],
        textColor: "hsl(0 0% 0%)", 
        textX,
        textY,
        textTransform: `rotate(${textRotationAngle} ${textX} ${textY})`,
        textAnchor: "start", 
        dominantBaseline: "middle", 
      };
    });
  }, [namesList, wheelRadiusForSegments, dynamicWheelSize]);

  // Generic animation spin function
  const spinWheels = useCallback((wheelIds: string[]) => {
    if (namesList.length === 0) {
      toast({
        title: translations.noNamesToSpinErrorTitle as string,
        description: translations.noNamesToSpinErrorDescription as string,
        variant: "destructive",
      });
      return;
    }

    playSound('/sounds/wheel-spin.mp3');

    // Calculate targets first
    const animationTargets = wheels
      .filter(w => wheelIds.includes(w.id))
      .map(w => {
        const randomSpins = Math.floor(Math.random() * 3) + 5;
        const randomStopAngle = Math.random() * 360;
        const targetRotation = w.wheelRotation + (randomSpins * 360) + randomStopAngle;

        return {
          id: w.id,
          startRotation: w.visualRotation,
          targetRotation,
        };
      });

    // Mark targeted wheels as spinning, clear all winners, and save target rotation
    setWheels(prev => prev.map(w => {
      const isTarget = wheelIds.includes(w.id);
      const target = animationTargets.find(t => t.id === w.id);
      return {
        ...w,
        isSpinning: isTarget,
        selectedName: null,
        wheelRotation: target ? target.targetRotation : w.wheelRotation,
      };
    }));

    setShowConfetti(false);

    const duration = 5000; // 5 seconds
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing: easeOutQuint (dramatic slowing down at the end)
      const eased = 1 - Math.pow(1 - progress, 5);

      setWheels(prev => prev.map(w => {
        const target = animationTargets.find(t => t.id === w.id);
        if (target) {
          const currentRot = target.startRotation + (target.targetRotation - target.startRotation) * eased;
          return {
            ...w,
            visualRotation: currentRot,
          };
        }
        return w;
      }));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        // Complete the animation, evaluate winners
        setWheels(prev => {
          const finalState = prev.map(w => {
            const target = animationTargets.find(t => t.id === w.id);
            if (target) {
              const finalAngle = target.targetRotation % 360;
              const pointerVisualAngle = 270; 
              const normalizedAngle = (pointerVisualAngle - finalAngle + 360) % 360;

              const anglePerSegment = 360 / namesList.length;
              const winnerIndex = Math.floor(normalizedAngle / anglePerSegment);
              const winner = namesList[winnerIndex % namesList.length];

              return {
                ...w,
                isSpinning: false,
                visualRotation: target.targetRotation,
                selectedName: winner,
              };
            }
            return w;
          });

          // Triggers on success
          playSound('/sounds/applause.mp3');
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 7500);

          return finalState;
        });
      }
    };

    requestAnimationFrame(tick);
  }, [namesList, wheels, toast, translations, playSound]);

  const handleRemoveWheelWinner = (wheelId: string, winnerName: string) => {
    const newNamesList = namesList.filter(name => name !== winnerName);
    setNamesInput(newNamesList.join("\n"));
    setWheels(prev => prev.map(w => {
      if (w.id === wheelId) {
        return {
          ...w,
          selectedName: null,
        };
      }
      return w;
    }));
    toast({
      title: translations.winnerRemovedToastTitle as string,
      description: (translations.winnerRemovedToastDescription as (name: string) => string)(winnerName),
      duration: 3000,
    });
  };

  const handleCloseWinnerAlert = (wheelId: string) => {
    setWheels(prev => prev.map(w => {
      if (w.id === wheelId) {
        return {
          ...w,
          selectedName: null,
        };
      }
      return w;
    }));
  };

  const namesEnteredText = typeof translations.namesEnteredSuffix === 'function'
    ? translations.namesEnteredSuffix(namesList.length)
    : `${namesList.length} ${translations.namesEnteredSuffix}`;

  // Pointer geometry relative to the dynamic wheel size
  const pointerTipX = MARGIN_FROM_SVG_EDGE; 
  const pointerTipY = dynamicWheelSize / 2; 
  const pointerBaseX1 = MARGIN_FROM_SVG_EDGE - POINTER_HEIGHT; 
  const pointerBaseY1 = pointerTipY - POINTER_WIDTH / 2;
  const pointerBaseX2 = MARGIN_FROM_SVG_EDGE - POINTER_HEIGHT;
  const pointerBaseY2 = pointerTipY + POINTER_WIDTH / 2;
  const pointerPoints = `${pointerBaseX1},${pointerBaseY1} ${pointerBaseX2},${pointerBaseY2} ${pointerTipX},${pointerTipY}`;

  return (
    <div className="space-y-6">
      {showConfetti && <Confetti />}
      
      {/* Name Inputs - Shared across all wheels */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <Label htmlFor="namesInput" className="text-sm font-medium">{translations.enterNamesLabel as string}</Label>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleShuffleNames} disabled={wheels.some(w => w.isSpinning) || namesList.length < 2} className="h-8 w-8 p-0" title={translations.shuffleNamesButtonLabel as string} aria-label={translations.shuffleNamesButtonLabel as string}>
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleSortNames} disabled={wheels.some(w => w.isSpinning) || namesList.length < 2} className="h-8 w-8 p-0" title={translations.sortNamesButtonLabel as string} aria-label={translations.sortNamesButtonLabel as string}>
              <ArrowDownAZ className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearNames} disabled={wheels.some(w => w.isSpinning) || namesList.length === 0} className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10" title={translations.clearListButton as string} aria-label={translations.clearListButton as string}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Textarea
          id="namesInput"
          value={namesInput}
          onChange={(e) => setNamesInput(e.target.value)}
          rows={5}
          className="mt-1"
          placeholder={translations.namesPlaceholder as string}
          disabled={wheels.some(w => w.isSpinning)}
        />
        <p className="text-xs text-muted-foreground mt-1">{namesEnteredText}</p>
      </div>

      {/* Multi-Wheel Dashboard Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-muted/40 border border-border">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleAddWheel} 
            disabled={wheels.length >= 6 || wheels.some(w => w.isSpinning)}
            className="flex items-center gap-2 font-medium"
          >
            <Plus className="h-4 w-4" />
            {translations.addWheelButton as string}
          </Button>
          <span className="text-xs text-muted-foreground font-semibold bg-muted px-2.5 py-1 rounded-full border border-border">
            {wheels.length} / 6
          </span>
        </div>
        
        {wheels.length > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const selectedIds = wheels.filter(w => w.isSelected).map(w => w.id);
                if (selectedIds.length > 0) spinWheels(selectedIds);
              }}
              disabled={wheels.some(w => w.isSpinning) || !wheels.some(w => w.isSelected && !w.isSpinning)}
              className="flex items-center gap-2 font-medium"
            >
              <Disc3 className="h-4 w-4" />
              {translations.spinSelectedButton as string}
            </Button>
            
            <Button
              onClick={() => {
                spinWheels(wheels.map(w => w.id));
              }}
              disabled={wheels.some(w => w.isSpinning)}
              className="flex items-center gap-2 font-medium"
            >
              <Disc3 className="h-4 w-4 animate-spin-slow" />
              {translations.spinAllButton as string}
            </Button>
          </div>
        )}
      </div>

      {/* Grid of Wheels */}
      {namesList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full justify-items-center">
          {wheels.map((wheel) => {
            // Real-time pointer color for this wheel
            const currentPointerColor = (() => {
              if (namesList.length === 0 || segments.length === 0) return "hsl(var(--accent))";
              const finalAngle = wheel.visualRotation % 360;
              const pointerVisualAngle = 270; 
              const normalizedAngle = (pointerVisualAngle - finalAngle + 360) % 360;
              const anglePerSegment = 360 / namesList.length;
              const winnerIndex = Math.floor(normalizedAngle / anglePerSegment);
              const activeSegment = segments[winnerIndex % segments.length];
              return activeSegment ? activeSegment.fillColor : "hsl(var(--accent))";
            })();

            return (
              <Card 
                key={wheel.id} 
                className={`w-full ${dynamicCardWidthClass} transition-all duration-300 relative overflow-visible border flex flex-col items-center p-4 bg-card/60 backdrop-blur-sm ${
                  wheel.isSpinning 
                    ? "ring-2 ring-primary/40 shadow-lg border-primary/20 scale-[1.01]" 
                    : "hover:shadow-md hover:border-border/80"
                }`}
              >
                {/* Header of each wheel */}
                <div className="flex items-center justify-between w-full mb-3 gap-2">
                  <div className="flex items-center gap-2">
                    {wheels.length > 1 && (
                      <input 
                        type="checkbox" 
                        checked={wheel.isSelected} 
                        onChange={() => handleToggleSelectWheel(wheel.id)}
                        disabled={wheel.isSpinning}
                        className="w-4 h-4 rounded text-primary focus:ring-primary border-muted-foreground/30 accent-primary cursor-pointer"
                      />
                    )}
                    <span className="text-sm font-bold text-foreground">
                      {(translations.wheelNameLabel as (index: number | string) => string)(wheel.name)}
                    </span>
                  </div>
                  {wheels.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveWheel(wheel.id)} 
                      disabled={wheel.isSpinning}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* SVG Render */}
                <div className="relative my-4 flex items-center justify-center">
                  <svg 
                    width={dynamicWheelSize} 
                    height={dynamicWheelSize} 
                    viewBox={`0 0 ${dynamicWheelSize} ${dynamicWheelSize}`} 
                    className="overflow-visible bg-transparent"
                  >
                    {/* Wheel Background & Outer Border */}
                    <circle 
                      cx={dynamicWheelSize / 2} 
                      cy={dynamicWheelSize / 2} 
                      r={wheelRadiusForSegments} 
                      fill="hsl(var(--background))" 
                      stroke="hsl(var(--border))" 
                      strokeWidth="3"
                      className="drop-shadow-sm"
                    />
                    
                    <g
                      style={{
                        transform: `rotate(${wheel.visualRotation}deg)`,
                        transformOrigin: 'center center',
                      }}
                    >
                      {segments.map((segment) => (
                        <g key={segment.id}>
                          <path d={segment.pathD} fill={segment.fillColor} stroke="hsl(var(--border))" strokeWidth="1"/>
                          <text
                            x={segment.textX}
                            y={segment.textY}
                            transform={segment.textTransform}
                            fill={segment.textColor}
                            fontSize={wheels.length > 3 ? "11px" : "13px"}
                            fontWeight="semibold"
                            textAnchor={segment.textAnchor}
                            dominantBaseline={segment.dominantBaseline}
                            className="pointer-events-none select-none"
                          >
                            {segment.displayName}
                          </text>
                        </g>
                      ))}
                    </g>

                    {/* Center Hub */}
                    <circle 
                      cx={dynamicWheelSize / 2} 
                      cy={dynamicWheelSize / 2} 
                      r={wheels.length > 3 ? 12 : 16} 
                      fill="hsl(var(--background))" 
                      stroke="hsl(var(--border))" 
                      strokeWidth="2.5"
                      className="drop-shadow-sm"
                    />

                    <polygon
                      points={pointerPoints}
                      fill={currentPointerColor}
                      stroke="hsl(var(--background))"
                      strokeWidth="3"
                      className="drop-shadow-md transition-colors duration-75"
                    />
                  </svg>
                </div>

                {/* Single Spin Button for this wheel */}
                <Button 
                  onClick={() => spinWheels([wheel.id])} 
                  disabled={wheel.isSpinning || wheels.some(w => w.isSpinning)} 
                  size="sm"
                  className="w-full mt-2"
                >
                  <Disc3 className={`mr-1.5 h-4 w-4 ${wheel.isSpinning ? "animate-spin" : ""}`} />
                  {wheel.isSpinning ? translations.spinningButton as string : translations.spinWheelButton as string}
                </Button>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="w-full max-w-md mx-auto aspect-video flex flex-col items-center justify-center bg-muted/30 border-dashed p-6">
          <VenetianMask className="w-16 h-16 text-muted-foreground mb-3" />
          <CardTitle className="text-muted-foreground text-center text-lg">{translations.addNamesPrompt as string}</CardTitle>
        </Card>
      )}

      {/* Aggregate Winner Display Section */}
      {wheels.some(w => w.selectedName) && !wheels.some(w => w.isSpinning) && (
        <div className="mt-6 space-y-4">
          {wheels.filter(w => w.selectedName).length === 1 ? (
            // Standard alert if only 1 winner is shown
            (() => {
              const activeWheel = wheels.find(w => w.selectedName)!;
              return (
                <Alert className="bg-green-50 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300 relative overflow-hidden shadow-sm animate-pop-in">
                  <Disc3 className="h-5 w-5 !text-green-700 dark:!text-green-300 animate-spin-slow" />
                  <AlertTitle className="font-semibold text-base flex items-center gap-1.5">
                    {translations.winnerAlertTitle as string} 
                    <span className="opacity-80">
                      ({(translations.wheelNameLabel as (index: number | string) => string)(activeWheel.name)})
                    </span>
                  </AlertTitle>
                  <AlertDescription className="text-2xl font-bold animate-pop-in mt-1 mb-4">
                    {activeWheel.selectedName}
                  </AlertDescription>
                  <div className="flex justify-end space-x-2 mt-2 border-t border-green-500/10 pt-3">
                    <Button variant="outline" size="sm" onClick={() => handleRemoveWheelWinner(activeWheel.id, activeWheel.selectedName!)} className="border-green-600 text-green-700 hover:bg-green-600 hover:text-white dark:border-green-500 dark:text-green-300 dark:hover:bg-green-600 dark:hover:text-white">
                      <Trash2 className="mr-1.5 h-4 w-4" /> {translations.removeWinnerButton as string}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCloseWinnerAlert(activeWheel.id)}
                      className="text-green-700 dark:text-green-300 hover:bg-red-600 hover:text-white dark:hover:bg-red-700 dark:hover:text-white"
                    >
                      <X className="mr-1.5 h-4 w-4" /> {translations.closeWinnerAlertButton as string}
                    </Button>
                  </div>
                </Alert>
              );
            })()
          ) : (
            // Results list layout for multiple winners
            <Card className="bg-green-500/5 border-green-500/20 dark:bg-green-900/5 dark:border-green-900/30 overflow-hidden shadow-sm">
              <div className="bg-green-500/10 px-4 py-3 border-b border-green-500/10">
                <h3 className="flex items-center gap-2 text-green-800 dark:text-green-300 text-base font-bold">
                  <Disc3 className="h-5 w-5 text-green-600 dark:text-green-400 animate-spin-slow" />
                  {translations.resultsListTitle as string}
                </h3>
              </div>
              <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {wheels.filter(w => w.selectedName).map((wheel) => (
                  <div key={wheel.id} className="flex items-center justify-between p-3.5 rounded-xl bg-card border border-green-500/15 shadow-sm animate-pop-in">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                        {(translations.wheelNameLabel as (index: number | string) => string)(wheel.name)}
                      </span>
                      <span className="text-lg font-extrabold text-foreground leading-tight">
                        {wheel.selectedName}
                      </span>
                    </div>
                    <div className="flex space-x-1.5">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRemoveWheelWinner(wheel.id, wheel.selectedName!)}
                        className="h-8 w-8 p-0 border-green-600 text-green-700 hover:bg-green-600 hover:text-white dark:border-green-500 dark:text-green-300 dark:hover:bg-green-600 dark:hover:text-white"
                        title={translations.removeWinnerButton as string}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCloseWinnerAlert(wheel.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white"
                        title={translations.closeWinnerAlertButton as string}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
