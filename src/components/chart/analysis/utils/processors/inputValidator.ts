
export interface AnalysisInput {
  symbol: string;
  timeframe: string;
  providedPrice: number;
  analysisType: string;
  selectedTypes?: string[];
  isAI?: boolean;
  isSMC?: boolean;
  isICT?: boolean;
  isTurtleSoup?: boolean;
  isGann?: boolean;
  isWaves?: boolean;
  isPatternAnalysis?: boolean;
  isPriceAction?: boolean;
  isNeuralNetwork?: boolean;
  isRNN?: boolean;
  isTimeClustering?: boolean;
  isMultiVariance?: boolean;
  isCompositeCandlestick?: boolean;
  isBehavioral?: boolean;
  isFibonacci?: boolean;
  isFibonacciAdvanced?: boolean;
  duration?: string;
  chartImage?: string;
}

/**
 * Validates the input parameters for chart analysis
 */
export const validateAnalysisInput = (input: AnalysisInput): boolean => {
  const { symbol, timeframe, providedPrice } = input;
  
  if (!symbol || symbol.trim() === '') {
    console.error("Symbol is required");
    return false;
  }
  
  if (!timeframe || timeframe.trim() === '') {
    console.error("Timeframe is required");
    return false;
  }
  
  if (!providedPrice || isNaN(providedPrice) || providedPrice <= 0) {
    console.error("Valid price is required");
    return false;
  }
  
  return true;
};
