
/**
 * Maps the analysis type to the corresponding Supabase enum value
 * This is necessary because the Supabase enum has specific values that must match
 */
export const mapToAnalysisType = (analysisType: string): string => {
  // Debug log for analysis type
  console.log("Analysis type before mapping:", analysisType);
  
  if (!analysisType) return "Normal";
  
  // Normalize the input
  const normalizedType = analysisType.toLowerCase().replace(/_/g, '').trim();
  
  // Make sure to match exactly what's expected in the database
  if (normalizedType.includes('patterns') || normalizedType.includes('نمطي')) return "Patterns";
  if (normalizedType.includes('waves') || normalizedType.includes('تقلبات')) return "Waves";
  if (normalizedType.includes('gann') || normalizedType.includes('جان')) return "Gann";
  if (normalizedType.includes('turtlesoup') || normalizedType.includes('الحساءالسلحفائي') || normalizedType.includes('turtle')) return "Turtle Soup";
  if (normalizedType.includes('ict') || normalizedType.includes('نظريةالسوق')) return "ICT";
  if (normalizedType.includes('smc') || normalizedType.includes('نظريةهيكلالسوق')) return "SMC";
  if (normalizedType.includes('scalping') || normalizedType.includes('مضاربة') || normalizedType.includes('سكالبينج')) return "Scalping";
  if (normalizedType.includes('priceaction') || normalizedType.includes('حركةالسعر')) return "Price Action";
  if (normalizedType.includes('smart') || normalizedType.includes('ذكي')) return "Smart";
  
  // Map the new analysis types
  if (normalizedType.includes('recurrent') || normalizedType.includes('rnn') || normalizedType.includes('شبكاتعصبيةمتكررة')) return "Recurrent Neural Networks";
  if (normalizedType.includes('neural') || normalizedType.includes('شبكاتعصبية')) return "Neural Networks";
  if (normalizedType.includes('timecluster') || normalizedType.includes('تصفيقزمني')) return "Time Clustering"; 
  if (normalizedType.includes('multivariance') || normalizedType.includes('تباينمتعدد')) return "Multi Variance"; 
  if (normalizedType.includes('composite') || normalizedType.includes('شمعاتمركبة')) return "Composite Candlestick"; 
  if (normalizedType.includes('behavioral') || normalizedType.includes('تحليلسلوكي')) return "Behavioral Analysis";
  
  // Fibonacci analysis - check advanced first
  if (normalizedType.includes('advancedfibonacci') || normalizedType.includes('fibonacciadvanced') || 
     normalizedType.includes('تحليلفيبوناتشيمتقدم')) {
    return "Advanced Fibonacci";
  }
  
  if (normalizedType.includes('fibonacci') || normalizedType.includes('فيبوناتشي')) {
    return "Fibonacci";
  }
  
  if (normalizedType.includes('daily') || normalizedType.includes('يومي')) {
    return "Daily";
  }
  
  if (normalizedType.includes('normal') || normalizedType.includes('عادي')) {
    return "Normal";
  }
  
  // Print unknown type for debugging
  console.log(`Unknown analysis type: "${analysisType}", normalized: "${normalizedType}", original type: ${typeof analysisType}`);
  
  // Use original type if allowed in database
  return analysisType; 
};

/**
 * Map analysis type to configuration object
 */
export const mapAnalysisTypeToConfig = (analysisType: string) => {
  const normalizedType = analysisType ? analysisType.toLowerCase().replace(/_/g, '').trim() : '';
  
  return {
    isScalping: normalizedType.includes('scalping') || normalizedType.includes('مضاربة') || normalizedType.includes('سكالبينج'),
    isSMC: normalizedType.includes('smc') || normalizedType.includes('نظريةهيكلالسوق'),
    isICT: normalizedType.includes('ict') || normalizedType.includes('نظريةالسوق'),
    isTurtleSoup: normalizedType.includes('turtlesoup') || normalizedType.includes('الحساءالسلحفائي') || normalizedType.includes('turtle'),
    isGann: normalizedType.includes('gann') || normalizedType.includes('جان'),
    isWaves: normalizedType.includes('waves') || normalizedType.includes('تقلبات'),
    isPatternAnalysis: normalizedType.includes('pattern') || normalizedType.includes('نمطي'),
    isPriceAction: normalizedType.includes('priceaction') || normalizedType.includes('حركةالسعر'),
    isNeuralNetwork: normalizedType.includes('neuralnetwork') || normalizedType.includes('شبكاتعصبية'),
    isRNN: normalizedType.includes('rnn') || normalizedType.includes('شبكاتعصبيةمتكررة'),
    isTimeClustering: normalizedType.includes('timeclustering') || normalizedType.includes('تصفيقزمني'),
    isMultiVariance: normalizedType.includes('multivariance') || normalizedType.includes('تباينمتعدد'),
    isCompositeCandlestick: normalizedType.includes('compositecandlestick') || normalizedType.includes('شمعاتمركبة'),
    isBehavioral: normalizedType.includes('behavioral') || normalizedType.includes('تحليلسلوكي'),
    isFibonacci: normalizedType.includes('fibonacci') && !normalizedType.includes('advanced') || 
                normalizedType.includes('فيبوناتشي') && !normalizedType.includes('متقدم'),
    isFibonacciAdvanced: normalizedType.includes('fibonacciadvanced') || normalizedType.includes('تحليلفيبوناتشيمتقدم')
  };
};
