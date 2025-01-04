export const detectAnalysisType = (
  isPatternAnalysis: boolean,
  isWaves: boolean,
  isGann: boolean,
  isTurtleSoup: boolean,
  isICT: boolean,
  isSMC: boolean,
  isAI: boolean,
  isScalping: boolean,
  isPriceAction: boolean = false
): string => {
  if (isPatternAnalysis) return 'Patterns';
  if (isWaves) return 'Waves';
  if (isGann) return 'Gann';
  if (isTurtleSoup) return 'Turtle Soup';
  if (isICT) return 'ICT';
  if (isSMC) return 'SMC';
  if (isAI) return 'ذكي';
  if (isScalping) return 'سكالبينج';
  if (isPriceAction) return 'Price Action';
  return 'عادي';
};