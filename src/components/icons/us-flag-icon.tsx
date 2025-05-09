
import type { SVGProps } from 'react';

export function USFlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="24" height="4" y="0" fill="#B22234" />
      <rect width="24" height="4" y="4" fill="#FFFFFF" />
      <rect width="24" height="4" y="8" fill="#B22234" />
      <rect width="24" height="4" y="12" fill="#FFFFFF" />
      <rect width="24" height="4" y="16" fill="#B22234" />
      <rect width="24" height="4" y="20" fill="#FFFFFF" />
      <rect width="12" height="12" x="0" y="0" fill="#3C3B6E" />
      <circle cx="2.5" cy="2.5" r="0.75" fill="#FFFFFF" />
      <circle cx="5.5" cy="2.5" r="0.75" fill="#FFFFFF" />
      <circle cx="8.5" cy="2.5" r="0.75" fill="#FFFFFF" />
      <circle cx="2.5" cy="5.5" r="0.75" fill="#FFFFFF" />
      <circle cx="5.5" cy="5.5" r="0.75" fill="#FFFFFF" />
      <circle cx="8.5" cy="5.5" r="0.75" fill="#FFFFFF" />
      <circle cx="2.5" cy="8.5" r="0.75" fill="#FFFFFF" />
      <circle cx="5.5" cy="8.5" r="0.75" fill="#FFFFFF" />
      <circle cx="8.5" cy="8.5" r="0.75" fill="#FFFFFF" />
    </svg>
  );
}
