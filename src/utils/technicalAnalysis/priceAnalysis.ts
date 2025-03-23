
/**
 * وحدة تحليل الأسعار
 * توفر وظائف لحساب الأهداف، نقاط وقف الخسارة، ونقاط الدخول
 */

/**
 * حساب الأهداف السعرية بناءً على الاتجاه ومستويات الدعم والمقاومة
 * @param currentPrice - السعر الحالي
 * @param direction - الاتجاه المتوقع
 * @param support - مستوى الدعم
 * @param resistance - مستوى المقاومة
 * @param timeframe - الإطار الزمني
 * @param targetMultiplier - معامل تعديل للأهداف (اختياري)
 * @returns مصفوفة من الأهداف السعرية
 */
export const calculateTargets = (
  currentPrice: number,
  direction: "صاعد" | "هابط" | "محايد",
  support: number,
  resistance: number,
  timeframe: string,
  targetMultiplier: number = 1.0
): number[] => {
  // تطبيق معامل المضاعفة حسب الإطار الزمني
  const tfMultiplier = getTimeframeMultiplier(timeframe);
  const adjustedMultiplier = targetMultiplier * tfMultiplier;
  
  // حساب متوسط النطاق للأهداف
  const averageRange = Math.max(
    resistance - support,
    resistance / 100, // على الأقل 1٪ من مستوى المقاومة
    currentPrice * 0.01 // على الأقل 1٪ من السعر الحالي
  );
  
  if (direction === "محايد") {
    // في الاتجاه المحايد، الأهداف هي الحد الأدنى والأعلى من النطاق مع عتبة وسطية
    return [
      currentPrice * 0.995,
      support, 
      (support + resistance) / 2,
      resistance,
      currentPrice * 1.005
    ];
  }

  if (direction === "صاعد") {
    // حساب الأهداف الصاعدة - ثلاثة أهداف تدريجية فوق السعر الحالي
    const baseTarget = Math.max(currentPrice, support);
    return [
      baseTarget + averageRange * 0.3 * adjustedMultiplier,
      baseTarget + averageRange * 0.6 * adjustedMultiplier,
      resistance,
      resistance + averageRange * 0.3 * adjustedMultiplier
    ];
  } else {
    // حساب الأهداف الهابطة - ثلاثة أهداف تدريجية تحت السعر الحالي
    const baseTarget = Math.min(currentPrice, resistance);
    return [
      baseTarget - averageRange * 0.3 * adjustedMultiplier,
      baseTarget - averageRange * 0.6 * adjustedMultiplier,
      support,
      support - averageRange * 0.3 * adjustedMultiplier
    ];
  }
};

/**
 * عامل مضاعفة الأهداف حسب الإطار الزمني
 */
function getTimeframeMultiplier(timeframe: string): number {
  switch (timeframe) {
    case "1m": return 0.2;  // نسب صغيرة للإطار الزمني 1 دقيقة
    case "5m": return 0.3;
    case "15m": return 0.5;
    case "30m": return 0.7;
    case "1h": return 0.9;
    case "4h": return 1.1;
    case "1d": return 1.3;  // نسب أكبر للإطار الزمني اليومي
    case "1w": return 1.5;  // نسب أكبر للإطار الزمني الأسبوعي
    default: return 1.0;
  }
}

/**
 * حساب نقطة وقف الخسارة المناسبة
 * @param currentPrice - السعر الحالي
 * @param direction - الاتجاه المتوقع
 * @param support - مستوى الدعم
 * @param resistance - مستوى المقاومة
 * @param timeframe - الإطار الزمني
 * @param safetyFactor - معامل الأمان (اختياري)
 * @returns سعر نقطة وقف الخسارة
 */
