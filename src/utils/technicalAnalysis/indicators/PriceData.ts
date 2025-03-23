
// نوع بيانات السعر الأساسي المستخدم في تحليل الأنماط
export interface PriceData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

// وظيفة للكشف عن الاتجاه باستخدام بيانات الأسعار
export const detectTrend = (prices: number[]): "صاعد" | "هابط" | "محايد" => {
  if (prices.length < 2) {
    return "محايد";
  }
  
  // حساب المتوسط
  const sum = prices.reduce((a, b) => a + b, 0);
  const avg = sum / prices.length;
  
  // حساب الاتجاه البسيط (الأسعار الأخيرة فوق أو تحت المتوسط)
  const lastPrice = prices[prices.length - 1];
  const firstPrice = prices[0];
  
  if (lastPrice > firstPrice && lastPrice > avg) {
    return "صاعد";
  } else if (lastPrice < firstPrice && lastPrice < avg) {
    return "هابط";
  } else {
    return "محايد";
  }
};

// حساب الدعم والمقاومة
export const calculateSupportResistance = (prices: number[]) => {
  if (prices.length < 2) {
    return { support: 0, resistance: 0 };
  }
  
  // ترتيب الأسعار تصاعدياً
  const sortedPrices = [...prices].sort((a, b) => a - b);
  
  // تحديد أدنى سعر كدعم وأعلى سعر كمقاومة
  const support = sortedPrices[0];
  const resistance = sortedPrices[sortedPrices.length - 1];
  
  return { support, resistance };
};

// حساب وقف الخسارة الأمثل
export const calculateOptimalStopLoss = (
  currentPrice: number,
  direction: "صاعد" | "هابط" | "محايد",
  volatility: number = 0.02
) => {
  if (direction === "صاعد") {
    return currentPrice * (1 - volatility);
  } else if (direction === "هابط") {
    return currentPrice * (1 + volatility);
  } else {
    // في حالة الاتجاه المحايد، استخدم متوسط الاتجاهين
    return currentPrice;
  }
};

// حساب التقلب من بيانات الأسعار
export const calculateVolatility = (prices: number[], period: number = 14): number => {
  if (prices.length < period) {
    return 0.02; // قيمة افتراضية للتقلب
  }
  
  // حساب التقلب كانحراف معياري للعوائد اليومية
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i-1]) / prices[i-1]);
  }
  
  // حساب متوسط العوائد
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  
  // حساب الانحراف المعياري
  const squaredDifferences = returns.map(ret => Math.pow(ret - avgReturn, 2));
  const variance = squaredDifferences.reduce((a, b) => a + b, 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  
  return stdDev;
};

// حساب مستويات فيبوناتشي
export const calculateFibonacciLevels = (
  highPrice: number,
  lowPrice: number,
  direction: "صاعد" | "هابط" | "محايد"
): { level: number; price: number }[] => {
  const fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
  const range = highPrice - lowPrice;
  
  if (direction === "صاعد") {
    return fibLevels.map(level => ({
      level,
      price: lowPrice + (range * level)
    }));
  } else {
    return fibLevels.map(level => ({
      level, 
      price: highPrice - (range * level)
    }));
  }
};
