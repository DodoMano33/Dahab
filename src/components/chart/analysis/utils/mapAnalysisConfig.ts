
import { ValidAnalysisType } from "./constants/analysisTypes";

/**
 * Configuration flags for different analysis features
 */
export interface AnalysisConfig {
  isScalping: boolean;
  isAI: boolean;
  isSMC: boolean;
  isICT: boolean;
  isTurtleSoup: boolean;
  isGann: boolean;
  isWaves: boolean;
  isPatternAnalysis: boolean;
  isPriceAction: boolean;
  isNeuralNetwork: boolean;
  isRNN: boolean;
  isTimeClustering: boolean;
  isMultiVariance: boolean;
  isCompositeCandlestick: boolean;
  isBehavioral: boolean;
  isFibonacci: boolean;
  isFibonacciAdvanced: boolean;
}

/**
 * Maps an analysis type string to configuration flags for the analysis handler
 */
export const mapAnalysisTypeToConfig = (analysisType: string): AnalysisConfig => {
  // Normalize the analysis type
  const normalizedType = analysisType.toLowerCase().replace(/[_\s-]/g, "");
  
  // Default configuration with all flags set to false
  const config: AnalysisConfig = {
    isScalping: false,
    isAI: false,
    isSMC: false,
    isICT: false,
    isTurtleSoup: false,
    isGann: false,
    isWaves: false,
    isPatternAnalysis: false,
    isPriceAction: false,
    isNeuralNetwork: false,
    isRNN: false,
    isTimeClustering: false,
    isMultiVariance: false,
    isCompositeCandlestick: false,
    isBehavioral: false,
    isFibonacci: false,
    isFibonacciAdvanced: false
  };
  
  // Set the appropriate flag based on the normalized analysis type
  switch (normalizedType) {
    case "scalping":
    case "سكالبينج":
    case "مضاربة":
      config.isScalping = true;
      break;
    case "smart":
    case "ذكي":
      config.isAI = true;
      break;
    case "smc":
    case "نظريةهيكلالسوق":
      config.isSMC = true;
      break;
    case "ict":
    case "نظريةالسوق":
      config.isICT = true;
      break;
    case "turtlesoup":
    case "turtle":
    case "الحساءالسلحفائي":
      config.isTurtleSoup = true;
      break;
    case "gann":
    case "جان":
      config.isGann = true;
      break;
    case "waves":
    case "تقلبات":
      config.isWaves = true;
      break;
    case "patterns":
    case "pattern":
    case "نمطي":
      config.isPatternAnalysis = true;
      break;
    case "priceaction":
    case "حركةالسعر":
      config.isPriceAction = true;
      break;
    case "neuralnetworks":
    case "شبكاتعصبية":
      config.isNeuralNetwork = true;
      break;
    case "recurrentneuralnetworks":
    case "rnn":
    case "شبكاتعصبيةمتكررة":
      config.isRNN = true;
      break;
    case "timeclustering":
    case "تصفيقزمني":
      config.isTimeClustering = true;
      break;
    case "multivariance":
    case "تباينمتعددالعوامل":
      config.isMultiVariance = true;
      break;
    case "compositecandlestick":
    case "شمعاتمركبة":
      config.isCompositeCandlestick = true;
      break;
    case "behavioral":
    case "behavioralanalysis":
    case "تحليلسلوكي":
      config.isBehavioral = true;
      break;
    case "fibonacci":
    case "فيبوناتشي":
      config.isFibonacci = true;
      break;
    case "advancedfibonacci":
    case "fibonacciadvanced":
    case "تحليلفيبوناتشيمتقدم":
      config.isFibonacciAdvanced = true;
      break;
  }
  
  return config;
};
