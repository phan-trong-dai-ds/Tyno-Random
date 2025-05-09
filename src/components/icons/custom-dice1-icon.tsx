
import type { SVGProps } from 'react';

export function CustomDice1Icon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="12" cy="12" r="2" fill="currentColor" /> {/* Increased radius from default path behavior */}
    </svg>
  );
}
