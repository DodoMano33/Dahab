/**
 * Maps analysis type keys to their display names
 */
export const analysisTypeMap: Record<string, string> = {
  "scalping": "مضاربة",
  "smc": "نظرية هيكل السوق",
  "ict": "نظرية السوق",
  "turtleSoup": "الحساء السلحفائي",
  "gann": "جان",
  "waves": "تقلبات", 
  "patterns": "نمطي",
  "priceAction": "حركة السعر",
  "neural_networks": "شبكات عصبية",
  "rnn": "شبكات عصبية متكررة",
  "time_clustering": "تصفيق زمني",
  "multi_variance": "تباين متعدد العوامل",
  "composite_candlestick": "شمعات مركبة",
  "behavioral": "تحليل سلوكي",
  "fibonacci": "فيبوناتشي",
  "fibonacci_advanced": "تحليل فيبوناتشي متقدم"
};

/**
 * Get a formatted display name for an analysis type
 */
export const getStrategyName = (type: string): string => {
  return analysisTypeMap[type] || type;
};
