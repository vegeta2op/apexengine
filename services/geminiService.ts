import { GoogleGenAI, Type } from "@google/genai";
import { EngineSpecs, SimulationResult, CylinderConfig, FuelType, EngineCycle } from "../types";

// Initialize the API client
// API_KEY is expected to be available in process.env from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const simulateEnginePerformance = async (specs: EngineSpecs): Promise<SimulationResult> => {
  const modelId = 'gemini-2.5-flash';

  const prompt = `
    Act as a world-class automotive engineer and physics engine.
    
    Simulate an internal combustion engine with the following parameters:
    - Configuration: ${specs.cylinders} cylinders, ${specs.configuration} layout
    - Crank/Bank Angle: ${specs.crankAngle} degrees
    - Cycle: ${specs.cycle}
    - Fuel: ${specs.fuel}
    - Bore: ${specs.bore} mm
    - Stroke: ${specs.stroke} mm
    - Turbo/Supercharger: ${specs.forcedInduction ? 'Yes' : 'No'}

    Calculate the displacement based on bore/stroke/cylinders.
    Estimate realistic Horsepower (HP) and Torque (Nm) curves based on the physics of the bore/stroke ratio (undersquare vs oversquare), fuel type, and cycle.
    
    Consider the Crank/Bank Angle in your simulation of the engine character and sound. For example, a 90-degree V8 (cross-plane) sounds different and delivers torque differently than a 180-degree V8 (flat-plane).
    
    If it is a Hybrid, add electric motor torque assist at low RPMs.
    If it is 2-stroke, account for higher power density but narrower power band (unless modern direct injection).
    If Diesel, lower redline and higher torque.
    
    Generate a JSON response with the detailed specs and a dyno chart (RPM vs HP/Torque).
    The dyno chart should have at least 15 data points from idle to redline.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            engineName: { type: Type.STRING, description: "A creative marketing name for this engine code" },
            description: { type: Type.STRING, description: "A technical summary of the engine's character and application" },
            soundSignature: { type: Type.STRING, description: "A description of how the engine sounds (e.g., deep rumble, high-pitched scream) considering the crank angle" },
            redline: { type: Type.NUMBER, description: "Maximum RPM limit" },
            peakHP: { type: Type.NUMBER },
            peakHP_RPM: { type: Type.NUMBER },
            peakTorque: { type: Type.NUMBER },
            peakTorque_RPM: { type: Type.NUMBER },
            displacementCC: { type: Type.NUMBER, description: "Total displacement in cubic centimeters" },
            compressionRatio: { type: Type.NUMBER },
            thermalEfficiency: { type: Type.NUMBER, description: "Estimated thermal efficiency percentage" },
            dynoData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  rpm: { type: Type.NUMBER },
                  hp: { type: Type.NUMBER },
                  torque: { type: Type.NUMBER, description: "Torque in Nm" }
                },
                required: ["rpm", "hp", "torque"]
              }
            }
          },
          required: ["engineName", "redline", "dynoData", "peakHP", "peakTorque", "displacementCC"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as SimulationResult;

  } catch (error) {
    console.error("Simulation failed:", error);
    throw error;
  }
};