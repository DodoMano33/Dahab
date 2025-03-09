
import { AnalysisType } from "@/types/analysis";

/**
 * Maps various analysis type input formats to the standardized AnalysisType enum
 * that's accepted by the database.
 */
export const mapToAnalysisType = (inputType: string): AnalysisType => {
  // Normalize the input by removing spaces and converting to lowercase
  const normalized = String(inputType).toLowerCase().replace(/\s+/g, '');
  console.log("Mapping analysis type:", inputType, "Normalized:", normalized);
  
  // Map normalized input to valid database values
  switch(normalized) {
    case 'فيبوناتشي':
    case 'fibonacci':
      return 'فيبوناتشي';
      
    case 'فيبوناتشيمتقدم':
    case 'advancedfibonacci':
    case 'fibonacci_advanced':
      return 'فيبوناتشي متقدم';
      
    case 'تحليلجان':
    case 'جان':
    case 'gann':
      return 'تحليل جان';
      
    case 'تحليلالموجات':
    case 'موجات':
    case 'waves':
      return 'تحليل الموجات';
      
    case 'حركةالسعر':
    case 'priceaction':
      return 'حركة السعر';
      
    case 'سكالبينج':
    case 'scalping':
      return 'سكالبينج';
      
    case 'smc':
    case 'تحليلsmc':
      return 'تحليل SMC';
      
    case 'ict':
    case 'تحليلict':
      return 'تحليل ICT';
      
    case 'تصفيقزمني':
    case 'timeclustering':
      return 'تصفيق زمني';
      
    case 'تحليلالأنماط':
    case 'تحليلالانماط':
    case 'patterns':
      return 'تحليل الأنماط';
      
    case 'تباينمتعدد':
    case 'multivariance':
      return 'تباين متعدد';
      
    case 'شبكاتعصبية':
    case 'neuralnetwork':
      return 'شبكات عصبية';
      
    case 'تحليلسلوكي':
    case 'behavioral':
    case 'سلوكي':
      return 'تحليل سلوكي';
      
    case 'turtlesoup':
    case 'حساءالسلحفاة':
      return 'Turtle Soup';
      
    case 'rnn':
    case 'شبكاتrnn':
    case 'شبكاتعصبيةمتكررة':
      return 'شبكات RNN';
      
    case 'شمعاتمركبة':
    case 'compositecandlestick':
      return 'شمعات مركبة';
      
    case 'ذكي':
    case 'smart':
      return 'ذكي';
      
    default:
      console.warn("Unrecognized analysis type:", inputType, "using default 'تحليل الأنماط'");
      return 'تحليل الأنماط';
  }
};

/**
 * Maps an analysis type string to a configuration object for performing analysis
 */
export const mapAnalysisTypeToConfig = (analysisType: string) => {
  // Normalize the analysis type first
  const normalizedType = mapToAnalysisType(analysisType);
  
  // Default configuration
  const defaultConfig = {
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
  
  // Set the appropriate flag based on the normalized type
  switch (normalizedType) {
    case 'سكالبينج':
      return { ...defaultConfig, isScalping: true };
    case 'تحليل SMC':
      return { ...defaultConfig, isSMC: true };
    case 'تحليل ICT':
      return { ...defaultConfig, isICT: true };
    case 'Turtle Soup':
      return { ...defaultConfig, isTurtleSoup: true };
    case 'تحليل جان':
      return { ...defaultConfig, isGann: true };
    case 'تحليل الموجات':
      return { ...defaultConfig, isWaves: true };
    case 'تحليل الأنماط':
      return { ...defaultConfig, isPatternAnalysis: true };
    case 'حركة السعر':
      return { ...defaultConfig, isPriceAction: true };
    case 'شبكات عصبية':
      return { ...defaultConfig, isNeuralNetwork: true };
    case 'شبكات RNN':
      return { ...defaultConfig, isRNN: true };
    case 'تصفيق زمني':
      return { ...defaultConfig, isTimeClustering: true };
    case 'تباين متعدد':
      return { ...defaultConfig, isMultiVariance: true };
    case 'شمعات مركبة':
      return { ...defaultConfig, isCompositeCandlestick: true };
    case 'تحليل سلوكي':
      return { ...defaultConfig, isBehavioral: true };
    case 'فيبوناتشي':
      return { ...defaultConfig, isFibonacci: true };
    case 'فيبوناتشي متقدم':
      return { ...defaultConfig, isFibonacciAdvanced: true };
    case 'ذكي':
      return { ...defaultConfig, isAI: true };
    default:
      console.warn(`No specific config for analysis type: ${analysisType}, using pattern analysis`);
      return { ...defaultConfig, isPatternAnalysis: true };
  }
};
