
/**
 * خريطة أنواع التحليل
 * استخدام أنواع تحليل مختلفة للحصول على قيم متنوعة للأهداف ووقف الخسارة
 */

export const analysisTypeToDisplayName: Record<string, string> = {
  // أنواع التحليل الأساسية
  "scalping": "مضاربة",
  "سكالبينج": "مضاربة",
  "مضاربة": "مضاربة",
  
  "smc": "نظرية هيكل السوق",
  "نظريةهيكلالسوق": "نظرية هيكل السوق",
  
  "ict": "نظرية السوق",
  "نظريةالسوق": "نظرية السوق",
  
  "turtlesoup": "الحساء السلحفائي",
  "turtle": "الحساء السلحفائي",
  "الحساءالسلحفائي": "الحساء السلحفائي",
  
  "gann": "جان",
  "جان": "جان",
  
  "waves": "تقلبات",
  "تقلبات": "تقلبات",
  
  "patterns": "نمطي",
  "pattern": "نمطي",
  "نمطي": "نمطي",
  
  "priceaction": "حركة السعر",
  "حركةالسعر": "حركة السعر",
  
  // أنواع التحليل المتقدمة
  "neuralnetworks": "شبكات عصبية",
  "شبكاتعصبية": "شبكات عصبية",
  
  "rnn": "شبكات عصبية متكررة",
  "شبكاتعصبيةمتكررة": "شبكات عصبية متكررة",
  
  "timeclustering": "تصفيق زمني",
  "تصفيقزمني": "تصفيق زمني",
  
  "multivariance": "تباين متعدد العوامل",
  "تباينمتعددالعوامل": "تباين متعدد العوامل",
  
  "compositecandlestick": "شمعات مركبة",
  "شمعاتمركبة": "شمعات مركبة",
  
  "behavioral": "تحليل سلوكي",
  "تحليلسلوكي": "تحليل سلوكي",
  
  "fibonacci": "فيبوناتشي",
  "فيبوناتشي": "فيبوناتشي",
  
  "fibonacciadvanced": "فيبوناتشي متقدم",
  "تحليلفيبوناتشيمتقدم": "فيبوناتشي متقدم",
  
  "ml": "تعلم آلي",
  "تعلمآلي": "تعلم آلي",
  "machinelearning": "تعلم آلي",
  
  "multitimeframe": "متعدد الأطر الزمنية",
  "متعددالأطر": "متعدد الأطر الزمنية",
  "mtf": "متعدد الأطر الزمنية",
  
  "daily": "يومي",
  "يومي": "يومي"
};

/**
 * الحصول على اسم الاستراتيجية المناسب للعرض
 */
export const getStrategyName = (type: string): string => {
  const normalizedType = type.toLowerCase().replace(/_/g, '').trim();
  return analysisTypeToDisplayName[normalizedType] || type;
};

// معاملات توليد نتائج مختلفة بناءً على نوع التحليل
export const analysisTypeWeights: Record<string, {
  stopLossFactor: number,
  targetFactors: number[],
  volatilityFactor: number,
  directionBias: "صاعد" | "هابط" | "محايد" | null
}> = {
  // أنواع التحليل الأساسية مع معاملات متنوعة
  "scalping": {
    stopLossFactor: 0.6,
    targetFactors: [0.5, 0.8, 1.2],
    volatilityFactor: 0.8,
    directionBias: null
  },
  "smc": {
    stopLossFactor: 1.2,
    targetFactors: [1.2, 2.0, 3.0],
    volatilityFactor: 1.5,
    directionBias: null
  },
  "ict": {
    stopLossFactor: 1.4,
    targetFactors: [1.3, 2.2, 3.5],
    volatilityFactor: 1.6,
    directionBias: null
  },
  "turtlesoup": {
    stopLossFactor: 1.3,
    targetFactors: [1.0, 1.8, 2.5],
    volatilityFactor: 1.4,
    directionBias: null
  },
  "gann": {
    stopLossFactor: 1.1,
    targetFactors: [0.8, 1.5, 2.3],
    volatilityFactor: 1.3,
    directionBias: null
  },
  "waves": {
    stopLossFactor: 1.0,
    targetFactors: [0.9, 1.7, 2.4],
    volatilityFactor: 1.2,
    directionBias: null
  },
  "patterns": {
    stopLossFactor: 1.0,
    targetFactors: [0.9, 1.5, 2.1],
    volatilityFactor: 1.1,
    directionBias: null
  },
  "priceaction": {
    stopLossFactor: 0.9,
    targetFactors: [0.7, 1.3, 2.0],
    volatilityFactor: 1.0,
    directionBias: null
  },
  "fibonacci": {
    stopLossFactor: 1.5,
    targetFactors: [0.618, 1.0, 1.618],
    volatilityFactor: 1.7,
    directionBias: null
  },
  "ml": {
    stopLossFactor: 0.8,
    targetFactors: [0.6, 1.0, 1.8],
    volatilityFactor: 0.9,
    directionBias: null
  },
  "multitimeframe": {
    stopLossFactor: 1.2,
    targetFactors: [0.8, 1.5, 2.5],
    volatilityFactor: 1.4,
    directionBias: null
  }
};

