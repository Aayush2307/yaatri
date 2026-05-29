'use client';

import { M } from './tokens';

export default function MeeraAvatar({ size = 44 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: M.headerAvatarGradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: `0 0 0 2px ${M.gold}40, 0 0 0 4px ${M.terracotta}20`,
      }}
    >
      <span
        style={{
          fontFamily: "'Noto Sans Devanagari', sans-serif",
          fontSize: size * 0.45,
          color: M.goldLight,
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        म
      </span>
    </div>
  );
}
