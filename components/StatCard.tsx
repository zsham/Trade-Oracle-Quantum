
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: string;
  colorClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, icon, colorClass }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl flex items-center gap-5 transition-transform hover:scale-[1.02] cursor-default">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colorClass} bg-opacity-10 text-xl`}>
        <i className={`${icon} ${colorClass.replace('bg-', 'text-')}`}></i>
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-bold mt-1 text-white mono">{value}</h3>
        {subValue && <p className="text-xs text-emerald-400 mt-1">{subValue}</p>}
      </div>
    </div>
  );
};
