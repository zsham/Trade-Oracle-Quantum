
import React from 'react';
import { TradeOpportunity } from '../types';

interface TradeSignalsProps {
  opportunities: TradeOpportunity[];
}

const getStrategyIcon = (type: string) => {
  switch (type) {
    case 'Arbitrage': return 'fa-scale-balanced';
    case 'Momentum': return 'fa-bolt-lightning';
    case 'Supply Chain': return 'fa-link';
    case 'Swing Trade': return 'fa-arrows-left-right';
    case 'Macro Trend': return 'fa-earth-americas';
    default: return 'fa-chart-simple';
  }
};

export const TradeSignals: React.FC<TradeSignalsProps> = ({ opportunities }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live Market Opportunities
        </h3>
        <span className="text-[10px] mono text-slate-500">REFRESHING...</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {opportunities.map((opp, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl border-l-4 border-l-emerald-500 hover:bg-white/5 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col gap-2">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded w-fit ${
                  opp.action === 'STRONG BUY' ? 'bg-emerald-500/20 text-emerald-400' : 
                  opp.action === 'ACCUMULATE' ? 'bg-sky-500/20 text-sky-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {opp.action}
                </span>
                <span className="text-[9px] text-slate-500 font-bold flex items-center gap-1 uppercase">
                  <i className={`fas ${getStrategyIcon(opp.strategyType)}`}></i>
                  {opp.strategyType}
                </span>
              </div>
              <span className="text-white font-bold mono text-xs">{opp.targetYield}</span>
            </div>
            
            <h4 className="text-white font-bold text-sm mb-1">{opp.pair}</h4>
            <p className="text-slate-400 text-xs mb-3">{opp.commodity}</p>
            
            <div className="space-y-2">
              <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 italic">"{opp.rationale}"</p>
              <div className="pt-2 flex items-center gap-3">
                <div className="flex-1 bg-white/10 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-1000" 
                    style={{ width: `${opp.confidence}%` }}
                  ></div>
                </div>
                <span className="text-[10px] mono text-emerald-400">{opp.confidence}% CONF.</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
