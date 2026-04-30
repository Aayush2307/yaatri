import type { CSSProperties } from 'react';

type YaatriLogoProps = {
  size?: 'sm' | 'md';
  className?: string;
};

export function YaatriLogo({ size = 'md', className = '' }: YaatriLogoProps) {
  const isSmall = size === 'sm';
  const iconHeight = isSmall ? 58 : 68;
  const titleSize = isSmall ? 42 : 50;
  const subtitleSize = isSmall ? 11 : 12;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={isSmall ? 56 : 64}
        height={iconHeight}
        viewBox="0 0 64 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="32" cy="8" r="6" stroke="#C4671A" strokeWidth="3" />
        <circle cx="32" cy="8" r="1.5" fill="#C4671A" />
        <path d="M32 14V24" stroke="#C4671A" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M32 24L8 66H56L32 24Z" stroke="#C4671A" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M14 50H50" stroke="#C4671A" strokeWidth="2.4" strokeLinecap="round" />
      </svg>

      <div className="leading-none">
        <p
          className="font-serif uppercase text-[#2A160B]"
          style={{
            fontSize: `${titleSize / 16}rem`,
            letterSpacing: isSmall ? '0.14em' : '0.16em',
            lineHeight: 0.95,
          }}
        >
          YAATRI
        </p>
        <p
          className="pt-1 uppercase text-[#9A6A42]"
          style={{
            fontSize: `${subtitleSize / 16}rem`,
            letterSpacing: isSmall ? '0.5em' : '0.56em',
            lineHeight: 1,
          } as CSSProperties}
        >
          SACRED JOURNEYS
        </p>
      </div>
    </div>
  );
}

export default YaatriLogo;
