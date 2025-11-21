export enum CylinderConfig {
  INLINE = 'Inline',
  V = 'V',
  W = 'W',
  BOXER = 'Boxer/Flat'
}

export enum FuelType {
  PETROL = 'Petrol (Gasoline)',
  DIESEL = 'Diesel',
  ETHANOL = 'Ethanol (E85)',
  HYBRID_PETROL = 'Petrol Hybrid',
  HYBRID_DIESEL = 'Diesel Hybrid'
}

export enum EngineCycle {
  TWO_STROKE = '2-Stroke',
  FOUR_STROKE = '4-Stroke'
}

export interface EngineSpecs {
  bore: number; // mm
  stroke: number; // mm
  cylinders: number; // count
  configuration: CylinderConfig;
  cycle: EngineCycle;
  fuel: FuelType;
  forcedInduction: boolean;
  crankAngle: number; // degrees
}

export interface DynoPoint {
  rpm: number;
  hp: number;
  torque: number;
}

export interface SimulationResult {
  engineName: string;
  description: string;
  soundSignature: string;
  redline: number;
  peakHP: number;
  peakHP_RPM: number;
  peakTorque: number;
  peakTorque_RPM: number;
  displacementCC: number;
  compressionRatio: number;
  thermalEfficiency: number; // percentage
  dynoData: DynoPoint[];
}