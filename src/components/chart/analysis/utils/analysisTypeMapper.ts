
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
    case 'نمطي':
    case 'pattern':
    case 'patterns':
      config.isPatternAnalysis = true;
      break;
      
    case 'سكالبينج':
    case 'مضاربة':
    case 'scalping':
      config.isScalping = true;
      break;
      
    case 'smc':
    case 'نظريةهيكلالسوق':
      config.isSMC = true;
      break;
      
    case 'ict':
    case 'نظريةالسوق':
      config.isICT = true;
      break;
      
    case 'تقلبات':
    case 'wave':
    case 'waves':
      config.isWaves = true;
      break;
      
    case 'حركةالسعر':
    case 'priceaction':
      config.isPriceAction = true;
      break;
      
    case 'جان':
    case 'gann':
      config.isGann = true;
      break;
      
    case 'الحساءالسلحفائي':
    case 'turtlesoup':
    case 'turtle':
      config.isTurtleSoup = true;
      break;
      
    case 'شبكاتعصبية':
    case 'neuralnetworks':
    case 'neuralnetwork':
      config.isNeuralNetwork = true;
      break;
      
    case 'فيبوناتشي':
    case 'fibonacci':
      config.isFibonacci = true;
      break;
      
    case 'فيبوناتشيمتقدم':
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
    case 'نمطي':
    case 'pattern':
    case 'patterns':
      return 'نمطي';
      
    case 'سكالبينج':
    case 'مضاربة':
    case 'scalping':
      return 'مضاربة';
      
    case 'smc':
    case 'نظريةهيكلالسوق':
      return 'نظرية هيكل السوق';
      
    case 'ict':
    case 'نظريةالسوق':
      return 'نظرية السوق';
      
    case 'تقلبات':
    case 'wave':
    case 'waves':
      return 'تقلبات';
      
    case 'حركةالسعر':
    case 'priceaction':
      return 'حركة السعر';
      
    case 'جان':
    case 'gann':
      return 'جان';
      
    case 'الحساءالسلحفائي':
    case 'turtlesoup':
    case 'turtle':
      return 'الحساء السلحفائي';
      
    case 'ذكي':
    case 'smart':
    case 'ai':
      return 'ذكي';
      
    case 'شبكاتعصبية':
    case 'neuralnetworks':
    case 'neuralnetwork':
      return 'شبكات عصبية';
      
    case 'فيبوناتشي':
    case 'فيبوناتشيمتقدم':
    case 'fibonacci':
    case 'fibonacci_advanced':
    case 'fibonacciadvanced':
      return 'فيبوناتشي';
      
    default:
      console.log("Unknown analysis type:", analysisType, "Using default: يومي");
      return 'يومي';
  }
};
