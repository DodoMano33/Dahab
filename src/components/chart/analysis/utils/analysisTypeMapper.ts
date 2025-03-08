
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
