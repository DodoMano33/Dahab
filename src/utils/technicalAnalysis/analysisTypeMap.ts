
/**
 * Maps analysis type keys to their display names
 */
export const analysisTypeMap: Record<string, string> = {
  "scalping": "مضاربة",
  "smc": "نظرية هيكل السوق",
  "ict": "نظرية السوق",
  "turtleSoup": "الحساء السلحفائي",
  "turtle soup": "الحساء السلحفائي",
  "turtle_soup": "الحساء السلحفائي",
  "turtle": "الحساء السلحفائي",
  "gann": "جان",
  "waves": "تقلبات",
  "patterns": "نمطي",
  "pattern": "نمطي",
  "priceAction": "حركة السعر",
  "price action": "حركة السعر",
  "price_action": "حركة السعر",
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
  "سكالبينج": "مضاربة",
  "نظرية هيكل السوق": "نظرية هيكل السوق",
  "نظرية السوق": "نظرية السوق",
  "الحساء السلحفائي": "الحساء السلحفائي",
  "جان": "جان",
  "تقلبات": "تقلبات",
  "نمطي": "نمطي",
  "حركة السعر": "حركة السعر",
  "ذكي": "ذكي",
  "عادي": "عادي",
  "يومي": "يومي",
  "smart": "ذكي",
  "daily": "يومي",
  "normal": "عادي",
  "ICT": "نظرية السوق",
  "SMC": "نظرية هيكل السوق",
  "Turtle Soup": "الحساء السلحفائي",
  "Gann": "جان",
  "Waves": "تقلبات",
  "Patterns": "نمطي",
  "Price Action": "حركة السعر"
};

/**
 * Get a formatted display name for an analysis type
 */
export const getStrategyName = (type: string): string => {
  if (!type) {
    console.log(`Strategy name lookup for empty type`);
    return "غير محدد";
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