export const calculateStopLoss = (
  currentPrice: number,
  direction: "صاعد" | "هابط" | "محايد",
  support: number,
  resistance: number,
  timeframe: string,
  safetyFactor: number = 1.0
): number => {
  // معامل وقف الخسارة استنادًا إلى الإطار الزمني
  let stopLossPercent = 0.01; // 1% افتراضيًا
  
  // تعديل المعامل بناءً على الإطار الزمني
  if (timeframe.includes("1m")) {
    stopLossPercent = 0.001;
  } else if (timeframe.includes("5m")) {
    stopLossPercent = 0.002;
  } else if (timeframe.includes("15m")) {
    stopLossPercent = 0.003;
  } else if (timeframe.includes("30m")) {
    stopLossPercent = 0.004;
  } else if (timeframe.includes("1h")) {
    stopLossPercent = 0.005;
  } else if (timeframe.includes("4h")) {
    stopLossPercent = 0.01;
  } else if (timeframe.includes("1d")) {
    stopLossPercent = 0.02;
  } else if (timeframe.includes("1w")) {
    stopLossPercent = 0.03;
  }
  
  // تطبيق معامل الأمان
  stopLossPercent *= safetyFactor;
  
  // حساب المسافة بين السعر الحالي ومستويات الدعم والمقاومة
  const distanceToSupport = currentPrice - support;
  const distanceToResistance = resistance - currentPrice;
  
  if (direction === "صاعد") {
    // في الاتجاه الصاعد، وقف الخسارة تحت مستوى الدعم
    // إذا كان السعر الحالي قريب جدًا من الدعم، نضع وقف الخسارة بنسبة بسيطة تحت الدعم
    if (distanceToSupport < currentPrice * 0.005) {
      return support * (1 - 0.005);
    }
    
    // استخدام أكثر من طريقة لحساب وقف الخسارة واختيار الأكثر منطقية
    const stopLoss1 = support * (1 - stopLossPercent);
    const stopLoss2 = currentPrice * (1 - 1.5 * stopLossPercent);
    const stopLoss3 = currentPrice - distanceToSupport * 1.2;
    
    // اختيار أعلى قيمة (أقرب للسعر الحالي) لتقليل المخاطر
    return Math.max(stopLoss1, stopLoss2, stopLoss3);
  } else if (direction === "هابط") {
    // في الاتجاه الهابط، وقف الخسارة فوق مستوى المقاومة
    // إذا كان السعر الحالي قريب جدًا من المقاومة، نضع وقف الخسارة بنسبة بسيطة فوق المقاومة
    if (distanceToResistance < currentPrice * 0.005) {
      return resistance * (1 + 0.005);
    }
    
    // استخدام أكثر من طريقة لحساب وقف الخسارة واختيار الأكثر منطقية
    const stopLoss1 = resistance * (1 + stopLossPercent);
    const stopLoss2 = currentPrice * (1 + 1.5 * stopLossPercent);
    const stopLoss3 = currentPrice + distanceToResistance * 1.2;
    
    // اختيار أقل قيمة (أقرب للسعر الحالي) لتقليل المخاطر
    return Math.min(stopLoss1, stopLoss2, stopLoss3);
  } else {
    // في الاتجاه المحايد، وقف الخسارة يعتمد على التقلبات المتوقعة
    const range = resistance - support;
    const avgPrice = (support + resistance) / 2;
    
    // تعديل وقف الخسارة بناءً على موقع السعر الحالي بين الدعم والمقاومة
    if (currentPrice > avgPrice) {
      // إذا كان السعر فوق المتوسط، وقف الخسارة تحت المتوسط
      return avgPrice * (1 - stopLossPercent * (range / avgPrice) * 5);
    } else {
      // إذا كان السعر تحت المتوسط، وقف الخسارة فوق المتوسط
      return avgPrice * (1 + stopLossPercent * (range / avgPrice) * 5);
    }
  }
};

/**
 * حساب نقطة الدخول المثالية
 * @param currentPrice - السعر الحالي
 * @param direction - الاتجاه المتوقع
 * @param support - مستوى الدعم
 * @param resistance - مستوى المقاومة
 * @param fibLevels - مستويات فيبوناتشي
 * @param timeframe - الإطار الزمني
 * @returns كائن يحتوي على سعر الدخول وسبب اختياره
 */
