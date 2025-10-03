'use client';

import React, { useMemo } from 'react';

interface MiniSparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  showArea?: boolean;
}

const MiniSparkline: React.FC<MiniSparklineProps> = ({
  data,
  color = '#a21caf',
  height = 56,
  width = 180,
  showArea = true,
}) => {
  const { path, areaPath } = useMemo(() => {
    const safe = data && data.length > 0 ? data : [0];
    const minVal = Math.min(...safe);
    const maxVal = Math.max(...safe);
    const range = maxVal - minVal || 1;
    const points = safe.map((v, i) => {
      const x = (i / (safe.length - 1 || 1)) * (width - 2) + 1;
      const y = height - 4 - ((v - minVal) / range) * (height - 8);
      return [x, y] as const;
    });
    const d = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
    const area = `${d} L ${width - 1} ${height - 2} L 1 ${height - 2} Z`;
    return { path: d, areaPath: area };
  }, [data, height, width]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.22} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {showArea && (
        <path d={areaPath} fill="url(#sparklineGradient)" />
      )}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        style={{
          strokeDasharray: 600,
          strokeDashoffset: 600,
          animation: 'spark-draw 1200ms ease-out forwards',
        }}
      />
      <style>{`
        @keyframes spark-draw { to { stroke-dashoffset: 0; } }
      `}</style>
    </svg>
  );
};

export default MiniSparkline;


