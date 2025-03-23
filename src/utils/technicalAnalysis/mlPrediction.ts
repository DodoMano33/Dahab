
/**
 * وحدة خوارزميات التعلم الآلي للتنبؤ بالاتجاهات
 * هذه الوحدة تستخدم مزيجاً من الخوارزميات الإحصائية وتقنيات التعلم الآلي
 * للتنبؤ باتجاهات الأسعار المستقبلية
 */

import { detectTrend } from './indicators/trendIndicators';
import { calculateVolatility } from './indicators/volatility';

/**
 * تقدير دقة التنبؤ بناءً على حالة السوق الحالية
 * @param prices - مصفوفة الأسعار التاريخية
 * @returns قيمة بين 0 و 1 تمثل مستوى الثقة في التنبؤ
 */
const estimatePredictionConfidence = (prices: number[]): number => {
  if (prices.length < 20) {
    return 0.5; // ثقة متوسطة إذا كانت البيانات غير كافية
  }

  const volatility = calculateVolatility(prices);
  
  // خفض مستوى الثقة عندما يكون التقلب عالياً
  if (volatility > 0.05) {
    return 0.5;
  } else if (volatility > 0.02) {
    return 0.7;
  } else {
    return 0.9;
  }
};

/**
 * التنبؤ بالسعر المستقبلي باستخدام المتوسط المتحرك
 * @param prices - مصفوفة الأسعار التاريخية
 * @param days - عدد الأيام التي يتم أخذها في الحسبان للمتوسط المتحرك
 * @returns السعر المتوقع
 */
const predictPriceWithMA = (prices: number[], days: number = 5): number => {
  if (prices.length < days) {
    return prices[prices.length - 1];
  }
  
  const recentPrices = prices.slice(-days);
  const sum = recentPrices.reduce((acc, price) => acc + price, 0);
  return sum / days;
};

/**
 * التنبؤ باستخدام الانحدار الخطي البسيط
 * @param prices - مصفوفة الأسعار التاريخية
 * @param daysAhead - عدد الأيام للتنبؤ في المستقبل
 * @returns السعر المتوقع
 */
const predictPriceWithLinearRegression = (prices: number[], daysAhead: number = 1): number => {
  if (prices.length < 10) {
    return prices[prices.length - 1];
  }
  
  // استخدام الأسعار الأخيرة فقط للتنبؤ (آخر 30 نقطة سعر)
  const recentPrices = prices.slice(-Math.min(30, prices.length));
  
  // حساب x و y للانحدار الخطي
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  
  for (let i = 0; i < recentPrices.length; i++) {
    sumX += i;
    sumY += recentPrices[i];
    sumXY += i * recentPrices[i];
    sumXX += i * i;
  }
  
  const n = recentPrices.length;
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // التنبؤ بالسعر المستقبلي
  return intercept + slope * (n + daysAhead - 1);
};

/**
 * التنبؤ باتجاه السعر والسعر المستقبلي باستخدام مجموعة من الخوارزميات
 * @param historicalPrices - مصفوفة الأسعار التاريخية
 * @param timeframe - الإطار الزمني المستخدم
 * @param currentPrice - السعر الحالي
 * @param daysAhead - عدد الأيام للتنبؤ في المستقبل
 * @returns كائن يحتوي على بيانات التنبؤ
 */
export const predictFuturePrice = (
  historicalPrices: number[],
  timeframe: string,
  currentPrice: number,
  daysAhead: number = 1
): {
  predictedPrice: number;
  predictedDirection: "صاعد" | "هابط" | "محايد";
  confidence: number;
  algorithm: string;
} => {
  if (!historicalPrices || historicalPrices.length < 10) {
    return {
      predictedPrice: currentPrice,
      predictedDirection: "محايد",
      confidence: 0.5,
      algorithm: "لا توجد بيانات كافية للتنبؤ"
    };
  }
  
  // تحديد الاتجاه الحالي
  const currentTrend = detectTrend(historicalPrices, 14);
  
  // التنبؤ باستخدام المتوسط المتحرك
  const maPrediction = predictPriceWithMA(historicalPrices);
  
  // التنبؤ باستخدام الانحدار الخطي
  const lrPrediction = predictPriceWithLinearRegression(historicalPrices, daysAhead);
  
  // استخدام متوسط التنبؤات
  const finalPrediction = (maPrediction + lrPrediction) / 2;
  
  // حساب مستوى الثقة
  const confidence = estimatePredictionConfidence(historicalPrices);
  
  // تحديد الاتجاه المتوقع
  let predictedDirection: "صاعد" | "هابط" | "محايد";
  
  if (finalPrediction > currentPrice * 1.005) {
    predictedDirection = "صاعد";
  } else if (finalPrediction < currentPrice * 0.995) {
    predictedDirection = "هابط";
  } else {
    predictedDirection = "محايد";
  }
  
  return {
    predictedPrice: Number(finalPrediction.toFixed(2)),
    predictedDirection,
    confidence,
    algorithm: "متوسط خوارزميات متعددة (المتوسط المتحرك، الانحدار الخطي)"
  };
};

/**
 * خوارزمية للتنبؤ بمستويات الدعم والمقاومة المستقبلية
 * @param historicalPrices - مصفوفة الأسعار التاريخية
 * @param currentPrice - السعر الحالي
 * @returns مستويات الدعم والمقاومة المتوقعة
 */
