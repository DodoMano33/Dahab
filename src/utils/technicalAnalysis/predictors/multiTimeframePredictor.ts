
/**
 * محلل توافق الاتجاهات بين الأطر الزمنية المختلفة
 * يساعد على تحديد قوة الاتجاه وإمكانية استمراره
 */

interface TimeframeTrendData {
  timeframe: string;
  trend: "صاعد" | "هابط" | "محايد";
  strength: number; // 0-1
  trendAge: "جديد" | "متوسط" | "ناضج";
}

export interface TrendSyncData {
  overallTrend: "صاعد" | "هابط" | "محايد";
  syncScore: number; // 0-100
  timeframes: TimeframeTrendData[];
  recommendation: string;
  dominantTrend: "صاعد" | "هابط" | "محايد";
  confidence: number;
  alignedTimeframes: string[];
}

/**
 * حساب درجة توافق الاتجاهات بين الأطر الزمنية المختلفة
 */
export const getMultiTimeframeTrendSyncScore = async (
  prices: number[], 
  currentTimeframe: string
): Promise<TrendSyncData> => {
  // محاكاة بيانات الأطر الزمنية المختلفة
  const timeframes = simulateTimeframesFromPrice(prices, currentTimeframe);
  
  // حساب نسبة التوافق بين الاتجاهات
  let upCount = 0;
  let downCount = 0;
  let neutralCount = 0;
  
  timeframes.forEach(tf => {
    if (tf.trend === "صاعد") upCount++;
    else if (tf.trend === "هابط") downCount++;
    else neutralCount++;
  });
  
  // تحديد الاتجاه العام
  let overallTrend: "صاعد" | "هابط" | "محايد" = "محايد";
  if (upCount > downCount && upCount > neutralCount) {
    overallTrend = "صاعد";
  } else if (downCount > upCount && downCount > neutralCount) {
    overallTrend = "هابط";
  }
  
  // حساب درجة التوافق (0-100)
  const totalFrames = timeframes.length;
  let syncScore = 0;
  
  if (overallTrend === "صاعد") {
    syncScore = Math.round((upCount / totalFrames) * 100);
  } else if (overallTrend === "هابط") {
    syncScore = Math.round((downCount / totalFrames) * 100);
  } else {
    syncScore = Math.round((neutralCount / totalFrames) * 100);
  }
  
  // إنشاء توصية بناءً على درجة التوافق
  let recommendation = "محايد - الاتجاهات مختلطة بين الأطر الزمنية";
  
  if (syncScore > 80) {
    recommendation = `${overallTrend} قوي - توافق قوي بين جميع الأطر الزمنية`;
  } else if (syncScore > 60) {
    recommendation = `${overallTrend} معتدل - توافق جيد بين معظم الأطر الزمنية`;
  } else if (syncScore > 40) {
    recommendation = `${overallTrend} ضعيف - بعض التوافق بين الأطر الزمنية`;
  }

  // الإطارات الزمنية المتوافقة
  const alignedTimeframes = timeframes
    .filter(tf => tf.trend === overallTrend)
    .map(tf => tf.timeframe);
  
  return {
    overallTrend,
    syncScore,
    timeframes,
    recommendation,
    dominantTrend: overallTrend,
    confidence: syncScore / 100,
    alignedTimeframes
  };
};

/**
 * تحليل الزخم متعدد الأطر الزمنية
 */
export const analyzeMultiTimeframeMomentum = async (
  symbol: string,
  currentPrice: number
): Promise<{ momentumScore: number; direction: "صاعد" | "هابط" | "محايد" }> => {
  // محاكاة نتائج تحليل الزخم
  const randomValue = Math.random();
  const momentumScore = (randomValue - 0.5) * 2; // نتيجة بين -1 و 1
  
  let direction: "صاعد" | "هابط" | "محايد" = "محايد";
  if (momentumScore > 0.2) {
    direction = "صاعد";
  } else if (momentumScore < -0.2) {
    direction = "هابط";
  }
  
  return {
    momentumScore,
    direction
  };
};

/**
 * محاكاة تحليل الاتجاه في أطر زمنية مختلفة
 */
const simulateTimeframesFromPrice = (
  prices: number[], 
  currentTimeframe: string
): TimeframeTrendData[] => {
  // تحويل الإطار الزمني الحالي إلى قيمة رقمية
  const currentTfValue = timeframeToValue(currentTimeframe);
  
  // إنشاء قائمة بالأطر الزمنية المتنوعة للتحليل
  const timeframeValues = [
    { name: "1 دقيقة", value: 1 },
    { name: "5 دقائق", value: 5 },
    { name: "15 دقيقة", value: 15 },
    { name: "30 دقيقة", value: 30 },
    { name: "1 ساعة", value: 60 },
    { name: "4 ساعات", value: 240 },
    { name: "يومي", value: 1440 },
    { name: "أسبوعي", value: 10080 }
  ];
  
  // محاكاة نتائج تحليل الاتجاه لكل إطار زمني
  return timeframeValues.map(tf => {
    // توليد اتجاه وقوة بشكل شبه عشوائي ولكن متناسق
    const seed = (tf.value * (prices[0] || 1000)) % 100;
    const relativeValue = tf.value / currentTfValue;
    
    let trend: "صاعد" | "هابط" | "محايد";
    let strength: number;
    
    if (seed < 40) {
      trend = "صاعد";
      strength = 0.5 + (seed / 100);
    } else if (seed < 80) {
      trend = "هابط";
      strength = 0.5 + ((seed - 40) / 100);
    } else {
      trend = "محايد";
      strength = 0.3 + ((seed - 80) / 100);
    }
    
    // الأطر الزمنية الأكبر عادة لها قوة أكبر
    if (relativeValue > 1) {
      strength = Math.min(1, strength * (1 + Math.log10(relativeValue) * 0.2));
    }
    
    // تحديد عمر الاتجاه
    let trendAge: "جديد" | "متوسط" | "ناضج";
    const ageSeed = (seed + tf.value) % 100;
    
    if (ageSeed < 33) {
      trendAge = "جديد";
    } else if (ageSeed < 66) {
      trendAge = "متوسط";
    } else {
      trendAge = "ناضج";
    }
    
    return {
      timeframe: tf.name,
      trend,
      strength: parseFloat(strength.toFixed(2)),
      trendAge
    };
  });
};

/**
 * تحويل الإطار الزمني إلى قيمة رقمية (بالدقائق)
 */
const timeframeToValue = (timeframe: string): number => {
  const lowerTf = timeframe.toLowerCase();
  
  if (lowerTf.includes("m") || lowerTf.includes("د") || lowerTf.includes("دقيقة")) {
    const minutes = parseInt(lowerTf) || 1;
    return minutes;
  } else if (lowerTf.includes("h") || lowerTf.includes("س") || lowerTf.includes("ساعة")) {
    const hours = parseInt(lowerTf) || 1;
    return hours * 60;
  } else if (lowerTf.includes("d") || lowerTf.includes("ي") || lowerTf.includes("يوم")) {
    return 1440; // 24 * 60
  } else if (lowerTf.includes("w") || lowerTf.includes("أ") || lowerTf.includes("أسبوع")) {
    return 10080; // 7 * 24 * 60
  } else if (lowerTf.includes("mo") || lowerTf.includes("شهر")) {
    return 43200; // 30 * 24 * 60
  }
  
  return 60; // قيمة افتراضية (ساعة)
};
