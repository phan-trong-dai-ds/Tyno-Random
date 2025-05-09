
import type { SVGProps } from 'react';

export function TailsCoinIcon(props: SVGProps<SVGSVGElement>) {
  // Scaled and centered 5-pointed star polygon points for a 40x40 viewBox
  // Original Lucide star (24x24 box) scaled by 0.8, then translated
  const starPoints = "20,12.39 22.47,17.40 28,18.21 24,22.10 24.94,27.61 20,25.01 15.06,27.61 16,22.10 12,18.21 17.53,17.40 20,12.39";

  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="20" cy="20" r="18" fill="hsl(var(--muted))" stroke="hsl(var(--foreground))" strokeWidth="2" />
      <polygon
        points={starPoints}
        fill="hsl(var(--muted-foreground))" // Silver/Grayish color for Tails star (using theme variable)
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

