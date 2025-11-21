import React from 'react';
import { EngineSpecs, CylinderConfig, FuelType, EngineCycle } from '../types';

interface ControlPanelProps {
  specs: EngineSpecs;
  setSpecs: React.Dispatch<React.SetStateAction<EngineSpecs>>;
  onSimulate: () => void;
  isLoading: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ specs, setSpecs, onSimulate, isLoading }) => {
  
  const handleChange = <K extends keyof EngineSpecs>(key: K, value: EngineSpecs[K]) => {
    setSpecs(prev => ({ ...prev, [key]: value }));
  };

  const calculateDisplacement = () => {
    const radius = specs.bore / 20; // cm
    const strokeCm = specs.stroke / 10; // cm
    const volPerCyl = Math.PI * Math.pow(radius, 2) * strokeCm;
    return (volPerCyl * specs.cylinders).toFixed(0);
  };

  return (
    <div className="bg-gray-900 border-r border-gray-800 w-full md:w-80 flex-shrink-0 h-full overflow-y-auto p-6 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-2 h-6 bg-primary-600 rounded-sm"></span>
          Configuration
        </h2>
        <p className="text-gray-400 text-xs mt-1">Define physical parameters</p>
      </div>

      {/* Cylinder Count */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="text-gray-300">Cylinders</label>
          <span className="text-primary-500 font-mono font-bold">{specs.cylinders}</span>
        </div>
        <input
          type="range"
          min="1"
          max="20"
          step="1"
          value={specs.cylinders}
          onChange={(e) => handleChange('cylinders', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
        />
      </div>

      {/* Layout */}
      <div className="space-y-2">
        <label className="text-gray-300 text-sm">Layout</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(CylinderConfig).map((config) => (
            <button
              key={config}
              onClick={() => handleChange('configuration', config)}
              className={`px-3 py-2 text-xs font-medium rounded border transition-colors ${
                specs.configuration === config
                  ? 'bg-primary-600 border-primary-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              {config}
            </button>
          ))}
        </div>
      </div>

      {/* Crank Angle */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="text-gray-300">Crank/Bank Angle</label>
          <span className="text-primary-500 font-mono font-bold">{specs.crankAngle}°</span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          step="1"
          value={specs.crankAngle}
          onChange={(e) => handleChange('crankAngle', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
        />
        <p className="text-xs text-gray-500">Bank angle for V/W or crank phasing.</p>
      </div>

      {/* Bore & Stroke */}
      <div className="space-y-4 p-4 bg-gray-800/50 rounded-xl border border-gray-800">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="text-gray-300">Bore (mm)</label>
            <span className="text-accent-500 font-mono">{specs.bore}</span>
          </div>
          <input
            type="range"
            min="40"
            max="120"
            value={specs.bore}
            onChange={(e) => handleChange('bore', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="text-gray-300">Stroke (mm)</label>
            <span className="text-accent-500 font-mono">{specs.stroke}</span>
          </div>
          <input
            type="range"
            min="40"
            max="130"
            value={specs.stroke}
            onChange={(e) => handleChange('stroke', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
          />
        </div>
        
        <div className="pt-2 border-t border-gray-700 flex justify-between items-center text-xs">
          <span className="text-gray-400">Est. Displacement</span>
          <span className="text-white font-mono">{calculateDisplacement()} cc</span>
        </div>
      </div>

      {/* Fuel & Cycle */}
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-gray-300 text-sm">Fuel System</label>
          <select
            value={specs.fuel}
            onChange={(e) => handleChange('fuel', e.target.value as FuelType)}
            className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
          >
            {Object.values(FuelType).map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-gray-300 text-sm">Cycle</label>
          <div className="flex rounded-md shadow-sm" role="group">
            {Object.values(EngineCycle).map((cycle, idx, arr) => (
              <button
                key={cycle}
                onClick={() => handleChange('cycle', cycle)}
                className={`flex-1 px-4 py-2 text-xs font-medium border ${
                    idx === 0 ? 'rounded-l-lg' : ''
                } ${idx === arr.length - 1 ? 'rounded-r-lg' : ''} ${
                  specs.cycle === cycle
                    ? 'bg-gray-600 text-white border-gray-500'
                    : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
                }`}
              >
                {cycle}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="fi"
            checked={specs.forcedInduction}
            onChange={(e) => handleChange('forcedInduction', e.target.checked)}
            className="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-600 focus:ring-2"
          />
          <label htmlFor="fi" className="text-sm font-medium text-gray-300">Forced Induction (Turbo/Super)</label>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={onSimulate}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-bold text-sm uppercase tracking-wider shadow-lg transition-all transform ${
            isLoading
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white hover:shadow-primary-500/25 active:scale-95'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Simulating...
            </span>
          ) : 'Build & Test Engine'}
        </button>
      </div>
    </div>
  );
};