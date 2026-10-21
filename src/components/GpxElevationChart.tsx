import React from 'react';
import { ProfilePoint } from '../types/app';

interface GpxElevationChartProps {
  points: ProfilePoint[];
  maxAltitudeM: number;
  minAltitudeM: number;
  distanceKm: number;
  highlightAltitudeM?: number;
}

export const GpxElevationChart: React.FC<GpxElevationChartProps> = ({
  points,
  maxAltitudeM,
  minAltitudeM,
  distanceKm,
  highlightAltitudeM
}) => {
  if (!points || points.length < 2) {
    return (
      <div className="h-32 flex items-center justify-center text-xs text-slate-500 bg-slate-950/60 rounded-xl border border-slate-800">
        Keine Profildaten vorhanden
      </div>
    );
  }

  const width = 600;
  const height = 150;
  const paddingX = 40;
  const paddingY = 25;

  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;

  // Scale functions
  const altRange = Math.max(100, maxAltitudeM - minAltitudeM);
  const getX = (dist: number) => paddingX + (dist / Math.max(1, distanceKm)) * innerWidth;
  const getY = (alt: number) => height - paddingY - ((alt - minAltitudeM) / altRange) * innerHeight;

  // Build SVG path
  const pathD = points.map((p, idx) => {
    const x = getX(p.distKm);
    const y = getY(p.altitudeM);
    return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  // Fill area under path
  const firstX = getX(points[0].distKm);
  const lastX = getX(points[points.length - 1].distKm);
  const bottomY = height - paddingY;
  const areaD = `${pathD} L ${lastX.toFixed(1)} ${bottomY} L ${firstX.toFixed(1)} ${bottomY} Z`;

  // Find peak point
  const peakPoint = points.reduce((max, p) => p.altitudeM > max.altitudeM ? p : max, points[0]);
  const peakX = getX(peakPoint.distKm);
  const peakY = getY(peakPoint.altitudeM);

  return (
    <div className="w-full bg-slate-950/80 rounded-xl border border-slate-800 p-3 shadow-inner">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-1 px-1">
        <span className="font-medium text-slate-300">GPX Höhenprofil</span>
        <span className="font-mono text-emerald-400">Max. {maxAltitudeM} m ü. M.</span>
      </div>

      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-32 overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line 
          x1={paddingX} 
          y1={paddingY} 
          x2={width - paddingX} 
          y2={paddingY} 
          stroke="#334155" 
          strokeDasharray="3 3" 
          strokeWidth="0.8" 
        />
        <line 
          x1={paddingX} 
          y1={bottomY} 
          x2={width - paddingX} 
          y2={bottomY} 
          stroke="#475569" 
          strokeWidth="1" 
        />

        {/* Area fill */}
        <path d={areaD} fill="url(#elevationGrad)" />

        {/* Stroke line */}
        <path 
          d={pathD} 
          fill="none" 
          stroke="#10b981" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Peak indicator dot & label */}
        <circle cx={peakX} cy={peakY} r="4" fill="#34d399" stroke="#0f172a" strokeWidth="2" />
        <text 
          x={peakX} 
          y={Math.max(12, peakY - 8)} 
          textAnchor="middle" 
          fill="#34d399" 
          fontSize="10" 
          fontWeight="bold"
          fontFamily="monospace"
        >
          {peakPoint.altitudeM}m
        </text>

        {/* Min elevation text */}
        <text 
          x={paddingX} 
          y={bottomY + 14} 
          textAnchor="start" 
          fill="#64748b" 
          fontSize="9" 
          fontFamily="monospace"
        >
          {minAltitudeM}m (Start)
        </text>

        {/* Total distance text */}
        <text 
          x={width - paddingX} 
          y={bottomY + 14} 
          textAnchor="end" 
          fill="#64748b" 
          fontSize="9" 
          fontFamily="monospace"
        >
          {distanceKm} km
        </text>
      </svg>
    </div>
  );
};
