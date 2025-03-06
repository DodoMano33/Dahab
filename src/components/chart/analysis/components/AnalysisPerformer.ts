
import { AnalysisType } from "@/types/analysis";
import { mapAnalysisTypeToConfig } from "../utils/analysisTypeMapper";

// Use the mapAnalysisTypeToConfig function to get the analysis type configuration
// and ensure we're passing the correct types to handlers
export const getAnalysisConfig = (analysisType: AnalysisType) => {
  // First, map the analysis type to a valid configuration including flags
  const config = mapAnalysisTypeToConfig(analysisType);
  
  // Return the values needed for analysis
  return {
    isScalping: config.isScalping || false,
    isSMC: config.isSMC || false, 
    isICT: config.isICT || false,
    isTurtleSoup: config.isTurtleSoup || false,
    isGann: config.isGann || false,
    isWaves: config.isWaves || false,
    isPatternAnalysis: config.isPatternAnalysis || false,
    isPriceAction: config.isPriceAction || false,
    isNeuralNetwork: config.isNeuralNetwork || false,
    isRNN: config.isRNN || false,
    isTimeClustering: config.isTimeClustering || false,
    isMultiVariance: config.isMultiVariance || false,
    isCompositeCandlestick: config.isCompositeCandlestick || false,
    isBehavioral: config.isBehavioral || false,
    isFibonacci: config.isFibonacci || false,
    isFibonacciAdvanced: config.isFibonacciAdvanced || false,
    displayName: config.name
  };
};
