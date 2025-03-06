import { AnalysisType } from "@/types/analysis";

/**
 * Maps UI analysis type names to database enum values
 */
export const mapToAnalysisType = (analysisType: string): AnalysisType => {
  console.log("Mapping analysis type:", analysisType);
  
  // Normalize the analysis type (remove special characters, spaces, make lowercase)
  const normalizedType = analysisType.toLowerCase()
    .replace(/[\s_\-]/g, '')
    .trim();
  
  console.log("Normalized analysis type:", normalizedType);
  
  // Map normalized types to database enum values
  switch (normalizedType) {
    case "عادي":
    case "normal":
    case "تحليلعادي":
    case "التحليلالعادي":
      return "normal";
      
    case "fibonacci":
    case "فيبوناتشي":
      return "fibonacci";
      
    case "fibonacci_advanced":
    case "fibonacciadvanced":
    case "فيبوناتشيمتقدم":
    case "تحليلفيبوناتشيمتقدم":
      return "fibonacci_advanced";
      
    case "gann":
    case "جان":
    case "تحليلجان":
      return "gann";
      
    case "waves":
    case "موجات":
    case "تحليلالموجات":
      return "waves";
      
    case "priceaction":
    case "حركةالسعر":
      return "price_action";
      
    case "scalping":
    case "سكالبينج":
    case "مضاربة":
      return "scalping";
      
    case "smc":
    case "تحليلتحكمالسيولة":
      return "smc";
      
    case "ict":
    case "تحليلict":
      return "ict";
      
    case "timeclustering":
    case "تحليلتجمعالوقت":
      return "time_clustering";
      
    case "pattern":
    case "نمطي":
    case "تحليلالأنماط":
      return "pattern";
      
    case "multivariance":
    case "التباينالمتعدد":
      return "multi_variance";
      
    case "neuralnetwork":
    case "الشبكةالعصبية":
      return "neural_network";
      
    case "behaviors":
    case "تحليلالسلوك":
      return "behaviors";
      
    case "turtlesoup":
    case "تحليلturtlesoup":
      return "turtle_soup";
      
    case "rnn":
    case "شبكةrnnالعصبية":
      return "rnn";
      
    case "compositecandlesticks":
    case "تحليلالشموعالمركب":
      return "composite_candlesticks";
      
    default:
      console.warn(`Unknown analysis type: ${analysisType}, defaulting to "normal"`);
      return "normal";
  }
};

// Adding a utility function to convert database values to display names and flags
export const mapAnalysisTypeToConfig = (type: AnalysisType): { 
  value: string, 
  name: string,
  isScalping?: boolean,
  isSMC?: boolean,
  isICT?: boolean,
  isTurtleSoup?: boolean,
  isGann?: boolean,
  isWaves?: boolean,
  isPatternAnalysis?: boolean,
  isPriceAction?: boolean,
  isNeuralNetwork?: boolean,
  isRNN?: boolean,
  isTimeClustering?: boolean,
  isMultiVariance?: boolean,
  isCompositeCandlestick?: boolean,
  isBehavioral?: boolean,
  isFibonacci?: boolean,
  isFibonacciAdvanced?: boolean
} => {
  // Default config with all flags set to false
  const defaultConfig = {
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
  
  switch (type) {
    case "normal":
      return { value: "normal", name: "عادي", ...defaultConfig };
    case "fibonacci":
      return { value: "fibonacci", name: "فيبوناتشي", ...defaultConfig, isFibonacci: true };
    case "fibonacci_advanced":
      return { value: "fibonacci_advanced", name: "تحليل فيبوناتشي متقدم", ...defaultConfig, isFibonacciAdvanced: true };
    case "gann":
      return { value: "gann", name: "جان", ...defaultConfig, isGann: true };
    case "waves":
      return { value: "waves", name: "موجات", ...defaultConfig, isWaves: true };
    case "price_action":
      return { value: "price_action", name: "حركة السعر", ...defaultConfig, isPriceAction: true };
    case "scalping":
      return { value: "scalping", name: "سكالبينج", ...defaultConfig, isScalping: true };
    case "smc":
      return { value: "smc", name: "SMC", ...defaultConfig, isSMC: true };
    case "ict":
      return { value: "ict", name: "ICT", ...defaultConfig, isICT: true };
    case "time_clustering":
      return { value: "time_clustering", name: "تجمع الوقت", ...defaultConfig, isTimeClustering: true };
    case "pattern":
      return { value: "pattern", name: "نمطي", ...defaultConfig, isPatternAnalysis: true };
    case "multi_variance":
      return { value: "multi_variance", name: "تباين متعدد", ...defaultConfig, isMultiVariance: true };
    case "neural_network":
      return { value: "neural_network", name: "شبكة عصبية", ...defaultConfig, isNeuralNetwork: true };
    case "behaviors":
      return { value: "behaviors", name: "تحليل سلوكي", ...defaultConfig, isBehavioral: true };
    case "turtle_soup":
      return { value: "turtle_soup", name: "تحليل Turtle Soup", ...defaultConfig, isTurtleSoup: true };
    case "rnn":
      return { value: "rnn", name: "شبكة RNN العصبية", ...defaultConfig, isRNN: true };
    case "composite_candlesticks":
      return { value: "composite_candlesticks", name: "تحليل الشموع المركب", ...defaultConfig, isCompositeCandlestick: true };
    default:
      return { value: String(type), name: String(type), ...defaultConfig };
  }
};
