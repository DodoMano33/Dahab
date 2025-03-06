
import { AnalysisType } from "@/types/analysis";

// Map the display names to valid database enum values
export const mapToAnalysisType = (type: string): AnalysisType => {
  // Normalize the input by removing spaces, underscores, and converting to lowercase
  const normalizedType = type.toLowerCase().replace(/[_\s]/g, "");
  
  console.log("Mapping analysis type:", type, "normalized to:", normalizedType);
  
  // Map to database enum values
  switch (normalizedType) {
    case "normal":
    case "نمطي":
    case "pattern":
    case "patterns":
      return "نمطي";
    
    case "waves":
    case "تقلبات":
    case "موجات":
      return "تقلبات";
    
    case "gann":
    case "جان":
      return "جان";
    
    case "turtlesoup":
    case "الحساءالسلحفائي":
      return "الحساء السلحفائي";
    
    case "ict":
    case "نظريةالسوق":
      return "نظرية السوق";
    
    case "smc":
    case "نظريةهيكلالسوق":
      return "نظرية هيكل السوق";
    
    case "scalping":
    case "سكالبينج":
    case "مضاربة":
      return "مضاربة";
    
    case "priceaction":
    case "حركةالسعر":
      return "حركة السعر";
    
    case "fibonacci":
    case "fib":
    case "فيبوناتشي":
    case "fibonacci_advanced":
    case "advancedfibonacci":
    case "fibonacciadvanced":
    case "تحليلفيبوناتشيمتقدم":
      // Always map both regular and advanced fibonacci to "نمطي" for database compatibility
      return "نمطي";
    
    case "neuralnetwork":
    case "شبكاتعصبية":
    case "neural":
    case "nn":
      return "شبكات عصبية";
    
    case "rnn":
    case "شبكاتعصبيةمتكررة":
      return "شبكات عصبية";
    
    case "timeclustering":
    case "تصفيقزمني":
      return "تقلبات";
    
    case "multivariance":
    case "تباينمتعدد":
      return "تقلبات";
    
    case "compositecandlestick":
    case "شمعاتمركبة":
      return "نمطي";
    
    case "behavioral":
    case "تحليلسلوكي":
      return "حركة السعر";
    
    case "smart":
    case "ذكي":
    case "ai":
      return "ذكي";
    
    default:
      console.warn("Unknown analysis type:", type, "defaulting to نمطي");
      return "نمطي"; // Default to pattern analysis
  }
};

// Helper function to map analysis type to configuration flags
export const mapAnalysisTypeToConfig = (type: string) => {
  // Convert to lowercase and normalize
  const normalizedType = type.toLowerCase().replace(/[_\s]/g, "");
  
  // Default config object
  const config = {
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
  
  // Set the appropriate flag based on type
  switch (normalizedType) {
    case "scalping":
    case "سكالبينج":
    case "مضاربة":
      config.isScalping = true;
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
    case "الحساءالسلحفائي":
      config.isTurtleSoup = true;
      break;
    
    case "gann":
    case "جان":
      config.isGann = true;
      break;
    
    case "waves":
    case "تقلبات":
    case "موجات":
      config.isWaves = true;
      break;
    
    case "normal":
    case "نمطي":
    case "pattern":
    case "patterns":
      config.isPatternAnalysis = true;
      break;
    
    case "priceaction":
    case "حركةالسعر":
      config.isPriceAction = true;
      break;
    
    case "fibonacci":
    case "فيبوناتشي":
      config.isFibonacci = true;
      break;
    
    case "fibonacci_advanced":
    case "fibonacciadvanced":
    case "advancedfibonacci":
    case "تحليلفيبوناتشيمتقدم":
      config.isFibonacciAdvanced = true;
      break;
    
    case "neuralnetwork":
    case "شبكاتعصبية":
      config.isNeuralNetwork = true;
      break;
    
    case "rnn":
    case "شبكاتعصبيةمتكررة":
      config.isRNN = true;
      break;
    
    case "timeclustering":
    case "تصفيقزمني":
      config.isTimeClustering = true;
      break;
    
    case "multivariance":
    case "تباينمتعدد":
      config.isMultiVariance = true;
      break;
    
    case "compositecandlestick":
    case "شمعاتمركبة":
      config.isCompositeCandlestick = true;
      break;
    
    case "behavioral":
    case "تحليلسلوكي":
      config.isBehavioral = true;
      break;
  }
  
  return config;
};
