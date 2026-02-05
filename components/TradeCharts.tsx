
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TradeEvent } from '../types';

interface TradeChartsProps {
  events: TradeEvent[];
}

export const TradeCharts: React.FC<TradeChartsProps> = ({ events }) => {
  // Aggregate data for AreaChart (simulated timeline)
  const timeData = events.slice(-20).map((e, idx) => ({
    time: idx,
    value: e.value / 1e6
  }));

  // Aggregate data for BarChart (Commodity mix)
  const commodityCounts: Record<string, number> = {};
  events.forEach(e => {
    commodityCounts[e.commodity] = (commodityCounts[e.commodity] || 0) + e.value;
  });

  const commodityData = Object.entries(commodityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, val]) => ({ name, value: val / 1e6 }));

  const COLORS = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#fb7185'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-panel p-6 rounded-3xl h-[350px]">
        <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
          <i className="fas fa-chart-line text-sky-400"></i>
          Trade Volume Momentum (USD Millions)
        </h3>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={timeData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
              itemStyle={{ color: '#38bdf8' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#38bdf8" 
              fillOpacity={1} 
              fill="url(#colorValue)" 
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-panel p-6 rounded-3xl h-[350px]">
        <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
          <i className="fas fa-cubes text-purple-400"></i>
          Top Commodities (USD Millions)
        </h3>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={commodityData} layout="vertical">
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              stroke="#cbd5e1" 
              fontSize={10} 
              width={100} 
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
               cursor={{ fill: 'transparent' }}
               contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {commodityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
