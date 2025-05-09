
import type { SVGProps } from 'react';
import React from 'react'; // Import React for useId

interface CoinIconProps extends SVGProps<SVGSVGElement> {
  labelText: string;
}

export function TailsCoinIcon({ labelText, ...props }: CoinIconProps) {
  const starPoints = "20,12.39 22.47,17.40 28,18.21 24,22.10 24.94,27.61 20,25.01 15.06,27.61 16,22.10 12,18.21 17.53,17.40 20,12.39";
  const pathId = React.useId();

  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props} // Spread remaining props, including className
    >
      <defs>
        <path id={pathId} d="M 20,6 A 14,14 0 1,1 19.999,6 Z" />
      </defs>
      <circle cx="20" cy="20" r="18" fill="hsl(var(--muted))" stroke="hsl(var(--foreground))" strokeWidth="2" />
      <polygon
        points={starPoints}
        fill="hsl(var(--muted-foreground))" // Silver/Grayish color for Tails star
        stroke="hsl(var(--muted-foreground))" // Star border same as fill
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <text
        fill="hsl(var(--foreground))"
        fontSize="3.75px" // Adjusted font size
        letterSpacing="0.65px" // Adjusted letter spacing
        textAnchor="middle"
        // dy="0.5px" // Optional: slight vertical nudge
      >
        <textPath href={`#${pathId}`} startOffset="0%">
          {labelText.toUpperCase()}
        </textPath>
      </text>
    </svg>
  );
}
