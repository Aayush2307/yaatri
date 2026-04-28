import type { SVGProps } from 'react';

export function MandalaWatermark(props: SVGProps<SVGSVGElement>) {
  const center = 150;
  const lineLength = 130;
  const ellipseAngles = [0, 45, 90, 135, 22.5, 67.5, 112.5, 157.5];

  return (
    <svg width="300" height="300" viewBox="0 0 300 300" fill="none" aria-hidden="true" {...props}>
      <circle cx={center} cy={center} r="130" stroke="white" strokeWidth="0.8" />
      <circle cx={center} cy={center} r="100" stroke="white" strokeWidth="0.5" />
      <circle cx={center} cy={center} r="70" stroke="white" strokeWidth="0.8" />
      <circle cx={center} cy={center} r="40" stroke="white" strokeWidth="0.5" />

      {[0, 45, 90, 135].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const dx = Math.cos(rad) * lineLength;
        const dy = Math.sin(rad) * lineLength;
        return (
          <line
            key={angle}
            x1={center - dx}
            y1={center - dy}
            x2={center + dx}
            y2={center + dy}
            stroke="white"
            strokeWidth="0.4"
          />
        );
      })}

      {ellipseAngles.map((angle) => (
        <ellipse
          key={angle}
          cx={center}
          cy={center}
          rx="10"
          ry="18"
          stroke="white"
          strokeWidth="0.5"
          transform={`rotate(${angle} ${center} ${center}) translate(0 -100)`}
        />
      ))}
    </svg>
  );
}
