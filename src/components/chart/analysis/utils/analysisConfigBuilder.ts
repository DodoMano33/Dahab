
import { AnalysisType } from "@/types/analysis";

/**
 * Detects the analysis type based on selected options
 */
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
  isNeuralNetwork: boolean,
  isRNN: boolean = false,
  isTimeClustering: boolean = false,
  isMultiVariance: boolean = false,
  isCompositeCandlestick: boolean = false,
  isBehavioral: boolean = false,
  isFibonacci: boolean = false,
  isFibonacciAdvanced: boolean = false
): AnalysisType => {
  if (isAI) return "Smart";
  if (isScalping) return "Scalping";
  if (isSMC) return "SMC";
  if (isICT) return "ICT";
  if (isTurtleSoup) return "Turtle Soup";
  if (isGann) return "Gann";
  if (isWaves) return "Waves";
  if (isPatternAnalysis) return "Patterns";
  if (isPriceAction) return "Price Action";
  if (isFibonacci) return "Fibonacci";
  if (isFibonacciAdvanced) return "Fibonacci Advanced";
  if (isNeuralNetwork) return "Neural Networks";
  if (isRNN) return "RNN";
  if (isTimeClustering) return "Time Clustering";
  if (isMultiVariance) return "Multi Variance";
  if (isCompositeCandlestick) return "Composite Candlestick";
  if (isBehavioral) return "Behavioral Analysis";
  return "Normal";
};

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
  isNeuralNetwork: boolean,
  isRNN: boolean = false,
  isTimeClustering: boolean = false,
  isMultiVariance: boolean = false,
  isCompositeCandlestick: boolean = false,
  isBehavioral: boolean = false,
  isFibonacci: boolean = false,
  isFibonacciAdvanced: boolean = false
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
  if (isRNN) selectedTypes.push("rnn");
  if (isTimeClustering) selectedTypes.push("timeClustering");
  if (isMultiVariance) selectedTypes.push("multiVariance");
  if (isCompositeCandlestick) selectedTypes.push("compositeCandlestick");
  if (isBehavioral) selectedTypes.push("behavioral");
  if (isFibonacci) selectedTypes.push("fibonacci");
  if (isFibonacciAdvanced) selectedTypes.push("fibonacciAdvanced");
  
  const analysisType: AnalysisType = detectAnalysisType(
    isPatternAnalysis,
    isWaves,
    isGann,
    isTurtleSoup,
    isICT,
    isSMC,
    isAI,
    isScalping,
    isPriceAction,
    isNeuralNetwork,
    isRNN,
    isTimeClustering,
    isMultiVariance,
    isCompositeCandlestick,
    isBehavioral,
    isFibonacci,
    isFibonacciAdvanced
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
      isNeuralNetwork,
      isRNN,
      isTimeClustering,
      isMultiVariance,
      isCompositeCandlestick,
      isBehavioral,
      isFibonacci,
      isFibonacciAdvanced
    }
  };
};
