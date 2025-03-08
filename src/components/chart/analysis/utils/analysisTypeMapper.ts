/**
 * Maps analysis type names to valid database enum values
 */
export const mapToAnalysisType = (analysisType: string): string => {
  // طباعة نوع التحليل قبل المعالجة
  console.log("Mapping analysis type from:", analysisType);
  
  // Normalize the analysis type by removing spaces, underscores, and converting to lowercase
  const normalizedType = analysisType.toLowerCase().replace(/[_\s-]/g, "");
  
  // Map to valid database enum values
  switch (normalizedType) {
    case "normal":
    case "عادي":
      return "Normal";
    
    case "scalping":
    case "سكالبينج":
    case "مضاربة":
      return "Scalping";
    
    case "patterns":
    case "pattern":
    case "نمطي":
      return "Patterns";
    
    case "smart":
    case "ذكي":
      return "Smart";
    
    case "smc":
    case "نظريةهيكلالسوق":
      return "SMC";
    
    case "ict":
    case "نظريةالسوق":
      return "ICT";
    
    case "turtlesoup":
    case "turtle":
    case "الحساءالسلحفائي":
      return "Turtle Soup";
    
    case "gann":
    case "جان":
      return "Gann";
    
    case "waves":
    case "تقلبات":
      return "Waves";
    
    case "priceaction":
    case "حركةالسعر":
      return "Price Action";
    
    case "fibonacci":
    case "فيبوناتشي":
      return "Fibonacci";
    
    case "advancedfibonacci":
    case "fibonacciadvanced":
    case "تحليلفيبوناتشيمتقدم":
      return "Fibonacci Advanced";
    
    case "neuralnetworks":
    case "شبكاتعصبية":
      return "Neural Networks";
    
    case "recurrentneuralnetworks":
    case "rnn":
    case "شبكاتعصبيةمتكررة":
      return "RNN";
    
    case "timeclustering":
    case "تصفيقزمني":
      return "Time Clustering";
    
    case "multivariance":
    case "تباينمتعددالعوامل":
      return "Multi Variance";
    
    case "compositecandlestick":
    case "شمعاتمركبة":
      return "Composite Candlestick";
    
    case "behavioral":
    case "behavioralanalysis":
    case "تحليلسلوكي":
      return "Behavioral Analysis";
    
    default:
      console.warn(`Unknown analysis type "${analysisType}", defaulting to "Normal"`);
      return "Normal";
  }
};

/**
 * Maps an analysis type string to configuration flags for the analysis handler
 */
export const mapAnalysisTypeToConfig = (analysisType: string) => {
  // Normalize the analysis type
  const normalizedType = analysisType.toLowerCase().replace(/[_\s-]/g, "");
  
  // Default configuration with all flags set to false
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
  
  // Set the appropriate flag based on the normalized analysis type
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
