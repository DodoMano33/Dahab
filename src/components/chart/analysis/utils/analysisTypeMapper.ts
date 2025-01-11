export const mapAnalysisTypeToConfig = (analysisType: string) => {
  const typeMapping: Record<string, {
    isScalping: boolean;
    isSMC: boolean;
    isICT: boolean;
    isTurtleSoup: boolean;
    isGann: boolean;
    isWaves: boolean;
    isPatternAnalysis: boolean;
    isPriceAction: boolean;
  }> = {
    'scalping': { isScalping: true, isSMC: false, isICT: false, isTurtleSoup: false, isGann: false, isWaves: false, isPatternAnalysis: false, isPriceAction: false },
    'smc': { isScalping: false, isSMC: true, isICT: false, isTurtleSoup: false, isGann: false, isWaves: false, isPatternAnalysis: false, isPriceAction: false },
    'ict': { isScalping: false, isSMC: false, isICT: true, isTurtleSoup: false, isGann: false, isWaves: false, isPatternAnalysis: false, isPriceAction: false },
    'turtle_soup': { isScalping: false, isSMC: false, isICT: false, isTurtleSoup: true, isGann: false, isWaves: false, isPatternAnalysis: false, isPriceAction: false },
    'gann': { isScalping: false, isSMC: false, isICT: false, isTurtleSoup: false, isGann: true, isWaves: false, isPatternAnalysis: false, isPriceAction: false },
    'waves': { isScalping: false, isSMC: false, isICT: false, isTurtleSoup: false, isGann: false, isWaves: true, isPatternAnalysis: false, isPriceAction: false },
    'patterns': { isScalping: false, isSMC: false, isICT: false, isTurtleSoup: false, isGann: false, isWaves: false, isPatternAnalysis: true, isPriceAction: false },
    'price_action': { isScalping: false, isSMC: false, isICT: false, isTurtleSoup: false, isGann: false, isWaves: false, isPatternAnalysis: false, isPriceAction: true }
  };

  return typeMapping[analysisType] || typeMapping['patterns'];
};

export const mapToAnalysisType = (analysisType: string) => {
  const mapping: Record<string, string> = {
    'scalping': 'سكالبينج',
    'price_action': 'Price Action',
    'turtle_soup': 'Turtle Soup',
    'smc': 'SMC',
    'ict': 'ICT',
    'gann': 'Gann',
    'waves': 'Waves',
    'patterns': 'Patterns'
  };
  
  return mapping[analysisType] || 'Patterns';
};