
/**
 * Maps the analysis type to the corresponding Supabase enum value
 * This is necessary because the Supabase enum has specific values that must match
 */
export const mapToAnalysisType = (analysisType: string): string => {
  // اطبع نوع التحليل المرسل للتشخيص
  console.log("Analysis type before mapping:", analysisType);
  
  if (!analysisType) return "عادي";
  
  // Normalize the input
  const normalizedType = analysisType.toLowerCase().replace(/_/g, '').trim();
  
  // Make sure to match exactly what's expected in the database
  if (normalizedType.includes('نمطي') || normalizedType.includes('pattern')) return "نمطي";
  if (normalizedType.includes('تقلبات') || normalizedType.includes('wave')) return "تقلبات";
  if (normalizedType.includes('جان') || normalizedType.includes('gann')) return "جان";
  if (normalizedType.includes('الحساءالسلحفائي') || normalizedType.includes('turtlesoup') || normalizedType.includes('turtle')) return "الحساء السلحفائي";
  if (normalizedType.includes('نظريةالسوق') || normalizedType.includes('ict')) return "نظرية السوق";
  if (normalizedType.includes('نظريةهيكلالسوق') || normalizedType.includes('smc')) return "نظرية هيكل السوق";
  if (normalizedType.includes('مضاربة') || normalizedType.includes('scalping') || normalizedType.includes('سكالبينج')) return "سكالبينج";
  if (normalizedType.includes('حركةالسعر') || normalizedType.includes('priceaction')) return "حركة السعر";
  if (normalizedType.includes('ذكي') || normalizedType.includes('smart')) return "ذكي";
  
  // Map the new analysis types
  if (normalizedType.includes('شبكاتعصبيةمتكررة') || normalizedType.includes('rnn')) return "شبكات عصبية متكررة";
  if (normalizedType.includes('شبكاتعصبية') || normalizedType.includes('neural')) return "شبكات عصبية";
  if (normalizedType.includes('تصفيقزمني') || normalizedType.includes('timecluster')) return "تصفيق زمني"; 
  if (normalizedType.includes('تباينمتعدد') || normalizedType.includes('multivariance')) return "تباين متعدد العوامل"; 
  if (normalizedType.includes('شمعاتمركبة') || normalizedType.includes('composite')) return "شمعات مركبة"; 
  if (normalizedType.includes('تحليلسلوكي') || normalizedType.includes('behavioral') || normalizedType === 'behavioral') return "تحليل سلوكي";
  
  // Fibonacci analysis - check advanced first
  if (normalizedType.includes('فيبوناتشيمتقدم') || normalizedType.includes('تحليلفيبوناتشيمتقدم') || 
     normalizedType.includes('fibonacciadvanced') || normalizedType.includes('advancedfibonacci') ||
     normalizedType === 'fibonacci_advanced') {
    return "فيبوناتشي";  // Map to standard fibonacci type in database
  }
  
  if (normalizedType.includes('فيبوناتشي') || normalizedType.includes('fibonacci') || normalizedType === 'fibonacci') {
    return "فيبوناتشي";
  }
  
  if (normalizedType.includes('يومي') || normalizedType.includes('daily')) {
    return "يومي";
  }
  
  if (normalizedType.includes('normal') || normalizedType.includes('عادي')) {
    return "عادي";
  }
  
  // أطبع النوع غير المعروف للتشخيص
  console.log(`Unknown analysis type: "${analysisType}", normalized: "${normalizedType}", original type: ${typeof analysisType}`);
  
  // استخدم النوع الأصلي إذا كان مسموحًا به في قاعدة البيانات
  return "عادي"; // Default to normal type if unknown
};

// Add the missing function for AnalysisPerformer
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
