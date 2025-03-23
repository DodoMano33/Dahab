/**
 * ملف التصدير الرئيسي لوحدة التحليل الفني
 * يجمع جميع وظائف التحليل الفني من كافة الملفات
 */

export * from './indicators/volatility';
export * from './indicators/riskManagement';
export * from './timeUtils';
export * from './patternRecognition';
export * from './analysisTypeMap';
export * from './analysisExecutor';
export * from './predictors/trendReversalPredictor';
export * from './predictors/patternAnalysisEnhanced';
export * from './predictors/multiTimeframePredictor';
export * from './calculations'; // Export the calculations module

/**
 * حساب نقطة وقف الخسارة المثالية بناءً على نوع التحليل والإطار الزمني والسعر
 */
export const calculateOptimalStopLoss = (
  price: number, 
  direction: 'صاعد' | 'هابط',
  analysisType: string,
  timeframe: string,
  support?: number,
  resistance?: number
): number => {
  // معاملات التعديل بناءً على نوع التحليل
  const typeMultipliers: Record<string, number> = {
    scalping: 0.6, // وقف خسارة أقرب للمضاربة
    سكالبينج: 0.6,
    مضاربة: 0.6,
    smc: 1.2, // وقف خسارة أبعد لنظرية هيكل السوق
    نظريةهيكلالسوق: 1.2,
    ict: 1.4, // وقف خسارة أبعد لنظرية السوق
    نظريةالسوق: 1.4,
    turtlesoup: 1.3, // وقف خسارة متوسط للحساء السلحفائي
    الحساءالسلحفائي: 1.3,
    gann: 1.1, // وقف خسارة متوسط لجان
    جان: 1.1,
    fibonacci: 1.5, // وقف خسارة أبعد لفيبوناتشي
    فيبوناتشي: 1.5,
    priceaction: 0.9, // وقف خسارة متوسط لحركة السعر
    حركةالسعر: 0.9,
    pattern: 1.0, // وقف خسارة قياسي للأنماط
    نمطي: 1.0,
    ml: 0.8, // وقف خسارة أقرب للتعلم الآلي
    تعلمآلي: 0.8
  };
  
  // معاملات التعديل بناءً على الإطار الزمني
  const timeframeMultipliers: Record<string, number> = {
    '1m': 0.3,
    '5m': 0.4,
    '15m': 0.5,
    '30m': 0.6,
    '1h': 0.8,
    '2h': 0.9,
    '4h': 1.0,
    '1d': 1.2,
    'daily': 1.2,
    '1w': 1.5,
    'weekly': 1.5
  };
  
  // الحصول على المضاعفات المناسبة، أو استخدام قيم افتراضية
  const normalizedType = analysisType.toLowerCase().replace(/_/g, '').trim();
  const normalizedTimeframe = timeframe.toLowerCase().trim();
  
  const typeMultiplier = typeMultipliers[normalizedType] || 1.0;
  const timeMultiplier = timeframeMultipliers[normalizedTimeframe] || 1.0;
  
  // نسبة وقف الخسارة الأساسية
  const baseStopPercent = 0.01 * typeMultiplier * timeMultiplier;
  
  // استخدام مستويات الدعم والمقاومة إذا كانت متوفرة
  if (support && resistance && direction === 'صاعد') {
    // في الاتجاه الصاعد، نضع وقف الخسارة أسفل مستوى الدعم
    return support * (1 - 0.005 * typeMultiplier);
  } else if (support && resistance && direction === 'هابط') {
    // في الاتجاه الهابط، نضع وقف الخسارة فوق مستوى المقاومة
    return resistance * (1 + 0.005 * typeMultiplier);
  }
  
  // إذا لم تكن مستويات الدعم والمقاومة متوفرة، نستخدم نسبة مئوية من السعر
  if (direction === 'صاعد') {
    return price * (1 - baseStopPercent);
  } else {
    return price * (1 + baseStopPercent);
  }
};

