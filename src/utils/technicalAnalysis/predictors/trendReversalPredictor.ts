
/**
 * محلل نقاط انعكاس الاتجاه
 * هذا المحلل يحدد نقاط الانعكاس المحتملة في الاتجاه بناءً على البيانات التاريخية
 */

interface TrendReversalData {
  probability: number; // احتمالية الانعكاس 0-1
  expectedLevel: number; // المستوى المتوقع للانعكاس
  timeframe: string; // الإطار الزمني المتوقع للانعكاس
  direction: "صاعد" | "هابط"; // اتجاه الانعكاس المتوقع
}

/**
 * تحليل نقاط انعكاس الاتجاه المحتملة
 */
export const analyzeTrendReversalPoints = (
  historicalPrices: number[], 
  currentPrice: number
): TrendReversalData => {
  // حساب متوسط التقلبات
  const volatility = calculateVolatility(historicalPrices);
  
  // تحديد الاتجاه الحالي
  const currentTrend = detectCurrentTrend(historicalPrices, 14);
  
  // عكس الاتجاه لتوقع الانعكاس
  const reversalDirection = currentTrend === "صاعد" ? "هابط" : "صاعد";
  
  // حساب احتمالية الانعكاس بناءً على الزخم والتشبع
  const momentumStrength = calculateMomentumStrength(historicalPrices);
  const overboughtOversold = detectOverboughtOversold(historicalPrices);
  
  let probability = 0.5; // احتمالية افتراضية محايدة
  
  // تعديل الاحتمالية بناءً على قوة الزخم
  if (currentTrend === "صاعد" && momentumStrength > 0.7) {
    probability = Math.min(probability + 0.2, 0.95); // احتمالية أعلى للاستمرار
  } else if (currentTrend === "هابط" && momentumStrength > 0.7) {
    probability = Math.min(probability + 0.2, 0.95); // احتمالية أعلى للاستمرار
  }
  
  // تعديل الاحتمالية بناءً على التشبع
  if ((currentTrend === "صاعد" && overboughtOversold > 0.7) || 
      (currentTrend === "هابط" && overboughtOversold < 0.3)) {
    probability = Math.max(probability - 0.3, 0.05); // احتمالية أقل للاستمرار (أعلى للانعكاس)
  }
  
  // حساب المستوى المتوقع للانعكاس
  let expectedLevel = currentPrice;
  if (reversalDirection === "صاعد") {
    expectedLevel = currentPrice * (1 - volatility * 1.5);
  } else {
    expectedLevel = currentPrice * (1 + volatility * 1.5);
  }
  
  return {
    probability,
    expectedLevel,
    timeframe: determineTimeframeForReversal(historicalPrices),
    direction: reversalDirection
  };
};

/**
 * حساب تقلب الأسعار
 */
const calculateVolatility = (prices: number[]): number => {
  if (prices.length < 2) return 0.01;
  
  let sum = 0;
  for (let i = 1; i < prices.length; i++) {
    const change = Math.abs(prices[i] - prices[i-1]) / prices[i-1];
    sum += change;
  }
  
  return sum / (prices.length - 1);
};

/**
 * كشف الاتجاه الحالي
 */
const detectCurrentTrend = (prices: number[], period: number = 14): "صاعد" | "هابط" => {
  if (prices.length < period) return "صاعد";
  
  const recentPrices = prices.slice(-period);
  const firstHalf = recentPrices.slice(0, Math.floor(period/2));
  const secondHalf = recentPrices.slice(Math.floor(period/2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  return secondAvg > firstAvg ? "صاعد" : "هابط";
};

/**
 * حساب قوة الزخم
 */
const calculateMomentumStrength = (prices: number[]): number => {
  if (prices.length < 10) return 0.5;
  
  const recentPrices = prices.slice(-10);
  const changes = [];
  
  for (let i = 1; i < recentPrices.length; i++) {
    changes.push(recentPrices[i] - recentPrices[i-1]);
  }
  
  // عدد التغييرات الإيجابية
  const positiveChanges = changes.filter(c => c > 0).length;
  
  return positiveChanges / changes.length;
};

/**
 * كشف حالات التشبع الشرائي/البيعي
 */
const detectOverboughtOversold = (prices: number[]): number => {
  if (prices.length < 14) return 0.5;
  
  // محاكاة لحساب RSI مبسط
  const recentPrices = prices.slice(-14);
  const changes = [];
  
  for (let i = 1; i < recentPrices.length; i++) {
    changes.push(recentPrices[i] - recentPrices[i-1]);
  }
  
  const gains = changes.filter(c => c > 0);
  const losses = changes.filter(c => c < 0).map(c => Math.abs(c));
  
  const avgGain = gains.length > 0 ? gains.reduce((a, b) => a + b, 0) / gains.length : 0;
  const avgLoss = losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / losses.length : 0;
  
  if (avgLoss === 0) return 1;
  
  const rs = avgGain / avgLoss;
  return rs / (1 + rs);
};

/**
 * تحديد الإطار الزمني المتوقع للانعكاس
 */
const determineTimeframeForReversal = (prices: number[]): string => {
  // تحديد الإطار الزمني بناءً على تقلب الأسعار
  const volatility = calculateVolatility(prices);
  
  if (volatility > 0.02) {
    return "قريب (1-3 أيام)";
  } else if (volatility > 0.01) {
    return "متوسط (3-7 أيام)";
  } else {
    return "بعيد (7-14 يوم)";
  }
};

