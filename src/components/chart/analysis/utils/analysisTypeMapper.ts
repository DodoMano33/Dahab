
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
  
  // توحيد الأنواع وفقًا للقائمة المطلوبة (16 نوع)
  if (normalizedType.includes('pattern') || normalizedType.includes('نمطي')) return "نمطي";
  if (normalizedType.includes('waves') || normalizedType.includes('تقلبات')) return "تقلبات";
  if (normalizedType.includes('gann') || normalizedType.includes('جان')) return "جان";
  if (normalizedType.includes('turtle') || normalizedType.includes('turtlesoup') || normalizedType.includes('الحساءالسلحفائي')) return "الحساء السلحفائي";
  if (normalizedType.includes('ict') || normalizedType.includes('نظريةالسوق')) return "نظرية السوق";
  if (normalizedType.includes('smc') || normalizedType.includes('هيكلالسوق')) return "نظرية هيكل السوق";
  if (normalizedType.includes('scalping') || normalizedType.includes('سكالبينج') || normalizedType.includes('مضاربة')) return "مضاربة";
  if (normalizedType.includes('priceaction') || normalizedType.includes('حركةالسعر')) return "حركة السعر";
  
  // أنواع التحليل المتقدمة
  if (normalizedType.includes('neuralnetwork') || normalizedType.includes('شبكاتعصبية')) return "شبكات عصبية";
  if (normalizedType.includes('rnn') || normalizedType.includes('شبكاتعصبيةمتكررة')) return "شبكات عصبية متكررة";
  if (normalizedType.includes('timecluster') || normalizedType.includes('تصفيقزمني')) return "تصفيق زمني";
  if (normalizedType.includes('multivariance') || normalizedType.includes('تباينمتعدد')) return "تباين متعدد العوامل";
  if (normalizedType.includes('composite') || normalizedType.includes('شمعاتمركبة')) return "شمعات مركبة";
  if (normalizedType.includes('behavioral') || normalizedType.includes('سلوكي')) return "تحليل سلوكي";
  
  // فيبوناتشي المتقدم (ضع هذا قبل فيبوناتشي العادي)
  if (normalizedType.includes('fibonacciadvanced') || normalizedType.includes('فيبوناتشيمتقدم')) return "فيبوناتشي متقدم";
  
  // فيبوناتشي العادي
  if (normalizedType.includes('fibonacci') || normalizedType.includes('فيبوناتشي')) return "فيبوناتشي";
  
  // التحليل العادي
  if (normalizedType.includes('normal') || normalizedType.includes('عادي')) return "عادي";
  
  console.log(`نوع غير معروف: "${analysisType}", normalized: "${normalizedType}"`);
  
  // استخدم النوع الأصلي إذا كان مسموحًا به في قاعدة البيانات
  return analysisType;
};

// إعداد التكوين لأنواع التحليل
export const mapAnalysisTypeToConfig = (analysisType: string) => {
  const normalizedType = analysisType ? analysisType.toLowerCase().replace(/_/g, '').trim() : '';
  
  return {
    isScalping: normalizedType.includes('scalping') || normalizedType.includes('مضاربة') || normalizedType.includes('سكالبينج'),
    isSMC: normalizedType.includes('smc') || normalizedType.includes('هيكلالسوق'),
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
    isBehavioral: normalizedType.includes('behavioral') || normalizedType.includes('سلوكي'),
    isFibonacci: (normalizedType.includes('fibonacci') && !normalizedType.includes('advanced')) || 
                (normalizedType.includes('فيبوناتشي') && !normalizedType.includes('متقدم')),
    isFibonacciAdvanced: normalizedType.includes('fibonacciadvanced') || 
                        normalizedType.includes('فيبوناتشيمتقدم') || 
                        (normalizedType.includes('fibonacci') && normalizedType.includes('advanced'))
  };
};
