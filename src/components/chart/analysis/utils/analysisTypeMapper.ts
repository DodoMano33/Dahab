
/**
 * Maps the analysis type to the corresponding Supabase enum value
 * This is necessary because the Supabase enum has specific values that must match
 */
export const mapToAnalysisType = (analysisType: string): string => {
  // اطبع نوع التحليل المرسل للتشخيص
  console.log("Analysis type before mapping:", analysisType);
  
  // Make sure to match exactly what's expected in the database
  switch (analysisType.toLowerCase()) {
    case "نمطي":
    case "patterns":
      return "نمطي";
    case "تقلبات":
    case "waves":
      return "تقلبات";
    case "جان":
    case "gann":
      return "جان";
    case "الحساء السلحفائي":
    case "turtle_soup":
    case "turtle soup":
      return "الحساء السلحفائي";
    case "نظرية السوق":
    case "ict":
      return "نظرية السوق";
    case "نظرية هيكل السوق":
    case "smc":
      return "نظرية هيكل السوق";
    case "مضاربة":
    case "scalping":
    case "سكالبينج":
      return "مضاربة";
    case "حركة السعر":
    case "price_action":
    case "price action":
      return "حركة السعر";
    case "شبكات عصبية":
    case "neural_networks":
    case "neural networks":
      return "شبكات عصبية";
    case "ذكي":
    case "smart":
      return "ذكي";
    // Add proper mapping for new analysis types
    case "فيبوناتشي":
    case "fibonacci":
      return "فيبوناتشي";
    case "تحليل فيبوناتشي متقدم":
    case "fibonacci_advanced":
    case "fibonacci advanced":
      return "تحليل فيبوناتشي متقدم";
    case "شبكات عصبية متكررة":
    case "rnn":
      return "شبكات عصبية متكررة"; 
    case "تصفيق زمني":
    case "time_clustering":
    case "time clustering":
    case "time cluster pattern":
      return "تصفيق زمني"; 
    case "تباين متعدد العوامل":
    case "multi_variance":
    case "multi variance":
      return "تباين متعدد العوامل"; 
    case "شمعات مركبة":
    case "composite_candlestick":
    case "composite candlestick":
      return "شمعات مركبة"; 
    case "تحليل سلوكي":
    case "behavioral":
      return "تحليل سلوكي"; 
    case "يومي":
    case "daily":
      return "يومي";
    default:
      // أطبع النوع غير المعروف للتشخيص
      console.log(`Unknown analysis type: "${analysisType}", original type: ${typeof analysisType}`);
      // Return the original type instead of defaulting to something else
      return analysisType; 
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