export const predictFutureSupportResistance = (
  historicalPrices: number[],
  currentPrice: number
): {
  futureSupport: number;
  futureResistance: number;
  confidence: number;
} => {
  if (!historicalPrices || historicalPrices.length < 20) {
    return {
      futureSupport: currentPrice * 0.98,
      futureResistance: currentPrice * 1.02,
      confidence: 0.5
    };
  }
  
  // حساب التقلب
  const volatility = calculateVolatility(historicalPrices);
  
  // اختيار نطاق الدعم والمقاومة بناءً على التقلب
  const supportRange = Math.max(0.01, volatility);
  const resistanceRange = Math.max(0.01, volatility);
  
  // التنبؤ بالاتجاه
  const prediction = predictFuturePrice(historicalPrices, "1d", currentPrice);
  
  // تعديل مستويات الدعم والمقاومة بناءً على الاتجاه المتوقع
  let futureSupport: number;
  let futureResistance: number;
  
  if (prediction.predictedDirection === "صاعد") {
    futureSupport = currentPrice * (1 - supportRange * 0.8);
    futureResistance = prediction.predictedPrice * (1 + resistanceRange);
  } else if (prediction.predictedDirection === "هابط") {
    futureSupport = prediction.predictedPrice * (1 - supportRange);
    futureResistance = currentPrice * (1 + resistanceRange * 0.8);
  } else {
    futureSupport = currentPrice * (1 - supportRange);
    futureResistance = currentPrice * (1 + resistanceRange);
  }
  
  return {
    futureSupport: Number(futureSupport.toFixed(2)),
    futureResistance: Number(futureResistance.toFixed(2)),
    confidence: prediction.confidence
  };
};

/**
 * تحليل الإطار الزمني المتعدد باستخدام التعلم الآلي
 * هذه الوظيفة تحلل الاتجاهات والأنماط على عدة أطر زمنية مختلفة
 * ثم تُرجِّح النتائج لإنشاء تنبؤ موحّد
 * 
 * @param historicalPrices - مصفوفة أسعار تاريخية لإطارات زمنية مختلفة
 * @param currentPrice - السعر الحالي
 * @param timeframes - الأطر الزمنية المستخدمة في التحليل
 * @returns تنبؤ شامل عبر الأطر الزمنية المختلفة
 */
export const multiTimeframeAnalysis = (
  historicalPrices: { [timeframe: string]: number[] },
  currentPrice: number,
  timeframes: string[] = ["1h", "4h", "1d"]
): {
  overallDirection: "صاعد" | "هابط" | "محايد";
  predictions: { [timeframe: string]: any };
  confidence: number;
  compositeTarget: number;
  timeframeSyncScore: number;
} => {
  // التأكد من أن لدينا بيانات لجميع الأطر الزمنية
  const validTimeframes = timeframes.filter(tf => 
    historicalPrices[tf] && historicalPrices[tf].length >= 10
  );
  
  if (validTimeframes.length === 0) {
    return {
      overallDirection: "محايد",
      predictions: {},
      confidence: 0.5,
      compositeTarget: currentPrice,
      timeframeSyncScore: 0
    };
  }
  
  // جمع التنبؤات من كل إطار زمني
  const predictions: { [timeframe: string]: any } = {};
  let directionScores = { "صاعد": 0, "هابط": 0, "محايد": 0 };
  let totalConfidence = 0;
  let targetSum = 0;
  
  validTimeframes.forEach(tf => {
    const prediction = predictFuturePrice(historicalPrices[tf], tf, currentPrice);
    predictions[tf] = prediction;
    
    // ترجيح الاتجاه بناءً على الثقة
    directionScores[prediction.predictedDirection] += prediction.confidence;
    totalConfidence += prediction.confidence;
    targetSum += prediction.predictedPrice * prediction.confidence;
  });
  
  // تحديد الاتجاه العام
  let overallDirection: "صاعد" | "هابط" | "محايد" = "محايد";
  if (directionScores["صاعد"] > directionScores["هابط"] && directionScores["صاعد"] > directionScores["محايد"]) {
    overallDirection = "صاعد";
  } else if (directionScores["هابط"] > directionScores["صاعد"] && directionScores["هابط"] > directionScores["محايد"]) {
    overallDirection = "هابط";
  }
  
  // حساب متوسط الثقة
  const avgConfidence = totalConfidence / validTimeframes.length;
  
  // حساب السعر المستهدف المركب
  const compositeTarget = targetSum / totalConfidence;
  
  // حساب درجة التوافق بين الأطر الزمنية
  // (تكون عالية عندما تتفق جميع الأطر الزمنية على نفس الاتجاه)
  const dominantDirection = Object.entries(directionScores).sort((a, b) => b[1] - a[1])[0][0];
  const dominantScore = directionScores[dominantDirection as keyof typeof directionScores];
  const timeframeSyncScore = dominantScore / totalConfidence;
  
  return {
    overallDirection,
    predictions,
    confidence: avgConfidence,
    compositeTarget: Number(compositeTarget.toFixed(2)),
    timeframeSyncScore: Number(timeframeSyncScore.toFixed(2))
  };
};
