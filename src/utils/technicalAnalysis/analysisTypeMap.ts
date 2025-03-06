
/**
 * Maps analysis type keys to their display names
 */
export const analysisTypeMap: Record<string, string> = {
  "scalping": "Scalping",
  "smc": "SMC",
  "ict": "ICT",
  "turtleSoup": "Turtle Soup",
  "gann": "Gann",
  "waves": "Waves", 
  "patterns": "Patterns",
  "priceAction": "Price Action",
  "neural_networks": "شبكات عصبية",
  "neural networks": "شبكات عصبية",
  "neuralnetworks": "شبكات عصبية",
  "rnn": "شبكات عصبية متكررة",
  "recurrent neural networks": "شبكات عصبية متكررة",
  "time_clustering": "تصفيق زمني",
  "time clustering": "تصفيق زمني",
  "timeclustering": "تصفيق زمني",
  "multi_variance": "تباين متعدد العوامل",
  "multi variance": "تباين متعدد العوامل",
  "multivariance": "تباين متعدد العوامل",
  "composite_candlestick": "شمعات مركبة",
  "composite candlestick": "شمعات مركبة",
  "compositecandlestick": "شمعات مركبة",
  "behavioral": "تحليل سلوكي",
  "behavioral analysis": "تحليل سلوكي",
  "fibonacci": "فيبوناتشي",
  "fibonacci_advanced": "تحليل فيبوناتشي متقدم",
  "fibonacci advanced": "تحليل فيبوناتشي متقدم",
  "fibonacciadvanced": "تحليل فيبوناتشي متقدم",
  // Add Arabic names as keys too for better matching
  "شبكات عصبية": "شبكات عصبية",
  "شبكات عصبية متكررة": "شبكات عصبية متكررة",
  "تصفيق زمني": "تصفيق زمني",
  "تباين متعدد العوامل": "تباين متعدد العوامل",
  "شمعات مركبة": "شمعات مركبة",
  "تحليل سلوكي": "تحليل سلوكي",
  "فيبوناتشي": "فيبوناتشي",
  "تحليل فيبوناتشي متقدم": "تحليل فيبوناتشي متقدم",
  // Add standard Arabic names for the original analysis types
  "مضاربة": "مضاربة", 
  "نظرية هيكل السوق": "نظرية هيكل السوق",
  "نظرية السوق": "نظرية السوق",
  "الحساء السلحفائي": "الحساء السلحفائي",
  "جان": "جان",
  "تقلبات": "تقلبات",
  "نمطي": "نمطي",
  "حركة السعر": "حركة السعر",
  "ذكي": "ذكي",
  "عادي": "عادي",
  "يومي": "يومي"
};

/**
 * Get a formatted display name for an analysis type
 */
export const getStrategyName = (type: string): string => {
  if (!type) return "غير محدد";
  
  // Direct lookup first
  if (type in analysisTypeMap) {
    return analysisTypeMap[type];
  }
  
  // Handle different case formats and variations
  const normalizedType = type.toLowerCase().replace(/_/g, '').trim();
  
  for (const key in analysisTypeMap) {
    const normalizedKey = key.toLowerCase().replace(/_/g, '').trim();
    if (normalizedType === normalizedKey) {
      return analysisTypeMap[key];
    }
  }
  
  // If no direct match, check for partial matches
  for (const key in analysisTypeMap) {
    const normalizedKey = key.toLowerCase().replace(/_/g, '').trim();
    if (normalizedType.includes(normalizedKey) || normalizedKey.includes(normalizedType)) {
      return analysisTypeMap[key];
    }
  }
  
  // For debugging
  console.log(`No match found for analysis type: "${type}" (normalized: "${normalizedType}")`);
  
  // If no match at all, return the original type
  return type;
};
