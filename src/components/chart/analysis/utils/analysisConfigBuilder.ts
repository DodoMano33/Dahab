
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
  if (isAI) return "ذكي";
  if (isScalping) return "سكالبينج";
  if (isSMC) return "تحليل SMC";
  if (isICT) return "تحليل ICT";
  if (isTurtleSoup) return "Turtle Soup";
  if (isGann) return "تحليل جان";
  if (isWaves) return "تحليل الموجات";
  if (isPatternAnalysis) return "تحليل الأنماط";
  if (isPriceAction) return "حركة السعر";
  if (isFibonacci) return "فيبوناتشي";
  if (isFibonacciAdvanced) return "فيبوناتشي متقدم";
  if (isNeuralNetwork) return "شبكات عصبية";
  if (isRNN) return "شبكات RNN";
  if (isTimeClustering) return "تصفيق زمني";
  if (isMultiVariance) return "تباين متعدد";
  if (isCompositeCandlestick) return "شمعات مركبة";
  if (isBehavioral) return "تحليل سلوكي";
  return "عادي";
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
