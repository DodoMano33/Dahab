
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
  if (direction === "محايد") {
    // في الاتجاه المحايد، الأهداف هي الحد الأدنى والأعلى من النطاق
    return [support, resistance];
  }

  if (direction === "صاعد") {
    // حساب الأهداف الصاعدة
    const range = resistance - currentPrice;
    return [
      currentPrice + range * 0.5 * targetMultiplier,
      resistance,
      resistance + range * 0.5 * targetMultiplier
    ];
  } else {
    // حساب الأهداف الهابطة
    const range = currentPrice - support;
    return [
      currentPrice - range * 0.5 * targetMultiplier,
      support,
      support - range * 0.5 * targetMultiplier
    ];
  }
};

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
  if (timeframe.includes("1h")) {
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
  
  if (direction === "صاعد") {
    // في الاتجاه الصاعد، وقف الخسارة تحت مستوى الدعم
    const dynamicStopLoss = Math.min(
      support * (1 - stopLossPercent),
      currentPrice * (1 - 1.5 * stopLossPercent)
    );
    return dynamicStopLoss;
  } else if (direction === "هابط") {
    // في الاتجاه الهابط، وقف الخسارة فوق مستوى المقاومة
    const dynamicStopLoss = Math.max(
      resistance * (1 + stopLossPercent),
      currentPrice * (1 + 1.5 * stopLossPercent)
    );
    return dynamicStopLoss;
  } else {
    // في الاتجاه المحايد، وقف الخسارة يعتمد على التقلبات المتوقعة
    const range = resistance - support;
    return currentPrice * (1 - stopLossPercent * (range / currentPrice) * 10);
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
  fibLevels: { level: number, price: number }[],
  timeframe: string
): { price: number, reason: string } => {
  if (direction === "محايد") {
    return {
      price: currentPrice,
      reason: "دخول فوري مع وقف خسارة ضيق في انتظار تأكيد الاتجاه"
    };
  }

  if (direction === "صاعد") {
    // البحث عن مستوى فيبوناتشي للارتداد (0.382 أو 0.5)
    const idealRetracement = fibLevels.find(level => level.level === 0.382 || level.level === 0.5);
    
    if (idealRetracement && idealRetracement.price < currentPrice) {
      return {
        price: idealRetracement.price,
        reason: `نقطة دخول على مستوى فيبوناتشي ${idealRetracement.level} مع توقع استمرار الاتجاه الصاعد`
      };
    } else {
      // إذا كان السعر الحالي هو الأفضل للدخول
      return {
        price: currentPrice * 0.995, // دخول بسعر أقل قليلاً من الحالي
        reason: "دخول فوري مع آلية تجزئة المراكز في حالة تصحيح الأسعار"
      };
    }
  } else { // الاتجاه الهابط
    // البحث عن مستوى فيبوناتشي للارتداد (0.618 أو 0.5)
    const idealRetracement = fibLevels.find(level => level.level === 0.618 || level.level === 0.5);
    
    if (idealRetracement && idealRetracement.price > currentPrice) {
      return {
        price: idealRetracement.price,
        reason: `نقطة دخول على مستوى فيبوناتشي ${idealRetracement.level} مع توقع استمرار الاتجاه الهابط`
      };
    } else {
      // إذا كان السعر الحالي هو الأفضل للدخول
      return {
        price: currentPrice * 1.005, // دخول بسعر أعلى قليلاً من الحالي
        reason: "دخول فوري مع آلية تجزئة المراكز في حالة ارتداد الأسعار"
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
