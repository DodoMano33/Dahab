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
    case 'normal':
    case 'daily':
    case 'عادي':
    case 'يومي':
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
    case 'normal':
    case 'daily':
    case 'عادي':
    case 'يومي':
      return 'تحليل الأنماط';
      
    case 'سكالبينج':
    case 'مضاربة':
    case 'scalping':
      return 'سكالبينج';
      
    case 'smc':
    case 'نظريةهيكلالسوق':
      return 'تحليل SMC';
      
    case 'ict':
    case 'نظريةالسوق':
      return 'تحليل ICT';
      
    case 'تقلبات':
    case 'wave':
    case 'waves':
      return 'تحليل الموجات';
      
    case 'حركةالسعر':
    case 'priceaction':
      return 'حركة السعر';
      
    case 'جان':
    case 'gann':
      return 'تحليل جان';
      
    case 'الحساءالسلحفائي':
    case 'turtlesoup':
    case 'turtle':
      return 'Turtle Soup';
      
    case 'ذكي':
    case 'smart':
    case 'ai':
      return 'شبكات عصبية';
      
    case 'شبكاتعصبية':
    case 'neuralnetworks':
    case 'neuralnetwork':
      return 'شبكات عصبية';
      
    case 'rnn':
    case 'شبكاتعصبيةمتكررة':
      return 'شبكات RNN';
      
    case 'تصفيقزمني':
    case 'timeclustering':
      return 'تصفيق زمني';
      
    case 'تباينمتعدد':
    case 'multivariance':
      return 'تباين متعدد';
      
    case 'شمعاتمركبة':
    case 'compositecandlesticks':
      return 'شمعات مركبة';
      
    case 'تحليلسلوكي':
    case 'behavioral':
      return 'تحليل سلوكي';
      
    case 'فيبوناتشي':
    case 'fibonacci':
      return 'فيبوناتشي';
      
    case 'فيبوناتشيمتقدم':
    case 'fibonacci_advanced':
    case 'fibonacciadvanced':
      return 'فيبوناتشي متقدم';
      
    default:
      console.log("Unknown analysis type:", analysisType, "Using default: تحليل الأنماط");
      return 'تحليل الأنماط';
  }
};
