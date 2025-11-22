import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ReactionRecord, Language } from '../types';
import { translations } from '../translations';

interface StatsChartProps {
  history: ReactionRecord[];
  lang: Language;
}

const StatsChart: React.FC<StatsChartProps> = ({ history, lang }) => {
  const t = translations[lang].stats;

  if (history.length < 2) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
        <p>{t.noData}</p>
      </div>
    );
  }

  // Take last 20 attempts for clarity
  const data = history.slice(-20).map((record, index) => ({
    attempt: index + 1,
    ms: record.reactionTime,
  }));

  return (
    <div className="w-full h-64 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
      <h3 className="text-slate-400 text-sm font-semibold mb-4 uppercase tracking-wider">{t.title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="attempt" 
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
            unit="ms"
            domain={['dataMin - 20', 'dataMax + 20']}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            itemStyle={{ color: '#38bdf8' }}
            formatter={(value: number) => [`${value} ms`, t.tooltipTime]}
            labelFormatter={(label) => `${t.tooltipAttempt} #${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="ms" 
            stroke="#38bdf8" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#38bdf8', strokeWidth: 0 }} 
            activeDot={{ r: 6, fill: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;