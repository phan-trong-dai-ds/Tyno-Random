
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Disc3, VenetianMask, Shuffle, ArrowDownAZ, Trash2, X } from "lucide-react"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Confetti } from "@/components/effects/confetti";
import { useLanguage } from "@/context/language-context";


const WHEEL_SIZE = 320; 
const POINTER_HEIGHT = 25; // Length of the pointer
const POINTER_WIDTH = 24;  // Width of the base of the pointer
const MARGIN_FROM_SVG_EDGE = 20; // Margin from SVG edge to where wheel segments/pointer tip align


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
  textPathD: string;
  textColor: string;
  fillColor: string;
}

export function NameWheel() {
  const { translations } = useLanguage();
  const [namesInput, setNamesInput] = useState("Alice\nBob\nCharlie\nDavid\nEve\nFrank\nGrace\nHenry");
  const [namesList, setNamesList] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0); 
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);

  // Calculate wheel radius for drawing segments
  const wheelRadiusForSegments = useMemo(() => WHEEL_SIZE / 2 - MARGIN_FROM_SVG_EDGE, []);


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

  const calculateTextPathD = (cx: number, cy: number, radius: number, startAngleDeg: number, endAngleDeg: number): string => {
    const textRadius = radius * 0.9;

    // The -90 offset means 0deg input refers to the top of the circle for Math.cos/sin
    const textStartAngleRad = (startAngleDeg - 90 + 5) * Math.PI / 180; 
    const textEndAngleRad = (endAngleDeg - 90 - 5) * Math.PI / 180; 

    const x1 = cx + textRadius * Math.cos(textStartAngleRad);
    const y1 = cy + textRadius * Math.sin(textStartAngleRad);
    const x2 = cx + textRadius * Math.cos(textEndAngleRad);
    const y2 = cy + textRadius * Math.sin(textEndAngleRad);
    
    // Determine if the segment is mostly in the "bottom half" (angles 90 to 270 in a 0-top system)
    // to reverse text path direction for readability.
    const midAngleDeg = (startAngleDeg + endAngleDeg) / 2;
    const isBottomHalf = midAngleDeg > 90 && midAngleDeg < 270;


    if (isBottomHalf) {
      return `M ${x2} ${y2} A ${textRadius} ${textRadius} 0 0 0 ${x1} ${y1}`;
    }
    return `M ${x1} ${y1} A ${textRadius} ${textRadius} 0 0 1 ${x2} ${y2}`;
  };


  const segments = useMemo((): Segment[] => {
    if (namesList.length === 0) return [];
    const anglePerSegment = 360 / namesList.length;

    return namesList.map((name, index) => {
      const startAngle = index * anglePerSegment; // 0 degrees is at the top (12 o'clock) due to -90 in path calc
      const endAngle = (index + 1) * anglePerSegment;
      const segmentId = `segment-${index}`;
      return {
        id: segmentId,
        name,
        startAngle,
        endAngle,
        pathD: calculateSegmentPath(WHEEL_SIZE / 2, WHEEL_SIZE / 2, wheelRadiusForSegments, startAngle, endAngle),
        textPathD: calculateTextPathD(WHEEL_SIZE / 2, WHEEL_SIZE / 2, wheelRadiusForSegments * 0.75, startAngle, endAngle),
        fillColor: WHEEL_COLORS[index % WHEEL_COLORS.length],
        textColor: "hsl(var(--primary-foreground))",
      };
    });
  }, [namesList, wheelRadiusForSegments]);

  const handleSpinWheel = useCallback(() => {
    if (namesList.length === 0) {
      toast({
        title: translations.noNamesToSpinErrorTitle as string,
        description: translations.noNamesToSpinErrorDescription as string,
        variant: "destructive",
      });
      return;
    }
    setIsSpinning(true);
    setSelectedName(null);
    setShowConfetti(false); 

    const randomSpins = Math.floor(Math.random() * 3) + 5;
    const randomStopAngle = Math.random() * 360;
    const targetRotation = wheelRotation + (randomSpins * 360) + randomStopAngle;

    setWheelRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const finalAngle = targetRotation % 360; // Effective rotation of the wheel (clockwise)
      
      // Pointer is visually at the left-middle (9 o'clock position).
      // Segments are defined with 0 degrees at the top (12 o'clock) and angles increasing clockwise
      // (due to the -90 degree offset in `calculateSegmentPath`).
      // In this segment definition system, the left-middle pointer corresponds to 270 degrees.
      // The wheel rotates by `finalAngle` (clockwise).
      // So, the original segment angle that lands under the pointer is (270 - finalAngle) mod 360.
      const normalizedAngle = (270 - finalAngle + 360) % 360;
      
      const anglePerSegment = 360 / namesList.length;
      const winnerIndex = Math.floor(normalizedAngle / anglePerSegment);
      
      const winner = namesList[winnerIndex % namesList.length]; // ensure index is within bounds
      setSelectedName(winner);
      setShowConfetti(true); 
      setTimeout(() => setShowConfetti(false), 7500); 
    }, 5000);
  }, [namesList, wheelRotation, toast, translations]);

  const handleRemoveWinner = () => {
    if (!selectedName) return;
    const newNamesList = namesList.filter(name => name !== selectedName);
    setNamesInput(newNamesList.join("\n"));
    const removedName = selectedName; // store before clearing
    setSelectedName(null); 
    setShowConfetti(false); 
    toast({
      title: translations.winnerRemovedToastTitle as string,
      description: (translations.winnerRemovedToastDescription as (name: string) => string)(removedName),
      duration: 3000,
    });
  };

  const handleCloseWinnerAlert = () => {
    setSelectedName(null);
    setShowConfetti(false); 
  };

  const namesEnteredText = typeof translations.namesEnteredSuffix === 'function' 
    ? translations.namesEnteredSuffix(namesList.length) 
    : `${namesList.length} ${translations.namesEnteredSuffix}`;

  // Calculate pointer points for a left-pointing arrow
  // Tip of the pointer will be at the left edge of the segment circle
  const pointerTipX = MARGIN_FROM_SVG_EDGE;
  const pointerTipY = WHEEL_SIZE / 2;
  // Base of the pointer will be to the left of the tip
  const pointerBaseX = MARGIN_FROM_SVG_EDGE - POINTER_HEIGHT;
  // Polygon points for a triangle pointing right (tip towards wheel)
  const pointerPoints = `${pointerBaseX},${pointerTipY - POINTER_WIDTH / 2} ${pointerBaseX},${pointerTipY + POINTER_WIDTH / 2} ${pointerTipX},${pointerTipY}`;


  return (
    <div className="space-y-6">
      {showConfetti && <Confetti />}
      <div>
        <div className="flex justify-between items-center mb-1">
          <Label htmlFor="namesInput" className="text-sm font-medium">{translations.enterNamesLabel as string}</Label>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleShuffleNames} disabled={isSpinning || namesList.length < 2} aria-label={translations.shuffleNamesButtonLabel as string}>
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleSortNames} disabled={isSpinning || namesList.length < 2} aria-label={translations.sortNamesButtonLabel as string}>
              <ArrowDownAZ className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Textarea
          id="namesInput"
          value={namesInput}
          onChange={(e) => setNamesInput(e.target.value)}
          rows={6}
          className="mt-1"
          placeholder={translations.namesPlaceholder as string}
          disabled={isSpinning}
        />
        <p className="text-xs text-muted-foreground mt-1">{namesEnteredText}</p>
      </div>

      <div className="relative flex flex-col items-center space-y-4">
        {namesList.length > 0 ? (
          <svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`} className="rounded-full shadow-xl border-4 border-background overflow-visible"> {/* Added overflow-visible */}
            <g
              style={{
                transform: `rotate(${wheelRotation}deg)`,
                transformOrigin: 'center center',
                transition: isSpinning ? 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
              }}
            >
              {segments.map((segment) => (
                <g key={segment.id}>
                  <path d={segment.pathD} fill={segment.fillColor} stroke="hsl(var(--border))" strokeWidth="1"/>
                  <defs>
                     <path id={segment.id + "-textpath"} d={segment.textPathD} />
                  </defs>
                  <text fill={segment.textColor} fontSize="12px" fontWeight="medium" dy="0.35em" className="pointer-events-none select-none">
                    <textPath xlinkHref={`#${segment.id}-textpath`} startOffset="50%" textAnchor="middle">
                      {segment.name.length > 15 ? segment.name.substring(0,12) + "..." : segment.name}
                    </textPath>
                  </text>
                </g>
              ))}
            </g>
            {/* Pointer */}
            <polygon
                points={pointerPoints}
                fill="hsl(var(--accent))"
                stroke="hsl(var(--accent-foreground))"
                strokeWidth="2"
                className="drop-shadow-md"
            />
          </svg>
        ) : (
          <Card className="w-full max-w-xs aspect-square flex flex-col items-center justify-center bg-muted/50 border-dashed">
            <VenetianMask className="w-24 h-24 text-muted-foreground mb-4" />
            <CardTitle className="text-muted-foreground">{translations.addNamesPrompt as string}</CardTitle>
          </Card>
        )}

        <Button onClick={handleSpinWheel} disabled={isSpinning || namesList.length === 0} className="w-full max-w-xs py-3 text-lg">
          <Disc3 className="mr-2 h-6 w-6" />
          {isSpinning ? translations.spinningButton as string : translations.spinWheelButton as string}
        </Button>
      </div>

      {selectedName && !isSpinning && (
        <Alert className="mt-6 bg-green-50 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300 relative overflow-hidden"> 
           <Disc3 className="h-5 w-5 !text-green-700 dark:!text-green-300" />
          <AlertTitle className="font-semibold text-lg">{translations.winnerAlertTitle as string}</AlertTitle>
          <AlertDescription className="text-2xl font-bold animate-pop-in mb-4">
            {selectedName}
          </AlertDescription>
          <div className="flex justify-end space-x-2 mt-2">
            <Button variant="outline" size="sm" onClick={handleRemoveWinner} className="border-green-600 text-green-700 hover:bg-green-600 hover:text-white dark:border-green-500 dark:text-green-300 dark:hover:bg-green-600 dark:hover:text-white">
              <Trash2 className="mr-1 h-4 w-4" /> {translations.removeWinnerButton as string}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseWinnerAlert}
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

