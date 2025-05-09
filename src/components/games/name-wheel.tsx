
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
const POINTER_HEIGHT = 25;
const POINTER_WIDTH = 24;
// WHEEL_RADIUS is calculated from WHEEL_SIZE, but actual segment drawing uses WHEEL_SIZE/2 as center and WHEEL_RADIUS for paths.
// Top of wheel circle (segments) is at y = (WHEEL_SIZE / 2) - WHEEL_RADIUS.
// If WHEEL_RADIUS = WHEEL_SIZE / 2 - 20, then top of wheel circle is y = 20.
const WHEEL_SEGMENT_TOP_Y = 20; 


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
  const wheelRadiusForSegments = useMemo(() => WHEEL_SIZE / 2 - 20, []);


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

    const textStartAngleRad = (startAngleDeg - 90 + 5) * Math.PI / 180; 
    const textEndAngleRad = (endAngleDeg - 90 - 5) * Math.PI / 180; 

    const x1 = cx + textRadius * Math.cos(textStartAngleRad);
    const y1 = cy + textRadius * Math.sin(textStartAngleRad);
    const x2 = cx + textRadius * Math.cos(textEndAngleRad);
    const y2 = cy + textRadius * Math.sin(textEndAngleRad);
    
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
      const startAngle = index * anglePerSegment;
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
      const finalAngle = targetRotation % 360;
      // The pointer is at the top (0 degrees in a typical rotational system where 0 is right, 90 is top).
      // SVG rotation is clockwise. A segment's startAngle is 0 for the first segment at the "3 o'clock" position, increasing clockwise.
      // We need to find which segment is under the pointer (top, which is 270 degrees or -90 from SVG's 0=right).
      // Or, if 0 degrees is top for pointer, then finalAngle directly gives how much the "0 degree segment" moved.
      // Let's adjust effectiveAngle to map to array indices correctly.
      // Pointer is at 12 o'clock. A segment defined from startAngle to endAngle.
      // If wheel rotates `finalAngle` clockwise, the segment originally at `theta` is now at `theta + finalAngle`.
      // We want the segment whose *new* position spans the 12 o'clock mark (270 deg if 0 is right, or 0 if 0 is top).
      // Let's assume our fixed pointer is at logical 0 degrees (top).
      // An item originally at angle `alpha` (measured from top, clockwise) ends up at `alpha - finalAngle` relative to top.
      // We want the item for which `alpha - finalAngle` is effectively 0 (or 360, 720...).
      // So, `alpha` is effectively `finalAngle`.
      // The winning segment is the one whose original angular range contains `finalAngle`.
      // No, it's simpler: the point that ends up at the top (under the pointer) was originally at `360 - finalAngle` (if measuring from top, CW).
      
      const anglePerSegment = 360 / namesList.length;
      // `finalAngle` is the clockwise rotation from the initial state.
      // The pointer is at the top (imagine it at 0 degrees on a fixed circle).
      // A segment that starts at `segment.startAngle` (where 0 is to the right, increases CW)
      // after rotation, its start is at `segment.startAngle + finalAngle`.
      // The top of the wheel corresponds to an angle of 270 degrees in this coordinate system.
      // So we are looking for a segment such that `segment.startAngle + finalAngle <= 270` and `segment.endAngle + finalAngle > 270` (modulo 360).
      // More simply: what original angle landed at the top? It's (360 - finalAngle + 270) % 360 = (630 - finalAngle) % 360.
      // Let's use the common convention that the pointer indicates the segment whose range *covers* the pointer's angle.
      // The pointer is at 270 deg (top). After wheel rotation `R`, a point initially at `theta_orig` is now at `theta_orig + R`.
      // We want `theta_orig + R = 270` (mod 360). So `theta_orig = (270 - R)` (mod 360).
      // The winning segment's range must contain this `theta_orig`.
      const normalizedAngle = (270 - (finalAngle % 360) + 360) % 360; // Angle under the pointer, in original wheel coordinates
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

  // Calculate pointer points
  const pointerBaseY = WHEEL_SEGMENT_TOP_Y - POINTER_HEIGHT;
  const pointerTipY = WHEEL_SEGMENT_TOP_Y;
  const pointerPoints = `${WHEEL_SIZE/2 - POINTER_WIDTH/2},${pointerBaseY} ${WHEEL_SIZE/2 + POINTER_WIDTH/2},${pointerBaseY} ${WHEEL_SIZE/2},${pointerTipY}`;

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
          <svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`} className="rounded-full shadow-xl border-4 border-background">
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

