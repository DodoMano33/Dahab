
/**
 * وحدة تحليل بيانات الأسعار
 * تتضمن دوال لاستخراج معلومات مفيدة من سلاسل الأسعار
 */

/**
 * تحديد اتجاه السعر بناءً على بيانات تاريخية
 * @param prices سلسلة أسعار تاريخية
 * @param period فترة الحساب (اختياري)
 * @returns نوع الاتجاه: صاعد، هابط، أو محايد
 */
export const detectTrend = (
  prices: number[],
  period: number = 14
): "صاعد" | "هابط" | "محايد" => {
  if (!prices || prices.length < 2) {
    return "محايد";
  }
  
  // استخدام فترة أقصر إذا كانت البيانات غير كافية
  const actualPeriod = Math.min(period, prices.length);
  
  // استخدام البيانات الأخيرة فقط
  const recentPrices = prices.slice(-actualPeriod);
  
  // حساب المتوسط المتحرك البسيط
  const sma = calculateSMA(recentPrices, Math.floor(actualPeriod / 2));
  
  // تحديد الاتجاه بناءً على آخر سعر والمتوسط المتحرك
  const lastPrice = recentPrices[recentPrices.length - 1];
  const lastSMA = sma[sma.length - 1];
  
  if (lastPrice > lastSMA * 1.005) {
    return "صاعد";
  } else if (lastPrice < lastSMA * 0.995) {
    return "هابط";
  } else {
    // تحديد الاتجاه بناءً على ميل الأسعار
    const priceChange = lastPrice - recentPrices[0];
    if (priceChange > lastPrice * 0.01) {
      return "صاعد";
    } else if (priceChange < -lastPrice * 0.01) {
      return "هابط";
    }
  }
  
  return "محايد";
};

/**
 * حساب الدعم والمقاومة بناءً على بيانات الأسعار
 * @param prices بيانات الأسعار التاريخية
 * @param currentPrice السعر الحالي
 * @param direction اتجاه السعر
 * @param timeframe الإطار الزمني
 * @returns مستويات الدعم والمقاومة
 */
export const calculateSupportResistance = (
  prices: number[],
  currentPrice?: number,
  direction?: "صاعد" | "هابط" | "محايد",
  timeframe?: string
): { support: number; resistance: number } => {
  if (!prices || prices.length === 0) {
    return { support: 0, resistance: 0 };
  }
  
  // ترتيب الأسعار تصاعدياً
  const sortedPrices = [...prices].sort((a, b) => a - b);
  
  // تحديد أدنى سعر كدعم وأعلى سعر كمقاومة
  let support = sortedPrices[0];
  let resistance = sortedPrices[sortedPrices.length - 1];
  
  // إذا تم تحديد السعر الحالي، نحاول العثور على أقرب مستويات دعم ومقاومة
  if (currentPrice) {
    const priceIndex = sortedPrices.findIndex(p => p >= currentPrice);
    
    if (priceIndex > 0) {
      support = sortedPrices[Math.max(0, priceIndex - 1)];
    }
    
    if (priceIndex < sortedPrices.length - 1) {
      resistance = sortedPrices[Math.min(sortedPrices.length - 1, priceIndex + 1)];
    }
  }
  
  return { support, resistance };
};

/**
 * حساب مستويات فيبوناتشي ريتريسمنت
 * @param high أعلى سعر في النطاق
 * @param low أدنى سعر في النطاق
 * @param direction اتجاه السوق (اختياري)
 * @returns مصفوفة تحتوي على مستويات فيبوناتشي
 */
export const calculateFibonacciLevels = (
  high: number,
  low: number,
  direction: "صاعد" | "هابط" | "محايد" = "صاعد"
): { level: number; price: number }[] => {
  // مستويات فيبوناتشي الأساسية
  const fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
  const results: { level: number; price: number }[] = [];
  
  try {
    // التأكد من أن القيم صحيحة
    if (isNaN(high) || isNaN(low) || high <= low) {
      console.warn("قيم غير صالحة لحساب مستويات فيبوناتشي", { high, low });
      return [];
    }
    
    const range = high - low;
    
    // حساب المستويات بناءً على الاتجاه
    if (direction === "صاعد") {
      // في الاتجاه الصاعد، نحسب المستويات من الأسفل إلى الأعلى
      for (const level of fibLevels) {
        const price = parseFloat((low + range * level).toFixed(2));
        results.push({ level, price });
      }
    } else {
      // في الاتجاه الهابط، نحسب المستويات من الأعلى إلى الأسفل
      for (const level of fibLevels) {
        const price = parseFloat((high - range * level).toFixed(2));
        results.push({ level, price });
      }
    }
    
    return results;
  } catch (error) {
    console.error("خطأ في حساب مستويات فيبوناتشي:", error);
    return [];
  }
};

/**
 * حساب تقلب السعر على مدى فترة زمنية معينة
 * @param prices بيانات الأسعار التاريخية
 * @param period فترة الحساب (اختياري، الافتراضي 14)
 * @returns نسبة التقلب (0-1)
 */
export const calculateVolatility = (
  prices: number[],
  period: number = 14
): number => {
  if (!prices || prices.length < 2) {
    return 0.01; // قيمة افتراضية للتقلب
  }
  
  // استخدام فترة أقصر إذا كانت البيانات غير كافية
  const actualPeriod = Math.min(period, prices.length - 1);
  
  // حساب التغييرات اليومية كنسبة مئوية
  const dailyChanges: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    const percentChange = Math.abs((prices[i] - prices[i-1]) / prices[i-1]);
    dailyChanges.push(percentChange);
  }
  
  // استخدام البيانات الأخيرة فقط
  const recentChanges = dailyChanges.slice(-actualPeriod);
  
  // حساب متوسط التغييرات
  const avgChange = recentChanges.reduce((sum, change) => sum + change, 0) / recentChanges.length;
  
  return avgChange;
};

/**
 * حساب المتوسط المتحرك البسيط (SMA)
 * @param prices بيانات الأسعار
 * @param period فترة الحساب
 * @returns مصفوفة بقيم المتوسط المتحرك
 */
export const calculateSMA = (
  prices: number[],
  period: number
): number[] => {
  if (prices.length < period) {
    return prices;
  }
  
  const sma: number[] = [];
  for (let i = period - 1; i < prices.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += prices[i - j];
    }
    sma.push(sum / period);
  }
  
  return sma;
};
