
import { AnalysisType } from "@/types/analysis";
import { detectAnalysisType } from "./analysisTypeDetector";

/**
 * Builds a configuration object for analysis types
 */
export const buildAnalysisConfig = (
  isScalping: boolean,
  isAI: boolean,
  isSMC: boolean,
  isICT: boolean,
  isTurtleSoup: boolean,
  isGann: boolean,
  isWaves: boolean,
  isPatternAnalysis: boolean,
  isPriceAction: boolean,
  isNeuralNetwork: boolean
) => {
  const selectedTypes: string[] = [];
  
  if (isScalping) selectedTypes.push("scalping");
  if (isSMC) selectedTypes.push("smc");
  if (isICT) selectedTypes.push("ict");
  if (isTurtleSoup) selectedTypes.push("turtleSoup");
  if (isGann) selectedTypes.push("gann");
  if (isWaves) selectedTypes.push("waves");
  if (isPatternAnalysis) selectedTypes.push("patterns");
  if (isPriceAction) selectedTypes.push("priceAction");
  if (isNeuralNetwork) selectedTypes.push("neuralNetworks");
  
  const analysisType: AnalysisType = isAI ? "ذكي" : detectAnalysisType(
    isPatternAnalysis,
    isWaves,
    isGann,
    isTurtleSoup,
    isICT,
    isSMC,
    isAI,
    isScalping,
    isPriceAction,
    isNeuralNetwork
  );

  return { 
    selectedTypes, 
    analysisType,
    options: {
      isPatternAnalysis,
      isWaves,
      isGann,
      isTurtleSoup,
      isICT,
      isSMC,
      isScalping,
      isPriceAction,
      isNeuralNetwork
    }
  };
};

export const detectAnalysisType = (
  isPatternAnalysis: boolean,
  isWaves: boolean,
  isGann: boolean,
  isTurtleSoup: boolean,
  isICT: boolean,
  isSMC: boolean,
  isAI: boolean,
  isScalping: boolean,
  isPriceAction: boolean,
  isNeuralNetwork: boolean
): AnalysisType => {
  if (isAI) return "ذكي";
  if (isScalping) return "سكالبينج";
  if (isSMC) return "SMC";
  if (isICT) return "ICT";
  if (isTurtleSoup) return "Turtle Soup";
  if (isGann) return "Gann";
  if (isWaves) return "Waves";
  if (isPatternAnalysis) return "Patterns";
  if (isPriceAction) return "Price Action";
  if (isNeuralNetwork) return "شبكات عصبية";
  return "عادي";
};
