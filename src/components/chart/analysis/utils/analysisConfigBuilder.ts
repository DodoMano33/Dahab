
import { AnalysisType } from "@/types/analysis";

// Configuration interface for analysis types
interface AnalysisConfig {
  isScalping: boolean;
  isSMC: boolean;
  isICT: boolean;
  isTurtleSoup: boolean;
  isGann: boolean;
  isWaves: boolean;
  isPatternAnalysis: boolean;
  isPriceAction: boolean;
  isNeuralNetwork: boolean;
  isRNN?: boolean;
  isTimeClustering?: boolean;
  isMultiVariance?: boolean;
  isCompositeCandlestick?: boolean;
  isBehavioral?: boolean;
  isFibonacci?: boolean;
  isFibonacciAdvanced?: boolean;
}

export const mapAnalysisTypeToConfig = (analysisType: string): AnalysisConfig => {
  // Normalize the string for comparison (lowercase, remove spaces/special chars)
  const normalizedType = analysisType.toLowerCase().replace(/[\s-_]/g, '');
  
  // Map the analysis type to configuration values
  const config: AnalysisConfig = {
    isScalping: false,
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
  
  switch (normalizedType) {
    case 'pattern':
    case 'patterns':
      config.isPatternAnalysis = true;
      break;
      
    case 'scalping':
      config.isScalping = true;
      break;
      
    case 'smc':
    case 'marketstructuretheory':
      config.isSMC = true;
      break;
      
    case 'ict':
    case 'markettheory':
      config.isICT = true;
      break;
      
    case 'volatility':
    case 'wave':
    case 'waves':
      config.isWaves = true;
      break;
      
    case 'priceaction':
      config.isPriceAction = true;
      break;
      
    case 'gann':
      config.isGann = true;
      break;
      
    case 'turtlesoup':
    case 'turtle':
      config.isTurtleSoup = true;
      break;
      
    case 'neuralnetworks':
    case 'neuralnetwork':
      config.isNeuralNetwork = true;
      break;
      
    case 'fibonacci':
      config.isFibonacci = true;
      break;
      
    case 'fibonacci_advanced':
    case 'fibonacciadvanced':
      config.isFibonacciAdvanced = true;
      break;
      
    default:
      // Default to pattern analysis if no type matches
      config.isPatternAnalysis = true;
  }
  
  return config;
};

export const mapToAnalysisType = (analysisType: string): AnalysisType => {
  // Normalize the string for comparison (lowercase, remove spaces/special chars)
  const normalizedType = analysisType.toLowerCase().replace(/[\s-_]/g, '');
  
  console.log("Mapping analysis type:", analysisType, "Normalized:", normalizedType);
  
  // Map the analysis type to a valid database value
  switch (normalizedType) {
    case 'pattern':
    case 'patterns':
      return 'Pattern';
      
    case 'scalping':
      return 'Scalping';
      
    case 'smc':
    case 'marketstructuretheory':
      return 'Market Structure Theory';
      
    case 'ict':
    case 'markettheory':
      return 'Market Theory';
      
    case 'volatility':
    case 'wave':
    case 'waves':
      return 'Waves';
      
    case 'priceaction':
      return 'Price Action';
      
    case 'gann':
      return 'Gann';
      
    case 'turtlesoup':
    case 'turtle':
      return 'Turtle Soup';
      
    case 'smart':
    case 'ai':
      return 'Smart';
      
    case 'neuralnetworks':
    case 'neuralnetwork':
      return 'Neural Network';
      
    case 'fibonacci':
    case 'fibonacciadvanced':
    case 'fibonacci_advanced':
      return 'Fibonacci';
      
    default:
      console.log("Unknown analysis type:", analysisType, "Using default: Daily");
      return 'Daily';
  }
};

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
  if (isNeuralNetwork) return "Neural Network";
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
  
  const analysisType = isAI ? "Smart" : detectAnalysisType(
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
