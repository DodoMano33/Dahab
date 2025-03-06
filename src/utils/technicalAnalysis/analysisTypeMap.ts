
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