/**
 * حساب الأهداف المثالية بناءً على نوع التحليل والإطار الزمني والسعر
 */
export const calculateOptimalTargets = (
  price: number,
  direction: 'صاعد' | 'هابط',
  analysisType: string,
  timeframe: string,
  support?: number,
  resistance?: number
): number[] => {
  // معاملات التعديل بناءً على نوع التحليل
  const typeMultipliers: Record<string, number[]> = {
    scalping: [0.5, 0.8, 1.2], // أهداف قريبة للمضاربة
    سكالبينج: [0.5, 0.8, 1.2],
    مضاربة: [0.5, 0.8, 1.2],
    smc: [1.2, 2.0, 3.0], // أهداف بعيدة لنظرية هيكل السوق
    نظريةهيكلالسوق: [1.2, 2.0, 3.0],
    ict: [1.3, 2.2, 3.5], // أهداف بعيدة لنظرية السوق
    نظريةالسوق: [1.3, 2.2, 3.5],
    turtlesoup: [1.0, 1.8, 2.5], // أهداف متوسطة للحساء السلحفائي
    الحساءالسلحفائي: [1.0, 1.8, 2.5],
    gann: [0.8, 1.5, 2.3], // أهداف متنوعة لجان
    جان: [0.8, 1.5, 2.3],
    fibonacci: [0.618, 1.0, 1.618], // مستويات فيبوناتشي
    فيبوناتشي: [0.618, 1.0, 1.618],
    priceaction: [0.7, 1.3, 2.0], // أهداف متوسطة لحركة السعر
    حركةالسعر: [0.7, 1.3, 2.0],
    pattern: [0.9, 1.5, 2.1], // أهداف قياسية للأنماط
    نمطي: [0.9, 1.5, 2.1],
    ml: [0.6, 1.0, 1.8], // أهداف متنوعة للتعلم الآلي
    تعلمآلي: [0.6, 1.0, 1.8]
  };
  
  // معاملات التعديل بناءً على الإطار الزمني
  const timeframeMultipliers: Record<string, number> = {
    '1m': 0.3,
    '5m': 0.4,
    '15m': 0.5,
    '30m': 0.6,
    '1h': 0.8,
    '2h': 0.9,
    '4h': 1.0,
    '1d': 1.2,
    'daily': 1.2,
    '1w': 1.5,
    'weekly': 1.5
  };
  
  // الحصول على المضاعفات المناسبة، أو استخدام قيم افتراضية
  const normalizedType = analysisType.toLowerCase().replace(/_/g, '').trim();
  const normalizedTimeframe = timeframe.toLowerCase().trim();
  
  const targetMultipliers = typeMultipliers[normalizedType] || [0.7, 1.4, 2.0];
  const timeMultiplier = timeframeMultipliers[normalizedTimeframe] || 1.0;
  
  // استخدام مستويات الدعم والمقاومة إذا كانت متوفرة
  if (support && resistance) {
    const range = Math.abs(resistance - support);
    
    if (direction === 'صاعد') {
      // في الاتجاه الصاعد، الأهداف فوق المقاومة
      return targetMultipliers.map((multiplier, index) => 
        resistance + (range * multiplier * timeMultiplier * (index + 1) * 0.2)
      );
    } else {
      // في الاتجاه الهابط، الأهداف تحت الدعم
      return targetMultipliers.map((multiplier, index) => 
        support - (range * multiplier * timeMultiplier * (index + 1) * 0.2)
      );
    }
  }
  
  // إذا لم تكن مستويات الدعم والمقاومة متوفرة، نستخدم نسبة مئوية من السعر
  if (direction === 'صاعد') {
    return targetMultipliers.map(multiplier => 
      price * (1 + (0.01 * multiplier * timeMultiplier))
    );
  } else {
    return targetMultipliers.map(multiplier => 
      price * (1 - (0.01 * multiplier * timeMultiplier))
    );
  }
};
