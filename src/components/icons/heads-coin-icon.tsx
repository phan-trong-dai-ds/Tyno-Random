
import type { SVGProps } from 'react';

export function HeadsCoinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="20" cy="20" r="18" fill="hsl(var(--secondary))" stroke="hsl(var(--foreground))" strokeWidth="2" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="20"
        fontWeight="bold"
        fill="hsl(var(--foreground))"
        dy=".1em" // Adjust for vertical centering
      >
        H
      </text>
    </svg>
  );
}