export const calculateBestEntryPoint = (
  currentPrice: number,
  direction: "صاعد" | "هابط" | "محايد",
  support: number,
  resistance: number,
  fibLevels: { level: number, price: number }[] = [],
  timeframe: string
): { price: number, reason: string } => {
  // حساب المسافة بين السعر الحالي ومستويات الدعم والمقاومة
  const distanceToSupport = currentPrice - support;
  const distanceToResistance = resistance - currentPrice;
  const range = resistance - support;
  
  if (direction === "محايد") {
    // في الاتجاه المحايد، أفضل نقطة دخول هي قرب المتوسط
    const midPoint = (support + resistance) / 2;
    const entryPrice = midPoint > currentPrice ? 
      currentPrice * 1.002 : // شراء إذا كان السعر تحت المتوسط
      currentPrice * 0.998;  // بيع إذا كان السعر فوق المتوسط
    
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: `دخول قرب السعر الحالي مع وقف خسارة ضيق في انتظار تأكيد الاتجاه على الإطار الزمني ${timeframe}`
    };
  }

  if (direction === "صاعد") {
    // البحث عن مستوى فيبوناتشي للارتداد (0.382 أو 0.5 أو 0.618)
    const retracement = fibLevels.find(level => 
      (level.level === 0.382 || level.level === 0.5 || level.level === 0.618) && 
      level.price < currentPrice && 
      level.price > support
    );
    
    if (retracement) {
      // إذا وجدنا مستوى فيبوناتشي مناسب، نستخدمه كنقطة دخول
      return {
        price: retracement.price,
        reason: `نقطة دخول على مستوى فيبوناتشي ${retracement.level} مع توقع استمرار الاتجاه الصاعد على ${timeframe}`
      };
    } else if (distanceToSupport < range * 0.2) {
      // إذا كان السعر قريب من الدعم، الدخول عند السعر الحالي مباشرة
      return {
        price: currentPrice,
        reason: `دخول مباشر عند السعر الحالي مع اقتراب السعر من مستوى الدعم على ${timeframe}`
      };
    } else {
      // إنشاء نقطة دخول بين السعر الحالي والدعم
      const entryPrice = currentPrice - (distanceToSupport * 0.3);
      return {
        price: Number(entryPrice.toFixed(2)),
        reason: `دخول تدريجي بعد تراجع طفيف في السعر مع الاحتفاظ بالاتجاه الصاعد العام على ${timeframe}`
      };
    }
  } else { // الاتجاه الهابط
    // البحث عن مستوى فيبوناتشي للارتداد (0.618 أو 0.5 أو 0.382)
    const retracement = fibLevels.find(level => 
      (level.level === 0.618 || level.level === 0.5 || level.level === 0.382) && 
      level.price > currentPrice && 
      level.price < resistance
    );
    
    if (retracement) {
      // إذا وجدنا مستوى فيبوناتشي مناسب، نستخدمه كنقطة دخول
      return {
        price: retracement.price,
        reason: `نقطة دخول على مستوى فيبوناتشي ${retracement.level} مع توقع استمرار الاتجاه الهابط على ${timeframe}`
      };
    } else if (distanceToResistance < range * 0.2) {
      // إذا كان السعر قريب من المقاومة، الدخول عند السعر الحالي مباشرة
      return {
        price: currentPrice,
        reason: `دخول مباشر عند السعر الحالي مع اقتراب السعر من مستوى المقاومة على ${timeframe}`
      };
    } else {
      // إنشاء نقطة دخول بين السعر الحالي والمقاومة
      const entryPrice = currentPrice + (distanceToResistance * 0.3);
      return {
        price: Number(entryPrice.toFixed(2)),
        reason: `دخول تدريجي بعد ارتفاع طفيف في السعر مع الاحتفاظ بالاتجاه الهابط العام على ${timeframe}`
      };
    }
  }
};

/**
 * تحديد مستويات الدعم والمقاومة الرئيسية
 * @param prices - مصفوفة الأسعار التاريخية
 * @param numLevels - عدد المستويات المطلوبة (الافتراضي: 3)
 * @returns مصفوفة من مستويات الدعم والمقاومة الرئيسية
 */
export const findKeyLevels = (
  prices: number[],
  numLevels: number = 3
): { support: number[], resistance: number[] } => {
  if (prices.length < 10) {
    return { support: [], resistance: [] };
  }
  
  // تقسيم البيانات إلى نقاط محلية عالية ومنخفضة
  const highs: number[] = [];
  const lows: number[] = [];
  
  for (let i = 2; i < prices.length - 2; i++) {
    // اكتشاف القمم المحلية
    if (prices[i] > prices[i-1] && prices[i] > prices[i-2] && 
        prices[i] > prices[i+1] && prices[i] > prices[i+2]) {
      highs.push(prices[i]);
    }
    
    // اكتشاف القيعان المحلية
    if (prices[i] < prices[i-1] && prices[i] < prices[i-2] && 
        prices[i] < prices[i+1] && prices[i] < prices[i+2]) {
      lows.push(prices[i]);
    }
  }
  
  // تصنيف القمم والقيعان في مجموعات
  const highClusters = clusterPrices(highs, prices[prices.length - 1] * 0.005);
  const lowClusters = clusterPrices(lows, prices[prices.length - 1] * 0.005);
  
  // ترتيب المجموعات حسب الأهمية (عدد النقاط في كل مجموعة)
  const sortedHighs = highClusters
    .sort((a, b) => b.count - a.count)
    .slice(0, numLevels)
    .map(cluster => cluster.price);
  
  const sortedLows = lowClusters
    .sort((a, b) => b.count - a.count)
    .slice(0, numLevels)
    .map(cluster => cluster.price);
  
  return { 
    resistance: sortedHighs, 
    support: sortedLows 
  };
};

/**
 * تجميع الأسعار المتقاربة في مجموعات
 * @param prices - مصفوفة الأسعار
 * @param threshold - عتبة للتجميع
 * @returns مصفوفة من المجموعات السعرية
 */
function clusterPrices(
  prices: number[], 
  threshold: number
): { price: number, count: number }[] {
  const clusters: { price: number, count: number }[] = [];
  
  for (const price of prices) {
    let foundCluster = false;
    
    for (let i = 0; i < clusters.length; i++) {
      if (Math.abs(clusters[i].price - price) <= threshold) {
        // تحديث متوسط سعر المجموعة
        clusters[i].price = (clusters[i].price * clusters[i].count + price) / (clusters[i].count + 1);
        clusters[i].count++;
        foundCluster = true;
        break;
      }
    }
    
    if (!foundCluster) {
      clusters.push({ price, count: 1 });
    }
  }
  
  return clusters;
}
