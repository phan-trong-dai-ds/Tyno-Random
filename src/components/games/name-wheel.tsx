
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Disc3, VenetianMask } from "lucide-react"; // VenetianMask for 'no names'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";


const WHEEL_SIZE = 320; // SVG canvas size
const WHEEL_RADIUS = WHEEL_SIZE / 2 - 20; // Actual wheel radius, leave some padding

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
  const [namesInput, setNamesInput] = useState("Alice\nBob\nCharlie\nDavid\nEve\nFrank");
  const [namesList, setNamesList] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0); // in degrees
  const { toast } = useToast();

  useEffect(() => {
    const parsedNames = namesInput.split("\n").map(name => name.trim()).filter(name => name.length > 0);
    setNamesList(parsedNames);
    setSelectedName(null); // Reset selected name when list changes
  }, [namesInput]);

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
    const midAngleDeg = (startAngleDeg + endAngleDeg) / 2;
    // Place text path closer to the outer edge for readability
    const textRadius = radius * 0.9; 
  
    // Create a path from start to end of the segment's arc at textRadius
    // Adjust by -90 to start from top. Text direction might need to be handled.
    const textStartAngleRad = (startAngleDeg - 90 + 5) * Math.PI / 180; // Small offset from edge
    const textEndAngleRad = (endAngleDeg - 90 - 5) * Math.PI / 180; // Small offset from edge
  
    const x1 = cx + textRadius * Math.cos(textStartAngleRad);
    const y1 = cy + textRadius * Math.sin(textStartAngleRad);
    const x2 = cx + textRadius * Math.cos(textEndAngleRad);
    const y2 = cy + textRadius * Math.sin(textEndAngleRad); // Calculate y2
    
    // if segment angle is > 180, text might be upside down.
    // For simplicity, we assume segments are not that large or text is short.
    // const sweepFlag = midAngleDeg > 180 && (endAngleDeg - startAngleDeg) < 180 ? 0 : 1; 
    // This logic for sweepFlag might need adjustment for text orientation
    // For typical wheels, sweepFlag is 1. The SVG arc path A command takes 7 parameters:
    // rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y
    // The sweep-flag (0 or 1) determines if the arc is drawn clockwise or counter-clockwise.
    // We want the text to generally flow from start to end of the segment along the arc.
    // A sweep-flag of 1 typically draws the arc in a "positive-angle" direction.

    return `M ${x1} ${y1} A ${textRadius} ${textRadius} 0 0 1 ${x2} ${y2}`;
  };


  const segments = useMemo((): Segment[] => {
    if (namesList.length === 0) return [];
    const anglePerSegment = 360 / namesList.length;
    const colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))"];
    
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
        textPathD: calculateTextPathD(WHEEL_SIZE / 2, WHEEL_SIZE / 2, WHEEL_RADIUS * 0.75, startAngle, endAngle), // Text path slightly inside
        fillColor: colors[index % colors.length],
        textColor: "hsl(var(--primary-foreground))", // Assuming primary-foreground is good contrast on all segment fills
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

    const randomSpins = Math.floor(Math.random() * 3) + 5; // 5 to 7 full spins
    const randomStopAngle = Math.random() * 360;
    const targetRotation = wheelRotation + (randomSpins * 360) + randomStopAngle;
    
    setWheelRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const finalAngle = targetRotation % 360;
      // Pointer is at the top (270 deg in SVG if 0 is right). We map wheel's 0 to be top.
      // The angle on the wheel that aligns with the pointer (top of the wheel, effectively 0 degrees in our segment calculation).
      // Our segments start at 0 deg (top) and go clockwise.
      // The pointer points to whatever segment is at the top.
      // So, `effectiveAngle = (360 - finalAngle) % 360` is the "start" of wheel at the pointer.
      const effectiveAngle = (360 - (finalAngle % 360)) % 360;

      const winnerIndex = Math.floor(effectiveAngle / (360 / namesList.length));
      const winner = namesList[winnerIndex % namesList.length]; // Modulo for safety
      setSelectedName(winner);
      toast({
        title: "And the winner is...",
        description: winner,
        duration: 5000,
      });
    }, 5000); // Corresponds to CSS transition duration
  }, [namesList, wheelRotation, toast]);


  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="namesInput" className="text-sm font-medium">Enter Names (one per line)</Label>
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
              {segments.map((segment, index) => (
                <g key={segment.id}>
                  <path d={segment.pathD} fill={segment.fillColor} stroke="hsl(var(--border))" strokeWidth="1"/>
                  <defs>
                     <path id={segment.id + "-textpath"} d={segment.textPathD} />
                  </defs>
                  <text fill={segment.textColor} fontSize="12px" fontWeight="medium" dy="0.35em">
                     {/* Text path needs careful adjustment based on segment angle */}
                    <textPath xlinkHref={`#${segment.id}-textpath`} startOffset="50%" textAnchor="middle">
                      {segment.name.length > 15 ? segment.name.substring(0,12) + "..." : segment.name}
                    </textPath>
                  </text>
                </g>
              ))}
            </g>
            {/* Pointer */}
            <polygon 
                points={`${WHEEL_SIZE/2},0 ${WHEEL_SIZE/2 - 12},25 ${WHEEL_SIZE/2 + 12},25`} 
                fill="hsl(var(--accent))" 
                stroke="hsl(var(--accent-foreground))" 
                strokeWidth="2"
                className="drop-shadow-md"
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
          <AlertDescription className="text-2xl font-bold animate-pop-in">
            {selectedName}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

