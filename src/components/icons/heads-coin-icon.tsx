
import type { SVGProps } from 'react';

// CoinIconProps interface is no longer needed if it only contained labelText
// interface CoinIconProps extends SVGProps<SVGSVGElement> {
// labelText: string; // This prop is no longer needed by the icon itself
// }

export function HeadsCoinIcon(props: SVGProps<SVGSVGElement>) { // Props simplified to SVGProps<SVGSVGElement>
  const starPoints = "20,12.39 22.47,17.40 28,18.21 24,22.10 24.94,27.61 20,25.01 15.06,27.61 16,22.10 12,18.21 17.53,17.40 20,12.39";
  // pathId and React.useId() are removed as textPath is no longer used

  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props} // Spread remaining props, including className
    >
      {/* <defs> and <path id={pathId}> for textPath are removed */}
      <circle cx="20" cy="20" r="18" fill="hsl(var(--secondary))" stroke="hsl(var(--foreground))" strokeWidth="2" />
      <polygon
        points={starPoints}
        fill="hsl(50, 100%, 50%)" // Bright Yellow for Heads star
        stroke="hsl(50, 100%, 50%)" // Star border same as fill
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* <text> element for curved text is removed */}
    </svg>
  );
}
