
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TradeEvent, AICounsel } from './types';
import { COUNTRIES, COMMODITIES } from './constants';
import { StatCard } from './components/StatCard';
import { TradeFlowMap } from './components/TradeFlowMap';
import { TradeCharts } from './components/TradeCharts';
import { TradeSignals } from './components/TradeSignals';
import { getTradeInsights } from './services/geminiService';

const App: React.FC = () => {
  const [events, setEvents] = useState<TradeEvent[]>([]);
  const [counsel, setCounsel] = useState<AICounsel | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [totalVolume, setTotalVolume] = useState(1450200000);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulation: Generate a new trade event every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const origin = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      let destination = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      while (destination === origin) {
        destination = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      }

      const newEvent: TradeEvent = {
        id: Math.random().toString(36).substr(2, 9),
        origin,
        destination,
        commodity: COMMODITIES[Math.floor(Math.random() * COMMODITIES.length)],
        value: Math.floor(Math.random() * 50000000) + 10000000,
        timestamp: Date.now(),
        type: Math.random() > 0.5 ? 'Export' : 'Import'
      };

      setEvents(prev => [...prev.slice(-49), newEvent]);
      setTotalVolume(prev => prev + newEvent.value);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = async () => {
    if (events.length === 0) return;
    setIsAnalyzing(true);
    const result = await getTradeInsights(events);
    setCounsel(result);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    // Auto-analyze once at the start after some data is collected
    if (events.length >= 5 && !counsel && !isAnalyzing) {
      handleAnalyze();
    }
  }, [events, counsel, isAnalyzing]);

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-8 flex flex-col gap-8 pb-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-600 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">
            <i className="fas fa-tower-broadcast text-white"></i>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">Trade <span className="text-emerald-400">Oracle</span></h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[10px] mono text-slate-400 uppercase tracking-[0.2em]">Signal Engine Online</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all flex items-center gap-2 border border-white/10 active:scale-95 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <i className="fas fa-circle-notch animate-spin"></i>
            ) : (
              <i className="fas fa-bolt text-emerald-400"></i>
            )}
            {isAnalyzing ? 'Scanning Markets...' : 'Identify Best Trades'}
          </button>
        </div>
      </header>

      {/* Hero Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Simulated Volatility" 
          value="Medium" 
          subValue="VIX Equivalent: 14.5"
          icon="fas fa-wave-square" 
          colorClass="bg-sky-500"
        />
        <StatCard 
          label="AI Alpha Score" 
          value="9.2/10" 
          subValue="High confidence signals"
          icon="fas fa-microchip" 
          colorClass="bg-emerald-500"
        />
        <StatCard 
          label="Market Openings" 
          value={counsel?.opportunities.length || 0} 
          subValue="Active corridors identified"
          icon="fas fa-door-open" 
          colorClass="bg-amber-500"
        />
        <StatCard 
          label="Trade Efficiency" 
          value="98.4%" 
          subValue="Route optimization active"
          icon="fas fa-tachometer-alt" 
          colorClass="bg-indigo-500"
        />
      </section>

      {/* Trade Signals Section */}
      {counsel && counsel.opportunities.length > 0 && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <TradeSignals opportunities={counsel.opportunities} />
        </section>
      )}

      {/* Main Grid */}
      <main className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Map & Charts */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          <TradeFlowMap events={events} />
          <TradeCharts events={events} />
        </div>

        {/* Right Column: AI Insights & Live Feed */}
        <div className="flex flex-col gap-8">
          
          {/* AI Panel */}
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/10 flex flex-col gap-5 h-fit">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <i className="fas fa-brain text-emerald-400"></i>
                AI Market Summary
              </h3>
              <span className="text-[10px] mono bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">GEMINI V3</span>
            </div>
            
            {counsel ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                  <p className="text-sm text-slate-300 leading-relaxed italic">"{counsel.summary}"</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Sentiment</p>
                    <p className="text-sm font-bold text-emerald-400">{counsel.marketSentiment}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Top Sector</p>
                    <p className="text-sm font-bold text-sky-400">Technology</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Operational Risks</p>
                  <ul className="space-y-2">
                    {counsel.risks.map((risk, i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-center gap-2">
                        <i className="fas fa-triangle-exclamation text-rose-500 text-[8px]"></i>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-sm text-slate-500">Processing market intelligence...</p>
              </div>
            )}
          </div>

          {/* Live Feed */}
          <div className="glass-panel flex-1 rounded-3xl overflow-hidden flex flex-col min-h-[400px]">
            <div className="p-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <h3 className="text-md font-bold text-white uppercase tracking-tighter">Live Trading Feed</h3>
              <span className="text-[10px] font-bold text-emerald-500 px-2 py-0.5 border border-emerald-500/10 rounded-full animate-pulse">STREAMING</span>
            </div>
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 mono text-[11px]"
            >
              {events.slice().reverse().map((event) => (
                <div key={event.id} className="p-3 bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-colors group">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-bold ${event.type === 'Export' ? 'text-sky-400' : 'text-purple-400'}`}>
                      [{event.type.toUpperCase()}]
                    </span>
                    <span className="text-slate-600">{new Date(event.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-slate-300">
                    <span className="text-white font-bold">{event.origin}</span>
                    <i className="fas fa-arrow-right mx-2 text-slate-600"></i>
                    <span className="text-white font-bold">{event.destination}</span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-slate-400">{event.commodity}</span>
                    <span className="text-emerald-400 font-bold">${(event.value / 1e6).toFixed(2)}M</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="text-center text-slate-600 text-[10px] uppercase tracking-[0.4em] mt-auto">
        Trade Oracle Quantum &copy; 2025 • Verified by Pablo
      </footer>
    </div>
  );
};

export default App;
