
import { AnalysisType } from "@/types/analysis";

export const getAnalysisType = (
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
