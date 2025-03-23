
/**
 * وحدة حساب مؤشرات التقلب والتذبذب في الأسعار
 */

/**
 * حساب تقلب الأسعار (الانحراف المعياري النسبي)
 * @param prices - مصفوفة الأسعار التاريخية
 * @param window - عدد الفترات المستخدمة لحساب التقلب (الافتراضي: 14)
 * @returns قيمة التقلب (الانحراف المعياري النسبي)
 */
export const calculateVolatility = (prices: number[], window: number = 14): number => {
  if (!prices || prices.length < window) {
    return 0;
  }

  // استخدام النافذة المحددة من البيانات
  const recentPrices = prices.slice(-window);
  
  // حساب المتوسط
  const mean = recentPrices.reduce((sum, price) => sum + price, 0) / window;
  
  // حساب مجموع مربعات الاختلافات
  const squaredDiffsSum = recentPrices.reduce((sum, price) => {
    const diff = price - mean;
    return sum + diff * diff;
  }, 0);
  
  // حساب الانحراف المعياري
  const standardDeviation = Math.sqrt(squaredDiffsSum / window);
  
  // الانحراف المعياري النسبي (كنسبة مئوية من المتوسط)
  return standardDeviation / mean;
};

/**
 * حساب مدى حركة السعر (True Range)
 * يتطلب بيانات الشموع (OHLC)
 * @param high - مصفوفة أسعار الارتفاع
 * @param low - مصفوفة أسعار الانخفاض
 * @param close - مصفوفة أسعار الإغلاق
 * @returns مصفوفة قيم مدى حركة السعر الحقيقي
 */
export const calculateTrueRange = (
  high: number[],
  low: number[],
  close: number[]
): number[] => {
  if (!high || !low || !close || high.length !== low.length || low.length !== close.length) {
    return [];
  }
  
  const trueRanges: number[] = [];
  
  for (let i = 1; i < high.length; i++) {
    const previousClose = close[i - 1];
    
    // حساب ثلاث قيم محتملة لمدى حركة السعر
    const range1 = high[i] - low[i]; // الارتفاع - الانخفاض الحالي
    const range2 = Math.abs(high[i] - previousClose); // الارتفاع الحالي - الإغلاق السابق
    const range3 = Math.abs(low[i] - previousClose); // الانخفاض الحالي - الإغلاق السابق
    
    // اختيار القيمة الأكبر
    const trueRange = Math.max(range1, range2, range3);
    trueRanges.push(trueRange);
  }
  
  return trueRanges;
};

/**
 * حساب مؤشر متوسط مدى الحركة (ATR)
 * @param high - مصفوفة أسعار الارتفاع
 * @param low - مصفوفة أسعار الانخفاض
 * @param close - مصفوفة أسعار الإغلاق
 * @param period - فترة حساب المتوسط (الافتراضي: 14)
 * @returns مصفوفة قيم متوسط مدى الحركة
 */
export const calculateATR = (
  high: number[],
  low: number[],
  close: number[],
  period: number = 14
): number[] => {
  if (!high || !low || !close || high.length < period + 1) {
    return [];
  }
  
  const trueRanges = calculateTrueRange(high, low, close);
  const atrValues: number[] = [];
  
  // حساب المتوسط الأولي
  let atr = trueRanges.slice(0, period).reduce((sum, tr) => sum + tr, 0) / period;
  atrValues.push(atr);
  
  // حساب باقي القيم باستخدام الصيغة المتكررة
  for (let i = period; i < trueRanges.length; i++) {
    atr = ((atr * (period - 1)) + trueRanges[i]) / period;
    atrValues.push(atr);
  }
  
  return atrValues;
};

/**
 * تحديد ما إذا كان السوق متقلبًا بشكل غير عادي
 * @param prices - مصفوفة الأسعار التاريخية
 * @param volatilityThreshold - عتبة التقلب (الافتراضي: 0.02 أو 2%)
 * @returns boolean - ما إذا كان السوق متقلبًا بشكل غير عادي
 */
export const isHighlyVolatile = (
  prices: number[],
  volatilityThreshold: number = 0.02
): boolean => {
  const volatility = calculateVolatility(prices);
  return volatility > volatilityThreshold;
};
