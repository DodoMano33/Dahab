
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
