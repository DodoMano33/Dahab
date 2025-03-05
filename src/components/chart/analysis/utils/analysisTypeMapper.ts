
/**
 * Maps the analysis type to the corresponding Supabase enum value
 * This is necessary because the Supabase enum has specific values that must match
 */
export const mapToAnalysisType = (analysisType: string): string => {
  // Make sure to match exactly what's expected in the database
  switch (analysisType) {
    case "نمطي":
    case "Patterns":
      return "نمطي";
    case "تقلبات":
    case "Waves":
      return "تقلبات";
    case "جان":
    case "Gann":
      return "جان";
    case "الحساء السلحفائي":
    case "Turtle Soup":
      return "الحساء السلحفائي";
    case "نظرية السوق":
    case "ICT":
      return "نظرية السوق";
    case "نظرية هيكل السوق":
    case "SMC":
      return "نظرية هيكل السوق";
    case "يومي":
    case "Daily":
      return "يومي";
    case "مضاربة":
    case "Scalping":
      return "مضاربة";
    case "حركة السعر":
    case "Price Action":
      return "حركة السعر";
    case "شبكات عصبية":
    case "Neural Networks":
      return "شبكات عصبية";
    case "ذكي":
    case "Smart":
      return "ذكي";
    case "فيبوناتشي":
    case "Fibonacci":
      return "فيبوناتشي";
    case "تحليل فيبوناتشي متقدم":
    case "Fibonacci Advanced":
      return "تحليل فيبوناتشي متقدم";  
    // Now return the new analysis types directly
    case "شبكات عصبية متكررة":
    case "RNN":
      return "شبكات عصبية متكررة"; 
    case "تصفيق زمني":
    case "Time Clustering":
      return "تصفيق زمني"; 
    case "تباين متعدد العوامل":
    case "Multi Variance":
      return "تباين متعدد العوامل"; 
    case "شمعات مركبة":
    case "Composite Candlestick":
      return "شمعات مركبة"; 
    case "تحليل سلوكي":
    case "Behavioral":
      return "تحليل سلوكي"; 
    default:
      console.log(`Unknown analysis type: ${analysisType}, defaulting to "يومي"`);
      return "يومي"; // Default to daily analysis if type is unknown
  }
};

// Add the missing function for AnalysisPerformer
export const mapAnalysisTypeToConfig = (analysisType: string) => {
  return {
    isScalping: analysisType === "Scalping" || analysisType === "مضاربة" || analysisType === "سكالبينج",
    isSMC: analysisType === "SMC" || analysisType === "نظرية هيكل السوق",
    isICT: analysisType === "ICT" || analysisType === "نظرية السوق",
    isTurtleSoup: analysisType === "Turtle Soup" || analysisType === "الحساء السلحفائي",
    isGann: analysisType === "Gann" || analysisType === "جان",
    isWaves: analysisType === "Waves" || analysisType === "تقلبات",
    isPatternAnalysis: analysisType === "Patterns" || analysisType === "نمطي",
    isPriceAction: analysisType === "Price Action" || analysisType === "حركة السعر",
    isNeuralNetwork: analysisType === "Neural Networks" || analysisType === "شبكات عصبية",
    isRNN: analysisType === "RNN" || analysisType === "شبكات عصبية متكررة",
    isTimeClustering: analysisType === "Time Clustering" || analysisType === "تصفيق زمني",
    isMultiVariance: analysisType === "Multi Variance" || analysisType === "تباين متعدد العوامل",
    isCompositeCandlestick: analysisType === "Composite Candlestick" || analysisType === "شمعات مركبة",
    isBehavioral: analysisType === "Behavioral" || analysisType === "تحليل سلوكي",
    isFibonacci: analysisType === "Fibonacci" || analysisType === "فيبوناتشي",
    isFibonacciAdvanced: analysisType === "Fibonacci Advanced" || analysisType === "تحليل فيبوناتشي متقدم"
  };
};
