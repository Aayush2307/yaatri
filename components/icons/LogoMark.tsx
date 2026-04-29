import type { SVGProps } from 'react';

export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden="true" {...props}>
      <circle cx="40" cy="40" r="12" stroke="#C8B8FF" strokeWidth="1" />
      <circle cx="40" cy="40" r="4" fill="#C8B8FF" />
      <circle cx="40" cy="40" r="8" fill="#534AB7" fillOpacity="0.3" />
      <path d="M40 18 Q54 29 54 40 Q54 51 40 62 Q26 51 26 40 Q26 29 40 18Z" stroke="#7F77DD" strokeWidth="1" />
      <circle cx="40" cy="40" r="19" stroke="#534AB7" strokeWidth="0.5" strokeDasharray="3 4" />
      <circle cx="40" cy="18" r="2" fill="#C8A855" />
      <circle cx="40" cy="62" r="2" fill="#C8A855" fillOpacity="0.5" />
    </svg>
  );
}
