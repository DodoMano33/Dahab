
import { AnalysisType } from "@/types/analysis";

/**
 * Detects the analysis type based on selected options
 * Order matches the manual analysis UI order
 */
export const detectAnalysisType = (
  isPatternAnalysis: boolean,
  isScalping: boolean,
  isSMC: boolean,
  isICT: boolean,
  isTurtleSoup: boolean,
  isGann: boolean,
  isWaves: boolean,
  isPriceAction: boolean,
  isFibonacci: boolean,
  isFibonacciAdvanced: boolean,
  isNeuralNetwork: boolean,
  isRNN: boolean = false,
  isTimeClustering: boolean = false,
  isMultiVariance: boolean = false,
  isCompositeCandlestick: boolean = false,
  isBehavioral: boolean = false,
  isAI: boolean = false
): AnalysisType => {
  if (isAI) return "Smart";
  if (isPatternAnalysis) return "Patterns";
  if (isScalping) return "Scalping";
  if (isSMC) return "SMC";
  if (isICT) return "ICT";
  if (isTurtleSoup) return "Turtle Soup";
  if (isGann) return "Gann";
  if (isWaves) return "Waves";
  if (isPriceAction) return "Price Action";
  if (isFibonacci) return "Fibonacci";
  if (isFibonacciAdvanced) return "Advanced Fibonacci";
  if (isNeuralNetwork) return "Neural Networks";
  if (isRNN) return "Recurrent Neural Networks";
  if (isTimeClustering) return "Time Clustering";
  if (isMultiVariance) return "Multi Variance";
  if (isCompositeCandlestick) return "Composite Candlestick";
  if (isBehavioral) return "Behavioral Analysis";
  return "Normal";
};

/**
 * Builds a configuration object for analysis types
 * Order matches the manual analysis UI order
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
  
  if (isPatternAnalysis) selectedTypes.push("patterns");
  if (isScalping) selectedTypes.push("scalping");
  if (isSMC) selectedTypes.push("smc");
  if (isICT) selectedTypes.push("ict");
  if (isTurtleSoup) selectedTypes.push("turtleSoup");
  if (isGann) selectedTypes.push("gann");
  if (isWaves) selectedTypes.push("waves");
  if (isPriceAction) selectedTypes.push("priceAction");
  if (isFibonacci) selectedTypes.push("fibonacci");
  if (isFibonacciAdvanced) selectedTypes.push("fibonacciAdvanced");
  if (isNeuralNetwork) selectedTypes.push("neuralNetworks");
  if (isRNN) selectedTypes.push("rnn");
  if (isTimeClustering) selectedTypes.push("timeClustering");
  if (isMultiVariance) selectedTypes.push("multiVariance");
  if (isCompositeCandlestick) selectedTypes.push("compositeCandlestick");
  if (isBehavioral) selectedTypes.push("behavioral");
  
  const analysisType: AnalysisType = detectAnalysisType(
    isPatternAnalysis,
    isScalping,
    isSMC,
    isICT,
    isTurtleSoup,
    isGann,
    isWaves,
    isPriceAction,
    isFibonacci,
    isFibonacciAdvanced,
    isNeuralNetwork,
    isRNN,
    isTimeClustering,
    isMultiVariance,
    isCompositeCandlestick,
    isBehavioral,
    isAI
  );

  return { 
    selectedTypes, 
    analysisType,
    options: {
      isPatternAnalysis,
      isScalping,
      isSMC,
      isICT,
      isTurtleSoup,
      isGann,
      isWaves,
      isPriceAction,
      isFibonacci,
      isFibonacciAdvanced,
      isNeuralNetwork,
      isRNN,
      isTimeClustering,
      isMultiVariance,
      isCompositeCandlestick,
      isBehavioral,
      isAI
    }
  };
};
