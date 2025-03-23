
/**
 * وحدة مؤشرات اتجاه السعر
 * مجموعة من الدوال المتخصصة في اكتشاف وتحليل اتجاهات الأسعار
 */

/**
 * تحديد اتجاه السعر العام باستخدام المتوسطات المتحركة
 * @param prices مصفوفة الأسعار التاريخية
 * @param shortPeriod فترة المتوسط القصير (افتراضياً 10)
 * @param longPeriod فترة المتوسط الطويل (افتراضياً 30)
 * @returns اتجاه السعر (صاعد، هابط، محايد)
 */
export const detectTrend = (
  prices: number[],
  shortPeriod: number = 10,
  longPeriod: number = 30
): "صاعد" | "هابط" | "محايد" => {
  if (!prices || prices.length < longPeriod) {
    const firstPrice = prices[0] || 0;
    const lastPrice = prices[prices.length - 1] || 0;
    
    // في حالة عدم توفر بيانات كافية، نقارن أول وآخر سعر فقط
    if (lastPrice > firstPrice * 1.01) {
      return "صاعد";
    } else if (lastPrice < firstPrice * 0.99) {
      return "هابط";
    } else {
      return "محايد";
    }
  }
  
  // حساب المتوسطات المتحركة البسيطة
  const shortSMA = calculateSMA(prices, shortPeriod);
  const longSMA = calculateSMA(prices, longPeriod);
  
  // فحص تقاطع المتوسطات
  const lastShortSMA = shortSMA[shortSMA.length - 1];
  const lastLongSMA = longSMA[longSMA.length - 1];
  const prevShortSMA = shortSMA[shortSMA.length - 2];
  const prevLongSMA = longSMA[longSMA.length - 2];
  
  // تحديد الاتجاه بناءً على موقع المتوسطات وحركتها
  if (lastShortSMA > lastLongSMA) {
    if (prevShortSMA <= prevLongSMA) {
      return "صاعد"; // تقاطع صعودي جديد
    }
    return "صاعد"; // استمرار الاتجاه الصاعد
  } else if (lastShortSMA < lastLongSMA) {
    if (prevShortSMA >= prevLongSMA) {
      return "هابط"; // تقاطع هبوطي جديد
    }
    return "هابط"; // استمرار الاتجاه الهابط
  }
  
  // فحص ميل الأسعار الأخيرة إذا كانت المتوسطات متساوية
  const recentPrices = prices.slice(-shortPeriod);
  const priceChange = (recentPrices[recentPrices.length - 1] - recentPrices[0]) / recentPrices[0];
  
  if (priceChange > 0.005) {
    return "صاعد";
  } else if (priceChange < -0.005) {
    return "هابط";
  }
  
  return "محايد";
};

/**
 * حساب المتوسط المتحرك البسيط (SMA)
 * @param prices بيانات الأسعار
 * @param period فترة الحساب
 * @returns مصفوفة بقيم المتوسط المتحرك
 */
const calculateSMA = (
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

/**
 * تحديد قوة الاتجاه الحالي
 * @param prices مصفوفة الأسعار التاريخية
 * @param period فترة الحساب
 * @returns قوة الاتجاه (0-100)
 */
export const calculateTrendStrength = (
  prices: number[],
  period: number = 14
): number => {
  if (prices.length < period) {
    return 50;
  }
  
  // حساب عدد الشموع الصاعدة والهابطة
  let upCandles = 0;
  let downCandles = 0;
  
  for (let i = prices.length - period; i < prices.length; i++) {
    if (i > 0) {
      if (prices[i] > prices[i - 1]) {
        upCandles++;
      } else if (prices[i] < prices[i - 1]) {
        downCandles++;
      }
    }
  }
  
  // حساب قوة الاتجاه من 0 إلى 100
  const totalCandles = upCandles + downCandles;
  if (totalCandles === 0) {
    return 50;
  }
  
  const direction = detectTrend(prices);
  const ratio = direction === "صاعد" ? 
    upCandles / totalCandles : 
    downCandles / totalCandles;
  
  return Math.round(ratio * 100);
};

/**
 * اكتشاف انعكاس الاتجاه المحتمل
 * @param prices مصفوفة الأسعار التاريخية
 * @returns حالة الانعكاس وقوته
 */
export const detectTrendReversal = (
  prices: number[]
): { isReversal: boolean; strength: number; potentialDirection: "صاعد" | "هابط" | "محايد" } => {
  if (prices.length < 20) {
    return { isReversal: false, strength: 0, potentialDirection: "محايد" };
  }
  
  // تحديد الاتجاه الحالي
  const currentTrend = detectTrend(prices);
  
  // حساب المتوسطات المتحركة
  const shortSMA = calculateSMA(prices, 5);
  const mediumSMA = calculateSMA(prices, 10);
  const longSMA = calculateSMA(prices, 20);
  
  // فحص تقاطع المتوسطات
  const lastShortSMA = shortSMA[shortSMA.length - 1];
  const lastMediumSMA = mediumSMA[mediumSMA.length - 1];
  const lastLongSMA = longSMA[longSMA.length - 1];
  
  // فحص تباطؤ الاتجاه (المتوسط القصير يقترب من المتوسط الطويل)
  let isReversal = false;
  let strength = 0;
  let potentialDirection: "صاعد" | "هابط" | "محايد" = "محايد";
  
  // فحص الفجوة بين المتوسطات
  const gapPercent = Math.abs((lastShortSMA - lastLongSMA) / lastLongSMA);
  
  if (currentTrend === "صاعد") {
    if (lastShortSMA < lastMediumSMA) {
      isReversal = true;
      potentialDirection = "هابط";
      strength = Math.min(Math.round((1 - gapPercent) * 100), 100);
    }
  } else if (currentTrend === "هابط") {
    if (lastShortSMA > lastMediumSMA) {
      isReversal = true;
      potentialDirection = "صاعد";
      strength = Math.min(Math.round((1 - gapPercent) * 100), 100);
    }
  }
  
  return { isReversal, strength, potentialDirection };
};

/**
 * تحديد الاتجاه والثقة معًا
 * @param prices مصفوفة الأسعار التاريخية
 * @returns الاتجاه ومستوى الثقة
 */
export const analyzeTrendWithConfidence = (
  prices: number[]
): { direction: "صاعد" | "هابط" | "محايد"; confidence: number } => {
  const trend = detectTrend(prices);
  const trendStrength = calculateTrendStrength(prices);
  const reversal = detectTrendReversal(prices);
  
  // تعديل الثقة بناءً على قوة الاتجاه ووجود انعكاس محتمل
  let confidence = trendStrength / 100;
  
  // إذا كان هناك احتمال انعكاس، خفض مستوى الثقة
  if (reversal.isReversal && reversal.potentialDirection !== trend) {
    confidence *= (1 - reversal.strength / 100);
  }
  
  return { direction: trend, confidence };
};
