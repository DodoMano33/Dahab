
/**
 * مؤشرات تحديد الاتجاه
 * توفر وظائف لتحليل اتجاه السوق باستخدام مؤشرات مختلفة
 */

/**
 * تحديد اتجاه السعر باستخدام نظرية الاتجاه البسيطة
 * @param prices - مصفوفة الأسعار التاريخية
 * @param period - فترة المراقبة لتحديد الاتجاه (افتراضي: 14)
 * @returns الاتجاه المحدد: "صاعد" أو "هابط" أو "محايد"
 */
export function detectTrend(
  prices: number[],
  period: number = 14
): "صاعد" | "هابط" | "محايد" {
  if (prices.length < period + 1) {
    return "محايد"; // بيانات غير كافية
  }
  
  // أخذ بيانات الفترة المحددة فقط
  const recentPrices = prices.slice(-period - 1);
  
  // حساب متوسط الأسعار في بداية ونهاية الفترة
  const startAverage = (recentPrices[0] + recentPrices[1] + recentPrices[2]) / 3;
  const endAverage = (recentPrices[recentPrices.length - 3] + recentPrices[recentPrices.length - 2] + recentPrices[recentPrices.length - 1]) / 3;
  
  // حساب نسبة التغير
  const changePercent = (endAverage - startAverage) / startAverage;
  
  // تصنيف الاتجاه بناءً على نسبة التغير
  if (changePercent > 0.01) {
    return "صاعد";
  } else if (changePercent < -0.01) {
    return "هابط";
  } else {
    return "محايد";
  }
}

/**
 * تحديد اتجاه السعر باستخدام المتوسطات المتحركة
 * @param prices - مصفوفة الأسعار التاريخية
 * @param shortPeriod - فترة المتوسط المتحرك القصير (افتراضي: 10)
 * @param longPeriod - فترة المتوسط المتحرك الطويل (افتراضي: 50)
 * @returns الاتجاه المحدد: "صاعد" أو "هابط" أو "محايد"
 */
export function detectTrendWithMA(
  prices: number[],
  shortPeriod: number = 10,
  longPeriod: number = 50
): "صاعد" | "هابط" | "محايد" {
  if (prices.length < longPeriod) {
    return "محايد"; // بيانات غير كافية
  }
  
  // حساب المتوسط المتحرك القصير
  const shortMA = calculateSMA(prices, shortPeriod);
  
  // حساب المتوسط المتحرك الطويل
  const longMA = calculateSMA(prices, longPeriod);
  
  // تحقق من حجم المصفوفات
  if (shortMA.length === 0 || longMA.length === 0) {
    return "محايد";
  }
  
  // مقارنة آخر قيمة من كل متوسط متحرك
  const lastShortMA = shortMA[shortMA.length - 1];
  const lastLongMA = longMA[longMA.length - 1];
  
  // مقارنة التغيير في المتوسط المتحرك القصير
  const shortMATrend = shortMA[shortMA.length - 1] > shortMA[shortMA.length - 2] ? "صاعد" : "هابط";
  
  // تحديد الاتجاه النهائي
  if (lastShortMA > lastLongMA && shortMATrend === "صاعد") {
    return "صاعد"; // المتوسط المتحرك القصير فوق الطويل واتجاه تصاعدي
  } else if (lastShortMA < lastLongMA && shortMATrend === "هابط") {
    return "هابط"; // المتوسط المتحرك القصير تحت الطويل واتجاه هبوطي
  } else {
    return "محايد"; // إشارات مختلطة
  }
}

/**
 * حساب المتوسط المتحرك البسيط
 * @param prices - مصفوفة الأسعار
 * @param period - فترة المتوسط المتحرك
 * @returns مصفوفة من قيم المتوسط المتحرك
 */
export function calculateSMA(
  prices: number[],
  period: number
): number[] {
  if (prices.length < period) {
    return [];
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
}

/**
 * تحديد اتجاه السعر باستخدام مزيج من المؤشرات
 * @param prices - مصفوفة الأسعار التاريخية
 * @returns الاتجاه المحدد مع درجة الثقة
 */
export function detectTrendWithConfidence(
  prices: number[]
): { trend: "صاعد" | "هابط" | "محايد", confidence: number } {
  if (prices.length < 50) {
    return { trend: "محايد", confidence: 0.5 };
  }
  
  // تطبيق عدة مؤشرات لتحديد الاتجاه
  const simpleTrend = detectTrend(prices);
  const maTrend = detectTrendWithMA(prices);
  
  // حساب RSI لتأكيد الاتجاه
  const recentPrices = prices.slice(-14);
  const upMoves: number[] = [];
  const downMoves: number[] = [];
  
  for (let i = 1; i < recentPrices.length; i++) {
    const change = recentPrices[i] - recentPrices[i - 1];
    if (change > 0) {
      upMoves.push(change);
      downMoves.push(0);
    } else {
      upMoves.push(0);
      downMoves.push(Math.abs(change));
    }
  }
  
  const avgUp = upMoves.reduce((sum, val) => sum + val, 0) / upMoves.length;
  const avgDown = downMoves.reduce((sum, val) => sum + val, 0) / downMoves.length;
  
  const rs = avgUp / (avgDown === 0 ? 0.001 : avgDown);
  const rsi = 100 - (100 / (1 + rs));
  
  // تحديد اتجاه RSI
  let rsiTrend: "صاعد" | "هابط" | "محايد";
  if (rsi > 60) {
    rsiTrend = "صاعد";
  } else if (rsi < 40) {
    rsiTrend = "هابط";
  } else {
    rsiTrend = "محايد";
  }
  
  // حساب عدد المؤشرات التي تتفق على اتجاه معين
  const trendCounts = {
    "صاعد": 0,
    "هابط": 0,
    "محايد": 0
  };
  
  trendCounts[simpleTrend]++;
  trendCounts[maTrend]++;
  trendCounts[rsiTrend]++;
  
  // تحديد الاتجاه الأكثر تأييداً
  let finalTrend: "صاعد" | "هابط" | "محايد" = "محايد";
  let maxCount = trendCounts["محايد"];
  
  if (trendCounts["صاعد"] > maxCount) {
    maxCount = trendCounts["صاعد"];
    finalTrend = "صاعد";
  }
  
  if (trendCounts["هابط"] > maxCount) {
    maxCount = trendCounts["هابط"];
    finalTrend = "هابط";
  }
  
  // حساب الثقة بناءً على مدى اتفاق المؤشرات
  const confidence = maxCount / 3;
  
  return { trend: finalTrend, confidence };
}
