
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Disc3, VenetianMask, Shuffle, ArrowDownAZ, Trash2, X } from "lucide-react"; // VenetianMask for 'no names'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";


const WHEEL_SIZE = 320; // SVG canvas size
const WHEEL_RADIUS = WHEEL_SIZE / 2 - 20; // Actual wheel radius, leave some padding

// Updated color palette as per user request
const WHEEL_COLORS = [
  "hsl(0, 75%, 60%)",   // Red
  "hsl(120, 75%, 45%)", // Green (adjusted for better visibility)
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
  const [namesInput, setNamesInput] = useState("Alice\nBob\nCharlie\nDavid\nEve\nFrank\nGrace\nHenry");
  const [namesList, setNamesList] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0); // in degrees
  const { toast } = useToast();

  useEffect(() => {
    const parsedNames = namesInput.split("\n").map(name => name.trim()).filter(name => name.length > 0);
    setNamesList(parsedNames);
    // Do not reset selectedName here, allow the alert to persist if names are edited while it's shown
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
    const startAngleRad = (startAngleDeg - 90) * Math.PI / 180; // Adjust by -90 to start from top
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
        pathD: calculateSegmentPath(WHEEL_SIZE / 2, WHEEL_SIZE / 2, WHEEL_RADIUS, startAngle, endAngle),
        textPathD: calculateTextPathD(WHEEL_SIZE / 2, WHEEL_SIZE / 2, WHEEL_RADIUS * 0.75, startAngle, endAngle),
        fillColor: WHEEL_COLORS[index % WHEEL_COLORS.length],
        textColor: "hsl(var(--primary-foreground))", 
      };
    });
  }, [namesList]);

  const handleSpinWheel = useCallback(() => {
    if (namesList.length === 0) {
      toast({
        title: "No names to spin!",
        description: "Please add some names to the list first.",
        variant: "destructive",
      });
      return;
    }
    setIsSpinning(true);
    setSelectedName(null);

    const randomSpins = Math.floor(Math.random() * 3) + 5; 
    const randomStopAngle = Math.random() * 360;
    const targetRotation = wheelRotation + (randomSpins * 360) + randomStopAngle;
    
    setWheelRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const finalAngle = targetRotation % 360;
      const effectiveAngle = (360 - (finalAngle % 360)) % 360;

      const winnerIndex = Math.floor(effectiveAngle / (360 / namesList.length));
      const winner = namesList[winnerIndex % namesList.length]; 
      setSelectedName(winner);
      // Removed toast for winner announcement, as the Alert will handle it.
    }, 5000); 
  }, [namesList, wheelRotation, toast]);

  const handleRemoveWinner = () => {
    if (!selectedName) return;
    const newNamesList = namesList.filter(name => name !== selectedName);
    setNamesInput(newNamesList.join("\n"));
    setSelectedName(null); // Hide the alert
    toast({
      title: "Winner Removed",
      description: `${selectedName} has been removed from the list.`,
      duration: 3000,
    });
  };

  const handleCloseWinnerAlert = () => {
    setSelectedName(null);
  };


  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-1">
          <Label htmlFor="namesInput" className="text-sm font-medium">Enter Names (one per line)</Label>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleShuffleNames} disabled={isSpinning || namesList.length < 2} aria-label="Shuffle names">
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleSortNames} disabled={isSpinning || namesList.length < 2} aria-label="Sort names">
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
          placeholder="Alice\nBob\nCharlie..."
          disabled={isSpinning}
        />
        <p className="text-xs text-muted-foreground mt-1">{namesList.length} name(s) entered.</p>
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
                points={`${WHEEL_SIZE/2 - 12},${WHEEL_SIZE - 20 - 25} ${WHEEL_SIZE/2 + 12},${WHEEL_SIZE - 20 - 25} ${WHEEL_SIZE/2},${WHEEL_SIZE - 20}`} 
                fill="hsl(var(--accent))" 
                stroke="hsl(var(--accent-foreground))" 
                strokeWidth="2"
                className="drop-shadow-md"
                transform={`translate(0, ${WHEEL_SIZE - 20 - (WHEEL_SIZE -20 -25)/2}) rotate(180 ${WHEEL_SIZE/2} ${(WHEEL_SIZE - 20 - (WHEEL_SIZE -20 -25)/2) - (25/2) }) translate(0, -${WHEEL_SIZE - 20 - (WHEEL_SIZE -20 -25)/2})`}
            />
          </svg>
        ) : (
          <Card className="w-full max-w-xs aspect-square flex flex-col items-center justify-center bg-muted/50 border-dashed">
            <VenetianMask className="w-24 h-24 text-muted-foreground mb-4" />
            <CardTitle className="text-muted-foreground">Add names to see the wheel!</CardTitle>
          </Card>
        )}

        <Button onClick={handleSpinWheel} disabled={isSpinning || namesList.length === 0} className="w-full max-w-xs py-3 text-lg">
          <Disc3 className="mr-2 h-6 w-6" />
          {isSpinning ? "Spinning..." : "Spin the Wheel!"}
        </Button>
      </div>

      {selectedName && !isSpinning && (
        <Alert className="mt-6 bg-green-50 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300">
           <Disc3 className="h-5 w-5 !text-green-700 dark:!text-green-300" />
          <AlertTitle className="font-semibold text-lg">Winner!</AlertTitle>
          <AlertDescription className="text-2xl font-bold animate-pop-in mb-4">
            {selectedName}
          </AlertDescription>
          <div className="flex justify-end space-x-2 mt-2">
            <Button variant="outline" size="sm" onClick={handleRemoveWinner} className="border-green-600 text-green-700 hover:bg-green-100 dark:border-green-500 dark:text-green-300 dark:hover:bg-green-800/50">
              <Trash2 className="mr-1 h-4 w-4" /> Remove
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCloseWinnerAlert} className="text-green-700 hover:bg-green-100 dark:text-green-300 dark:hover:bg-green-800/50">
              <X className="mr-1 h-4 w-4" /> Close
            </Button>
          </div>
        </Alert>
      )}
    </div>
  );
}

