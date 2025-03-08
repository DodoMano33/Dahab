
/**
 * Maps analysis type keys to their display names
 */
export const analysisTypeMap: Record<string, string> = {
  "scalping": "Scalping",
  "smc": "SMC",
  "ict": "ICT",
  "turtleSoup": "Turtle Soup",
  "turtle soup": "Turtle Soup",
  "turtle_soup": "Turtle Soup",
  "turtle": "Turtle Soup",
  "gann": "Gann",
  "waves": "Waves",
  "patterns": "Patterns",
  "pattern": "Patterns",
  "priceAction": "Price Action",
  "price action": "Price Action",
  "price_action": "Price Action",
  "neural_networks": "Neural Networks",
  "neural networks": "Neural Networks",
  "neuralnetworks": "Neural Networks",
  "rnn": "RNN",
  "recurrent neural networks": "RNN",
  "recurrent_neural_networks": "RNN",
  "time_clustering": "Time Clustering",
  "time clustering": "Time Clustering",
  "timeclustering": "Time Clustering",
  "multi_variance": "Multi Variance",
  "multi variance": "Multi Variance",
  "multivariance": "Multi Variance",
  "composite_candlestick": "Composite Candlestick",
  "composite candlestick": "Composite Candlestick",
  "compositecandlestick": "Composite Candlestick",
  "behavioral": "Behavioral Analysis",
  "behavioral analysis": "Behavioral Analysis",
  "behavioralanalysis": "Behavioral Analysis",
  "fibonacci": "Fibonacci",
  "fibonacci_advanced": "Fibonacci Advanced",
  "fibonacci advanced": "Fibonacci Advanced",
  "advancedfibonacci": "Fibonacci Advanced",
  "fibonacciadvanced": "Fibonacci Advanced",
  // Map Arabic names to English
  "مضاربة": "Scalping", 
  "سكالبينج": "Scalping",
  "نظرية هيكل السوق": "SMC",
  "نظرية السوق": "ICT",
  "الحساء السلحفائي": "Turtle Soup",
  "جان": "Gann",
  "تقلبات": "Waves",
  "نمطي": "Patterns",
  "حركة السعر": "Price Action",
  "ذكي": "Smart",
  "عادي": "Normal",
  "يومي": "Daily",
  "شبكات عصبية": "Neural Networks",
  "شبكات عصبية متكررة": "RNN",
  "تصفيق زمني": "Time Clustering",
  "تباين متعدد العوامل": "Multi Variance",
  "شمعات مركبة": "Composite Candlestick",
  "تحليل سلوكي": "Behavioral Analysis",
  "فيبوناتشي": "Fibonacci",
  "تحليل فيبوناتشي متقدم": "Fibonacci Advanced",
  "smart": "Smart",
  "daily": "Daily",
  "normal": "Normal",
  "ICT": "ICT",
  "SMC": "SMC",
  "Turtle Soup": "Turtle Soup",
  "Gann": "Gann",
  "Waves": "Waves",
  "Patterns": "Patterns",
  "Price Action": "Price Action",
  "Scalping": "Scalping",
  "Fibonacci": "Fibonacci",
  "Fibonacci Advanced": "Fibonacci Advanced",
  "Neural Networks": "Neural Networks",
  "RNN": "RNN",
  "Time Clustering": "Time Clustering",
  "Multi Variance": "Multi Variance",
  "Composite Candlestick": "Composite Candlestick",
  "Behavioral Analysis": "Behavioral Analysis"
};

/**
 * Get a formatted display name for an analysis type
 */
export const getStrategyName = (type: string): string => {
  if (!type) {
    console.log(`Strategy name lookup for empty type`);
    return "Unknown";
  }
  
  // Debug logging to help diagnose issues
  console.log(`Looking up strategy name for type: "${type}" (${typeof type})`);
  
  // Direct lookup first
  if (type in analysisTypeMap) {
    console.log(`Direct match found for "${type}": ${analysisTypeMap[type]}`);
    return analysisTypeMap[type];
  }
  
  // Handle different case formats and variations
  const normalizedType = typeof type === 'string' 
    ? type.toLowerCase().replace(/_/g, '').trim() 
    : String(type).toLowerCase().trim();
    
  console.log(`Normalized type: "${normalizedType}"`);
  
  for (const key in analysisTypeMap) {
    const normalizedKey = key.toLowerCase().replace(/_/g, '').trim();
    if (normalizedType === normalizedKey) {
      console.log(`Match found after normalization: "${type}" -> "${key}" -> ${analysisTypeMap[key]}`);
      return analysisTypeMap[key];
    }
  }
  
  // If no direct match, check for partial matches
  for (const key in analysisTypeMap) {
    const normalizedKey = key.toLowerCase().replace(/_/g, '').trim();
    if (normalizedType.includes(normalizedKey) || normalizedKey.includes(normalizedType)) {
      console.log(`Partial match found: "${normalizedType}" matches "${normalizedKey}" -> ${analysisTypeMap[key]}`);
      return analysisTypeMap[key];
    }
  }
  
  // For debugging
  console.log(`No match found for analysis type: "${type}" (normalized: "${normalizedType}")`);
  
  // If no match at all, return the original type
  return type;
};
