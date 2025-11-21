import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { SimulationResult } from '../types';

interface ResultsDashboardProps {
  result: SimulationResult | null;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 min-h-[50vh]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        <p>Configure engine parameters and run simulation to view data.</p>
      </div>
    );
  }

  // Calculate domains for nicer charts
  const maxHp = Math.max(...result.dynoData.map(d => d.hp));
  const maxTq = Math.max(...result.dynoData.map(d => d.torque));
  
  return (
    <div className="flex-1 p-6 md:p-10 overflow-y-auto">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
            <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">
            {result.engineName}
            </h1>
            <div className="flex gap-4 text-sm font-mono">
                <div className="bg-gray-800 px-3 py-1 rounded text-primary-400 border border-primary-900/50">
                    EFFICIENCY: {result.thermalEfficiency}%
                </div>
                <div className="bg-gray-800 px-3 py-1 rounded text-accent-400 border border-accent-900/50">
                    REDLINE: {result.redline} RPM
                </div>
            </div>
        </div>
        <p className="text-gray-400 max-w-3xl leading-relaxed">{result.description}</p>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800/40 border border-gray-700 p-4 rounded-xl">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Peak Power</p>
          <p className="text-2xl md:text-3xl font-bold text-white">{result.peakHP} <span className="text-sm font-normal text-gray-400">HP</span></p>
          <p className="text-xs text-gray-500 mt-1">@ {result.peakHP_RPM} RPM</p>
        </div>
        <div className="bg-gray-800/40 border border-gray-700 p-4 rounded-xl">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Peak Torque</p>
          <p className="text-2xl md:text-3xl font-bold text-white">{result.peakTorque} <span className="text-sm font-normal text-gray-400">Nm</span></p>
          <p className="text-xs text-gray-500 mt-1">@ {result.peakTorque_RPM} RPM</p>
        </div>
        <div className="bg-gray-800/40 border border-gray-700 p-4 rounded-xl">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Displacement</p>
          <p className="text-2xl md:text-3xl font-bold text-white">{(result.displacementCC / 1000).toFixed(1)} <span className="text-sm font-normal text-gray-400">L</span></p>
          <p className="text-xs text-gray-500 mt-1">{result.displacementCC} cc</p>
        </div>
        <div className="bg-gray-800/40 border border-gray-700 p-4 rounded-xl">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Compression</p>
          <p className="text-2xl md:text-3xl font-bold text-white">{result.compressionRatio}:1</p>
          <p className="text-xs text-gray-500 mt-1">Ratio</p>
        </div>
      </div>

      {/* Dyno Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 shadow-xl shadow-black/50">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                Dyno Graph
            </h3>
            <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1 text-gray-300"><span className="w-3 h-3 rounded-full bg-pink-500"></span> Horsepower</span>
                <span className="flex items-center gap-1 text-gray-300"><span className="w-3 h-3 rounded-full bg-cyan-400"></span> Torque (Nm)</span>
            </div>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.dynoData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis 
                dataKey="rpm" 
                stroke="#9ca3af" 
                tick={{fill: '#9ca3af', fontSize: 12}}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="left" 
                stroke="#ec4899" 
                tick={{fill: '#ec4899', fontSize: 12}}
                tickLine={false}
                axisLine={false}
                domain={[0, maxHp * 1.1]}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#22d3ee" 
                tick={{fill: '#22d3ee', fontSize: 12}}
                tickLine={false}
                axisLine={false}
                domain={[0, maxTq * 1.1]}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="hp" 
                stroke="#ec4899" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorHp)" 
                name="Horsepower"
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="torque" 
                stroke="#22d3ee" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTq)" 
                name="Torque (Nm)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Audio Profile */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <h3 className="text-sm font-bold uppercase text-gray-400 mb-2">Acoustic Profile</h3>
        <p className="text-lg italic text-white">"{result.soundSignature}"</p>
      </div>
    </div>
  );
};
