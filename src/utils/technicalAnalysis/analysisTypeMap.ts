
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
  // If the type matches a key in the analysisTypeMap, return the mapped value
  if (analysisTypeMap[type]) {
    return analysisTypeMap[type];
  }
  
  // If the type is already in Arabic, return it as is
  const arabicTypes = Object.values(analysisTypeMap);
  if (arabicTypes.includes(type)) {
    return type;
  }
  
  // Handle special cases that might be in the database with different formats
  const lowerCaseType = type.toLowerCase();
  if (lowerCaseType === 'fibonacci' || lowerCaseType === 'فيبوناتشي') {
    return 'فيبوناتشي';
  }
  if (lowerCaseType.includes('advanced') || lowerCaseType.includes('متقدم')) {
    return 'تحليل فيبوناتشي متقدم';
  }
  if (lowerCaseType.includes('neural') || lowerCaseType.includes('شبكات')) {
    return lowerCaseType.includes('rnn') || lowerCaseType.includes('متكررة') 
      ? 'شبكات عصبية متكررة' 
      : 'شبكات عصبية';
  }
  if (lowerCaseType.includes('time') || lowerCaseType.includes('تصفيق')) {
    return 'تصفيق زمني';
  }
  if (lowerCaseType.includes('variance') || lowerCaseType.includes('تباين')) {
    return 'تباين متعدد العوامل';
  }
  if (lowerCaseType.includes('composite') || lowerCaseType.includes('شمعات')) {
    return 'شمعات مركبة';
  }
  if (lowerCaseType.includes('behavioral') || lowerCaseType.includes('سلوكي')) {
    return 'تحليل سلوكي';
  }
  
  // If no match is found, return the original type
  return type;
};
