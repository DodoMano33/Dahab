
/**
 * وحدة حساب التقلب
 * تتضمن خوارزميات مختلفة لقياس تقلب السعر
 */

/**
 * حساب التقلب البسيط باستخدام الانحراف المعياري المعياري
 * @param prices - مصفوفة الأسعار التاريخية
 * @param period - الفترة الزمنية للحساب (الافتراضي: 14)
 * @returns قيمة التقلب كنسبة مئوية (بين 0 و 1)
 */
export function calculateVolatility(
  prices: number[],
  period: number = 14
): number {
  if (prices.length < period) {
    return 0;
  }
  
  // حساب قيم العوائد اليومية
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  
  // حساب متوسط العوائد
  const recentReturns = returns.slice(-period);
  const meanReturn = recentReturns.reduce((sum, ret) => sum + ret, 0) / period;
  
  // حساب الانحراف المعياري للعوائد
  const variance = recentReturns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / period;
  const stdDev = Math.sqrt(variance);
  
  // تطبيع القيمة إلى نطاق منطقي (0-1)
  // استخدام 0.1 كقيمة قياسية للتقلب (10% سنويًا يعادل ~0.6% يوميًا)
  const normalizedVolatility = Math.min(1, stdDev / 0.006);
  
  return normalizedVolatility;
}

/**
 * حساب مؤشر التقلب النسبي
 * @param prices - مصفوفة الأسعار التاريخية
 * @param shortPeriod - الفترة القصيرة للتقلب (الافتراضي: 5)
 * @param longPeriod - الفترة الطويلة للتقلب (الافتراضي: 20)
 * @returns قيمة مؤشر التقلب النسبي (مؤشر > 1 يشير إلى تقلب متزايد)
 */
export function calculateRelativeVolatilityIndex(
  prices: number[],
  shortPeriod: number = 5,
  longPeriod: number = 20
): number {
  if (prices.length < longPeriod) {
    return 1; // قيمة محايدة
  }
  
  const shortTermVolatility = calculateVolatility(prices, shortPeriod);
  const longTermVolatility = calculateVolatility(prices, longPeriod);
  
  // نسبة التقلب قصير المدى إلى التقلب طويل المدى
  return shortTermVolatility / (longTermVolatility === 0 ? 0.0001 : longTermVolatility);
}

/**
 * حساب مؤشر التقلب المركب
 * يجمع بين عدة مقاييس للتقلب لتوفير قياس أكثر شمولاً
 * @param prices - مصفوفة الأسعار التاريخية
 * @returns قيمة مؤشر التقلب المركب (بين 0 و 1)
 */
export function calculateVolatilityIndex(
  prices: number[]
): number {
  if (prices.length < 20) {
    return 0.5; // قيمة متوسطة افتراضية
  }
  
  // حساب التقلب المطلق
  const absVolatility = calculateVolatility(prices);
  
  // حساب مدى السعر كنسبة من السعر الحالي
  const highestPrice = Math.max(...prices.slice(-20));
  const lowestPrice = Math.min(...prices.slice(-20));
  const currentPrice = prices[prices.length - 1];
  const priceRange = (highestPrice - lowestPrice) / currentPrice;
  
  // حساب متوسط التغير اليومي المطلق
  let avgDailyChange = 0;
  for (let i = 1; i < Math.min(10, prices.length); i++) {
    avgDailyChange += Math.abs(prices[prices.length - i] - prices[prices.length - i - 1]) / prices[prices.length - i - 1];
  }
  avgDailyChange /= Math.min(10, prices.length - 1);
  
  // دمج المقاييس الثلاثة مع أوزان متساوية
  const compositeVolatility = (
    absVolatility * 0.4 + 
    Math.min(1, priceRange * 10) * 0.3 + 
    Math.min(1, avgDailyChange * 50) * 0.3
  );
  
  return compositeVolatility;
}

/**
 * حساب نطاق بولينجر باند النسبي
 * مؤشر لقياس التقلب باستخدام عرض نطاق بولينجر باند
 * @param prices - مصفوفة الأسعار التاريخية
 * @param period - فترة الحساب (الافتراضي: 20)
 * @param stdDev - عدد الانحرافات المعيارية (الافتراضي: 2)
 * @returns العرض النسبي لنطاق بولينجر باند
 */
export function calculateBollingerBandWidth(
  prices: number[],
  period: number = 20,
  stdDev: number = 2
): number {
  if (prices.length < period) {
    return 0;
  }
  
  // حساب المتوسط المتحرك البسيط
  const recentPrices = prices.slice(-period);
  const sma = recentPrices.reduce((sum, price) => sum + price, 0) / period;
  
  // حساب الانحراف المعياري
  const variance = recentPrices.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
  const sigma = Math.sqrt(variance);
  
  // حساب الحدود العليا والسفلى
  const upperBand = sma + stdDev * sigma;
  const lowerBand = sma - stdDev * sigma;
  
  // حساب العرض النسبي
  return (upperBand - lowerBand) / sma;
}
