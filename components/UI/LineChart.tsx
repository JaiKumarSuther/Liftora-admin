'use client';

import React, { useMemo, useState } from 'react';

type Series = {
  name: string;
  color: string;
  data: number[];
};

interface LineChartProps {
  series: Series[];
  height?: number;
  gridLines?: number; // horizontal grid lines
  title?: string;
  xAxisLabels?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
}

const LineChart: React.FC<LineChartProps> = ({
  series,
  height = 320,
  gridLines = 4,
  title,
  xAxisLabels,
  showLegend = true,
  showTooltip = true,
  selectedPeriod = '7d',
  onPeriodChange,
}) => {
  const width = 1000; // viewBox width; the svg will be responsive using width="100%"
  const [hoveredPoint, setHoveredPoint] = useState<{seriesIndex: number, pointIndex: number} | null>(null);
  const [hoveredSeries, setHoveredSeries] = useState<number | null>(null);

  const { ymax, paths, points } = useMemo(() => {
    const all = series.flatMap(s => s.data);
    const max = Math.max(...all, 1); // Use actual max or 1 as minimum
    const len = Math.max(2, ...series.map(s => s.data.length));

    const makePath = (points: number[]) => {
      const stepX = (width - 60) / (len - 1);
      const mapX = (i: number) => 40 + i * stepX;
      const mapY = (v: number) => height - 50 - (v / max) * (height - 80);
      const cmds = points.map((v, i) => `${i === 0 ? 'M' : 'L'} ${mapX(i)} ${mapY(v)}`).join(' ');
      const area = `${cmds} L ${mapX(points.length - 1)} ${height - 50} L ${mapX(0)} ${height - 50} Z`;
      return { line: cmds, area, points: points.map((v, i) => ({ x: mapX(i), y: mapY(v) })) };
    };

    return {
      ymax: max,
      paths: series.map(s => ({ ...makePath(s.data), color: s.color, name: s.name })),
      points: series.map(s => makePath(s.data).points),
    };
  }, [series, height]);

  const gridYs = Array.from({ length: gridLines + 1 }, (_, i) => i / gridLines);
  const gridValues = gridYs.map(t => {
    const value = t * ymax;
    // For better readability, round to appropriate precision
    if (ymax <= 10) return Math.round(value);
    if (ymax <= 100) return Math.round(value / 5) * 5;
    if (ymax <= 1000) return Math.round(value / 10) * 10;
    return Math.round(value / 100) * 100;
  });

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!showTooltip) return;
    
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    // Find closest point
    let minDistance = Infinity;
    let closestPoint: {seriesIndex: number, pointIndex: number} | null = null;
    
    points.forEach((seriesPoints, seriesIndex) => {
      seriesPoints.forEach((point, pointIndex) => {
        const distance = Math.sqrt(Math.pow(point.x - svgP.x, 2) + Math.pow(point.y - svgP.y, 2));
        if (distance < minDistance && distance < 30) { // 30px tolerance
          minDistance = distance;
          closestPoint = { seriesIndex, pointIndex };
        }
      });
    });
    
    setHoveredPoint(closestPoint);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 focus:outline-none overflow-visible">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
        
         {/* Time period selector */}
         {onPeriodChange && (
           <div className="flex bg-gray-100 rounded-lg p-1">
             <button 
               onClick={() => onPeriodChange('7d')}
               className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                 selectedPeriod === '7d' 
                   ? 'text-gray-700 bg-white shadow-sm' 
                   : 'text-gray-500 hover:text-gray-700'
               }`}
             >
               7D
             </button>
             <button 
               onClick={() => onPeriodChange('30d')}
               className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                 selectedPeriod === '30d' 
                   ? 'text-gray-700 bg-white shadow-sm' 
                   : 'text-gray-500 hover:text-gray-700'
               }`}
             >
               30D
             </button>
             <button 
               onClick={() => onPeriodChange('90d')}
               className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                 selectedPeriod === '90d' 
                   ? 'text-gray-700 bg-white shadow-sm' 
                   : 'text-gray-500 hover:text-gray-700'
               }`}
             >
               90D
             </button>
           </div>
         )}
      </div>

      <div className="relative w-full overflow-visible">
        <svg 
          viewBox={`0 0 ${width} ${height + 40}`} 
          width="100%" 
          height={height + 40} 
          preserveAspectRatio="none" 
          role="img" 
          aria-label={title || 'Line chart'}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="overflow-visible"
        >
          {/* Grid lines and labels */}
          {gridYs.map((t, i) => {
            const value = gridValues[i];
            const yPos = height - 50 - t * (height - 80);
            return (
              <g key={i}>
                <line 
                  x1={40} 
                  x2={width - 20} 
                  y1={yPos} 
                  y2={yPos} 
                  stroke="#f3f4f6" 
                  strokeWidth={1} 
                />
                <text 
                  x={35} 
                  y={yPos + 4} 
                  textAnchor="end" 
                  className="text-xs fill-gray-500 font-medium"
                  style={{ 
                    fontSize: '12px',
                    fontWeight: '500',
                    fill: '#6b7280'
                  }}
                >
                  {value}
                </text>
              </g>
            );
          })}
          
          {/* X-axis */}
          <line 
            x1={40} 
            x2={width - 20} 
            y1={height - 50} 
            y2={height - 50} 
            stroke="#e5e7eb" 
            strokeWidth={1.5} 
          />
          
          {/* X-axis labels */}
          {xAxisLabels && (() => {
            // Calculate optimal number of labels to show based on available width
            const availableWidth = width - 60; // Account for margins
            const minLabelSpacing = 60; // Minimum pixels between labels for readability
            const maxLabels = Math.floor(availableWidth / minLabelSpacing);
            const totalLabels = xAxisLabels.length;
            
            // If we have fewer labels than the maximum, show all
            if (totalLabels <= maxLabels) {
              return (
                <g className="text-xs text-gray-500 font-medium">
                  {xAxisLabels.map((label, i) => {
                    const xPos = 40 + (i / (totalLabels - 1)) * (width - 60);
                    return (
                      <text 
                        key={i} 
                        x={xPos} 
                        y={height - 10} 
                        textAnchor="middle"
                        style={{ 
                          fontSize: '11px',
                          fontWeight: '500',
                          fill: '#6b7280'
                        }}
                      >
                        {label}
                      </text>
                    );
                  })}
                </g>
              );
            }
            
            // Otherwise, show a subset of labels evenly distributed
            const step = Math.ceil(totalLabels / maxLabels);
            const labelsToShow = [];
            for (let i = 0; i < totalLabels; i += step) {
              labelsToShow.push(i);
            }
            // Always include the last label if it's not already included
            if (labelsToShow[labelsToShow.length - 1] !== totalLabels - 1) {
              labelsToShow.push(totalLabels - 1);
            }
            
            return (
              <g className="text-xs text-gray-500 font-medium">
                {labelsToShow.map((index) => {
                  const xPos = 40 + (index / (totalLabels - 1)) * (width - 60);
                  return (
                    <text 
                      key={index} 
                      x={xPos} 
                      y={height - 10} 
                      textAnchor="middle"
                      style={{ 
                        fontSize: '11px',
                        fontWeight: '500',
                        fill: '#6b7280'
                      }}
                    >
                      {xAxisLabels[index]}
                    </text>
                  );
                })}
              </g>
            );
          })()}

          <defs>
            {paths.map((p, idx) => (
              <linearGradient 
                id={`lcg-${idx}`} 
                key={idx} 
                x1="0" 
                y1="0" 
                x2="0" 
                y2="1"
              >
                <stop offset="0%" stopColor={p.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={p.color} stopOpacity={0} />
              </linearGradient>
            ))}
            
            {/* Glow effect for lines */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Areas */}
          {paths.map((p, idx) => (
            <path 
              key={`area-${idx}`}
              d={p.area} 
              fill={`url(#lcg-${idx})`} 
              opacity={hoveredSeries !== null && hoveredSeries !== idx ? 0.4 : 1}
              className="transition-opacity duration-200"
            />
          ))}

          {/* Lines */}
          {paths.map((p, idx) => (
            <g key={`line-${idx}`}>
              <path
                d={p.line}
                fill="none"
                stroke={p.color}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                opacity={hoveredSeries !== null && hoveredSeries !== idx ? 0.4 : 1}
                style={{ 
                  strokeDasharray: 1200, 
                  strokeDashoffset: 1200, 
                  animation: `lc-draw 1200ms ease forwards ${idx * 150}ms` 
                }}
                className="transition-opacity duration-200"
              />
              
              {/* Data points */}
              {p.points.map((point, pointIdx) => (
                <circle
                  key={pointIdx}
                  cx={point.x}
                  cy={point.y}
                  r={4}
                  fill="white"
                  stroke={p.color}
                  strokeWidth={2}
                  opacity={hoveredSeries !== null && hoveredSeries !== idx ? 0.4 : 1}
                  className="transition-opacity duration-200"
                />
              ))}
            </g>
          ))}

          {/* Hover effects */}
          {hoveredPoint && showTooltip && (
            <g>
              {/* Vertical guide line */}
              <line
                x1={points[hoveredPoint.seriesIndex][hoveredPoint.pointIndex].x}
                x2={points[hoveredPoint.seriesIndex][hoveredPoint.pointIndex].x}
                y1={50}
                y2={height - 50}
                stroke="#e5e7eb"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              
              {/* Tooltip circle */}
              <circle
                cx={points[hoveredPoint.seriesIndex][hoveredPoint.pointIndex].x}
                cy={points[hoveredPoint.seriesIndex][hoveredPoint.pointIndex].y}
                r="6"
                fill={series[hoveredPoint.seriesIndex].color}
                className="opacity-80"
              />
              
              {/* Tooltip */}
              <foreignObject
                x={points[hoveredPoint.seriesIndex][hoveredPoint.pointIndex].x - 60}
                y={points[hoveredPoint.seriesIndex][hoveredPoint.pointIndex].y - 80}
                width="120"
                height="70"
              >
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
                  <div className="text-xs font-semibold text-gray-900 mb-1">
                    {series[hoveredPoint.seriesIndex].name}
                  </div>
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: series[hoveredPoint.seriesIndex].color }}
                    ></div>
                    <div className="text-sm font-bold text-gray-800">
                      {series[hoveredPoint.seriesIndex].data[hoveredPoint.pointIndex]}
                    </div>
                  </div>
                  {xAxisLabels && (
                    <div className="text-xs text-gray-500 mt-1">
                      {xAxisLabels[hoveredPoint.pointIndex]}
                    </div>
                  )}
                </div>
              </foreignObject>
            </g>
          )}

          <style>{`
            @keyframes lc-draw { to { stroke-dashoffset: 0; } }
          `}</style>
        </svg>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {series.map((s, idx) => (
            <div 
              key={idx} 
              className="flex items-center cursor-pointer"
              onMouseEnter={() => setHoveredSeries(idx)}
              onMouseLeave={() => setHoveredSeries(null)}
            >
              <div 
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: s.color }}
              ></div>
              <span className="text-sm text-gray-600">{s.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LineChart;