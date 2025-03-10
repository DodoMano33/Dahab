
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
  if (isSMC) return "تحليل SMC";
  if (isICT) return "تحليل ICT";
  if (isTurtleSoup) return "Turtle Soup";
  if (isGann) return "تحليل جان";
  if (isWaves) return "تحليل الموجات";
  if (isPatternAnalysis) return "تحليل الأنماط";
  if (isPriceAction) return "حركة السعر";
  if (isNeuralNetwork) return "شبكات عصبية";
  return "عادي";
};
