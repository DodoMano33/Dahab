export type AnalysisType = "عادي" | "سكالبينج" | "ذكي" | "SMC" | "ICT" | "Turtle Soup" | "Gann" | "Waves" | "Patterns" | "Smart" | "Price Action";

export const getAnalysisType = (
  isPatternAnalysis: boolean,
  isWaves: boolean,
  isGann: boolean,
  isTurtleSoup: boolean,
  isICT: boolean,
  isSMC: boolean,
  isAI: boolean,
  isScalping: boolean,
  isPriceAction: boolean
): AnalysisType => {
  if (isPatternAnalysis) return "Patterns";
  if (isWaves) return "Waves";
  if (isGann) return "Gann";
  if (isTurtleSoup) return "Turtle Soup";
  if (isICT) return "ICT";
  if (isSMC) return "SMC";
  if (isAI) return "Smart";
  if (isScalping) return "سكالبينج";
  if (isPriceAction) return "Price Action";
  return "عادي";
};