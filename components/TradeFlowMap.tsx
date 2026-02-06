
import React, { useEffect, useState, useRef } from 'react';
import { TradeEvent } from '../types';

interface TradeFlowMapProps {
  events: TradeEvent[];
}

export const TradeFlowMap: React.FC<TradeFlowMapProps> = ({ events }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Simplified country coordinates (normalized 0-100)
  const countryCoords: Record<string, { x: number, y: number }> = {
    "USA": { x: 20, y: 35 },
    "China": { x: 78, y: 40 },
    "Germany": { x: 52, y: 30 },
    "Japan": { x: 88, y: 38 },
    "South Korea": { x: 85, y: 38 },
    "Singapore": { x: 78, y: 65 },
    "Netherlands": { x: 50, y: 28 },
    "United Kingdom": { x: 48, y: 25 },
    "France": { x: 49, y: 32 },
    "UAE": { x: 62, y: 50 },
    "Brazil": { x: 35, y: 75 },
    "India": { x: 72, y: 52 },
    "Australia": { x: 85, y: 80 },
    "Canada": { x: 20, y: 20 },
    "Mexico": { x: 18, y: 45 },
    "Vietnam": { x: 79, y: 55 },
    "Taiwan": { x: 82, y: 45 },
    "Malaysia": { x: 76, y: 61 }
  };

  return (
    <div ref={containerRef} className="w-full h-[400px] relative glass-panel rounded-3xl overflow-hidden bg-[#080b12]">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Simple Grid */}
          {[...Array(10)].map((_, i) => (
            <line key={`v-${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="#334155" strokeWidth="0.1" />
          ))}
          {[...Array(10)].map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="#334155" strokeWidth="0.1" />
          ))}
        </svg>
      </div>

      <svg width="100%" height="100%" className="relative z-10">
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0)" />
            <stop offset="50%" stopColor="rgba(56, 189, 248, 0.5)" />
            <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
          </linearGradient>
        </defs>

        {/* Trade Arcs */}
        {events.slice(-8).map((event) => {
          const origin = countryCoords[event.origin];
          const dest = countryCoords[event.destination];
          if (!origin || !dest) return null;

          const startX = (origin.x / 100) * dimensions.width;
          const startY = (origin.y / 100) * dimensions.height;
          const endX = (dest.x / 100) * dimensions.width;
          const endY = (dest.y / 100) * dimensions.height;

          // Calculate a simple quadratic curve
          const midX = (startX + endX) / 2;
          const midY = Math.min(startY, endY) - 50;

          return (
            <g key={event.id}>
              <path
                d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
                fill="none"
                stroke="url(#flowGradient)"
                strokeWidth="2"
                strokeDasharray="10 5"
                className="animate-[dash_3s_linear_infinite]"
              />
              <circle cx={startX} cy={startY} r="3" fill="#38bdf8" className="animate-pulse" />
              <circle cx={endX} cy={endY} r="3" fill="#fb7185" className="animate-pulse" />
            </g>
          );
        })}
      </svg>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -50;
          }
        }
      `}</style>

      {/* Map Labels (Overlay) */}
      <div className="absolute inset-0 pointer-events-none">
        {Object.entries(countryCoords).map(([name, pos]) => (
          <div 
            key={name}
            className="absolute text-[10px] text-slate-500 font-bold uppercase mono"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {name}
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-4 left-4 flex gap-4 text-[10px] mono uppercase tracking-widest text-slate-400">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-sky-400"></div> Origin</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-400"></div> Destination</div>
      </div>
    </div>
  );
};
