
"use client";

import type { CSSProperties } from 'react';
import { useEffect, useState, useMemo } from 'react';

interface ConfettiPieceData {
  id: string; // Changed to string for unique keys with prefix
  style: CSSProperties;
  color: string;
}

const confettiColors = [
  "hsl(0, 75%, 60%)",   // Red
  "hsl(120, 75%, 45%)", // Green
  "hsl(60, 85%, 55%)",  // Yellow
  "hsl(220, 75%, 55%)", // Blue
  "hsl(30, 85%, 53%)",  // Orange
  "hsl(325, 75%, 58%)", // Lotus Pink
];

const NUM_CONFETTI_PIECES = 60; // Increased for a bit more density

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPieceData[]>([]);
  
  // useMemo to ensure key is stable if component re-renders for other reasons
  const componentId = useMemo(() => `confetti-set-${Math.random().toString(36).substr(2, 9)}`, []);


  useEffect(() => {
    const newPieces: ConfettiPieceData[] = [];
    const screenWidth = window.innerWidth; // Get screen width for more accurate horizontal positioning

    for (let i = 0; i < NUM_CONFETTI_PIECES; i++) {
      const horizontalSway = (Math.random() - 0.5) * 20; // vw, for wider horizontal movement
      newPieces.push({
        id: `${componentId}-piece-${i}`, // Unique ID for each piece
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        style: {
          left: `${Math.random() * 95}%`, // Spread across 95% of the width to avoid edge clipping
          animationDelay: `${Math.random() * 1.2}s`, // Stagger start times slightly more
          transform: `rotate(${Math.random() * 360}deg) translateX(${horizontalSway}vw) scale(${Math.random() * 0.4 + 0.8})`, // Initial random rotation, horizontal offset, and slight size variation
          willChange: 'transform, opacity', // Performance hint
        },
      });
    }
    setPieces(newPieces);
  }, [componentId]); // Re-run if componentId changes (though it shouldn't in this setup)

  if (!pieces.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1000] overflow-hidden" aria-hidden="true"> {/* Higher z-index and aria-hidden */}
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            ...piece.style,
            backgroundColor: piece.color,
          }}
        />
      ))}
    </div>
  );
}
