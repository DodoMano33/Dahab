

// وظائف التحليل الفني للأسعار

// اكتشاف الاتجاه بناء على سلسلة من الأسعار
export const detectTrend = (prices: number[]): "صاعد" | "هابط" | "محايد" => {
  if (!prices || prices.length < 2) {
    return "محايد";
  }

  const recentPrices = prices.slice(-10); // استخدام آخر 10 أسعار
  
  let upCount = 0;
  let downCount = 0;
  
  for (let i = 1; i < recentPrices.length; i++) {
    if (recentPrices[i] > recentPrices[i - 1]) {
      upCount++;
    } else if (recentPrices[i] < recentPrices[i - 1]) {
      downCount++;
    }
  }
  
  if (upCount > downCount && upCount > recentPrices.length * 0.6) {
    return "صاعد";
  } else if (downCount > upCount && downCount > recentPrices.length * 0.6) {
    return "هابط";
  } else {
    // استخدام المقارنة بين أول وآخر سعر لترجيح الاتجاه في حالة عدم وضوحه
    return recentPrices[recentPrices.length - 1] > recentPrices[0] ? "صاعد" : "هابط";
  }
};

// حساب مستويات الدعم والمقاومة بناء على الأسعار التاريخية
export const calculateSupportResistance = (prices: number[]): { support: number; resistance: number } => {
  if (!prices || prices.length < 2) {
    const defaultPrice = prices && prices.length > 0 ? prices[0] : 0;
    return {
      support: defaultPrice * 0.95,
      resistance: defaultPrice * 1.05
    };
  }
  
  // تقسيم الأسعار إلى شرائح للتحليل
  const segmentSize = Math.min(20, Math.floor(prices.length / 3));
  const recentPrices = prices.slice(-segmentSize);
  
  const min = Math.min(...recentPrices);
  const max = Math.max(...recentPrices);
  
  // إضافة هامش صغير لتحسين نطاق الدعم والمقاومة
  const support = min * 0.995;
  const resistance = max * 1.005;
  
  return { support, resistance };
};

// حساب مستويات فيبوناتشي
export const calculateFibonacciLevels = (highPrice: number, lowPrice: number, direction: "صاعد" | "هابط" | "محايد" = "صاعد") => {
  const range = Math.abs(highPrice - lowPrice);
  
  // مستويات فيبوناتشي القياسية
  const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.272, 1.618, 2.618];
  
  if (direction === "صاعد") {
    return levels.map(level => ({
      level,
      price: lowPrice + range * level
    }));
  } else {
    return levels.map(level => ({
      level,
      price: highPrice - range * level
    }));
  }
};

// حساب التقلب بناء على الأسعار التاريخية
export const calculateVolatility = (prices: number[]): number => {
  if (!prices || prices.length < 2) {
    return 0.01; // قيمة افتراضية للتقلب
  }
  
  let sum = 0;
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  
  for (let i = 0; i < prices.length; i++) {
    sum += Math.pow(prices[i] - mean, 2);
  }
  
  const variance = sum / prices.length;
  return Math.sqrt(variance) / mean; // معامل الاختلاف (التقلب النسبي)
};

// حساب التوزيع السعري - دالة جديدة
export const calculatePriceDistribution = (prices: number[]): { clusters: {price: number, count: number}[], mode: number } => {
  if (!prices || prices.length < 5) {
    return { clusters: [], mode: prices?.[prices.length - 1] || 0 };
  }
  
  // تجميع الأسعار في فئات (تقريبية)
  const clusters: {[price: string]: number} = {};
  let maxCount = 0;
  let mode = 0;
  
  // تقريب الأسعار لتجميعها
  prices.forEach(price => {
    // تقريب السعر لأقرب 0.5%
    const normalized = Math.round(price * 200) / 200;
    const key = normalized.toFixed(3);
    
    if (!clusters[key]) {
      clusters[key] = 0;
    }
    
    clusters[key]++;
    
    if (clusters[key] > maxCount) {
      maxCount = clusters[key];
      mode = normalized;
    }
  });
  
  // تحويل التجميع إلى مصفوفة
  const clusterArray = Object.entries(clusters).map(([price, count]) => ({
    price: parseFloat(price),
    count
  })).sort((a, b) => a.price - b.price);
  
  return {
    clusters: clusterArray,
    mode
  };
};

// تحليل انعكاسات السعر - دالة جديدة
export const analyzeReversals = (prices: number[], threshold: number = 0.01): {points: number[], strength: number} => {
  if (!prices || prices.length < 10) {
    return { points: [], strength: 0 };
  }
  
  const reversalPoints: number[] = [];
  let totalStrength = 0;
  
  // البحث عن نقاط الانعكاس الهامة
  for (let i = 5; i < prices.length - 5; i++) {
    const before = prices.slice(i-5, i);
    const after = prices.slice(i, i+5);
    
    const beforeTrend = detectTrend(before);
    const afterTrend = detectTrend(after);
    
    // تحديد الانعكاس إذا تغير الاتجاه
    if (beforeTrend !== afterTrend && beforeTrend !== "محايد" && afterTrend !== "محايد") {
      const strength = Math.abs(Math.max(...after) - Math.min(...before)) / Math.min(...before);
      
      if (strength > threshold) {
        reversalPoints.push(prices[i]);
        totalStrength += strength;
      }
    }
  }
  
  // حساب متوسط قوة نقاط الانعكاس
  const averageStrength = reversalPoints.length > 0 ? totalStrength / reversalPoints.length : 0;
  
  return {
    points: reversalPoints,
    strength: averageStrength
  };
};

// وظائف إضافية لدعم التحليل الفني
export interface PriceDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type PriceData = PriceDataPoint;

