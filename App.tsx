import React, { useState } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { ResultsDashboard } from './components/ResultsDashboard';
import { EngineSpecs, CylinderConfig, FuelType, EngineCycle, SimulationResult } from './types';
import { simulateEnginePerformance } from './services/geminiService';

const App: React.FC = () => {
  const [specs, setSpecs] = useState<EngineSpecs>({
    bore: 86,
    stroke: 86,
    cylinders: 4,
    configuration: CylinderConfig.INLINE,
    cycle: EngineCycle.FOUR_STROKE,
    fuel: FuelType.PETROL,
    forcedInduction: false,
    crankAngle: 90
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await simulateEnginePerformance(specs);
      setResult(data);
    } catch (err: any) {
      setError("Simulation Engine Failure. Please check network or try different parameters.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden">
      {/* Top Bar */}
      <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-6 flex-shrink-0 justify-between z-10">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-primary-600 to-indigo-500 rounded flex items-center justify-center text-white font-black">A</div>
            <span className="font-bold tracking-wide text-lg">Apex<span className="text-primary-500">Engine</span> Sim</span>
        </div>
        <div className="text-xs text-gray-500 font-mono">
            POWERED BY GEMINI 2.5
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row relative">
        {/* Controls */}
        <ControlPanel 
            specs={specs} 
            setSpecs={setSpecs} 
            onSimulate={handleSimulate} 
            isLoading={isLoading}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-grid-pattern">
            {error && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500/10 border border-red-500 text-red-200 px-6 py-3 rounded-lg shadow-lg z-50 backdrop-blur-md">
                    {error}
                </div>
            )}
            <ResultsDashboard result={result} />
        </div>
      </div>
    </div>
  );
};

export default App;