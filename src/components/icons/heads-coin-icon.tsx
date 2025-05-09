
import type { SVGProps } from 'react';
import React from 'react'; // Import React for useId

interface CoinIconProps extends SVGProps<SVGSVGElement> {
  labelText: string;
}

export function HeadsCoinIcon({ labelText, ...props }: CoinIconProps) {
  const starPoints = "20,12.39 22.47,17.40 28,18.21 24,22.10 24.94,27.61 20,25.01 15.06,27.61 16,22.10 12,18.21 17.53,17.40 20,12.39";
  // Generate a unique ID for the path to avoid conflicts if multiple icons are on the page
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
        {/* Path for text: A circle of radius 14, starting at the top (12 o'clock) and going clockwise.
            SVG path: M = moveto, A = elliptical arc
            M 20,6 (center x=20, y=center_y - radius = 20-14=6)
            A 14,14 (rx,ry) 0 (x-axis-rotation) 1 (large-arc-flag) 1 (sweep-flag clockwise) 19.999,6 (end point, slightly offset to ensure full arc) Z (close path)
        */}
        <path id={pathId} d="M 20,6 A 14,14 0 1,1 19.999,6 Z" />
      </defs>
      <circle cx="20" cy="20" r="18" fill="hsl(var(--secondary))" stroke="hsl(var(--foreground))" strokeWidth="2" />
      <polygon
        points={starPoints}
        fill="hsl(50, 100%, 50%)" // Bright Yellow for Heads star
        stroke="hsl(50, 100%, 50%)" // Star border same as fill
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <text
        fill="hsl(var(--foreground))"
        fontSize="3.75px" // Adjusted font size for clarity on curve
        letterSpacing="0.65px" // Adjusted letter spacing for readability on curve
        textAnchor="middle" // Centers the text block on the startOffset point
        // dy="0.5px" // Optional: slight vertical nudge for better visual centering on the path
      >
        {/* xlinkHref needs the # to reference the path ID */}
        {/* startOffset="0%" places the middle of the text (due to textAnchor="middle") at the beginning of the path (12 o'clock) */}
        <textPath href={`#${pathId}`} startOffset="0%">
          {labelText.toUpperCase()}
        </textPath>
      </text>
    </svg>
  );
}
