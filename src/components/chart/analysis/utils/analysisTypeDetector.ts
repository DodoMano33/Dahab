export const detectAnalysisType = (
  isPatternAnalysis: boolean,
  isWaves: boolean,
  isGann: boolean,
  isTurtleSoup: boolean,
  isICT: boolean,
  isSMC: boolean,
  isAI: boolean,
  isScalping: boolean,
  isPriceAction: boolean
): string | null => {
  // التحقق من وجود نوع تحليل محدد على الأقل
  const hasAnalysisType = 
    isPatternAnalysis ||
    isWaves ||
    isGann ||
    isTurtleSoup ||
    isICT ||
    isSMC ||
    isScalping ||
    isPriceAction ||
    isAI;

  if (!hasAnalysisType) {
    return null;
  }

  if (isAI) return "ذكي";
  if (isScalping) return "سكالبينج";
  if (isSMC) return "SMC";
  if (isICT) return "ICT";
  if (isTurtleSoup) return "Turtle Soup";
  if (isGann) return "Gann";
  if (isWaves) return "Waves";
  if (isPatternAnalysis) return "Patterns";
  if (isPriceAction) return "Price Action";
  
  return null;
};