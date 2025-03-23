
// تعريف نوع بيانات السعر
export interface PriceData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

// وظائف الكشف عن الاتجاه
export const detectTrend = (prices: number[]): "صاعد" | "هابط" | "محايد" => {
  if (prices.length < 2) return "محايد";
  
  const recentPrices = prices.slice(-10);
  let upCount = 0;
  let downCount = 0;
  
  for (let i = 1; i < recentPrices.length; i++) {
    if (recentPrices[i] > recentPrices[i-1]) upCount++;
    else if (recentPrices[i] < recentPrices[i-1]) downCount++;
  }
  
  if (upCount > downCount * 1.5) return "صاعد";
  if (downCount > upCount * 1.5) return "هابط";
  return "محايد";
};

// حساب مستويات الدعم والمقاومة
export const calculateSupportResistance = (prices: number[], mainPrice?: number) => {
  let sortedPrices = [...prices].sort((a, b) => a - b);
  const length = sortedPrices.length;
  
  // استخدام السعر الرئيسي إذا كان متاحاً، وإلا استخدام متوسط الأسعار
  const referencePrice = mainPrice || sortedPrices[Math.floor(length / 2)];
  
  // إيجاد أقرب مستوى دعم
  let support = sortedPrices[0];
  for (let i = 0; i < length; i++) {
    if (sortedPrices[i] < referencePrice) {
      support = sortedPrices[i];
    } else {
      break;
    }
  }
  
  // إيجاد أقرب مستوى مقاومة
  let resistance = sortedPrices[length - 1];
  for (let i = length - 1; i >= 0; i--) {
    if (sortedPrices[i] > referencePrice) {
      resistance = sortedPrices[i];
    } else {
      break;
    }
  }
  
  return { support, resistance };
};

// حساب مستوى التقلب
export const calculateVolatility = (prices: number[]) => {
  if (prices.length < 2) return 0;
  
  let volatility = 0;
  for (let i = 1; i < prices.length; i++) {
    volatility += Math.abs(prices[i] - prices[i-1]) / prices[i-1];
  }
  
  return volatility / (prices.length - 1);
};

// حساب مستويات فيبوناتشي
export const calculateFibonacciLevels = (high: number, low: number, direction?: string) => {
  const range = high - low;
  
  const retracementLevels = [
    { level: 0, price: high },
    { level: 0.236, price: high - range * 0.236 },
    { level: 0.382, price: high - range * 0.382 },
    { level: 0.5, price: high - range * 0.5 },
    { level: 0.618, price: high - range * 0.618 },
    { level: 0.786, price: high - range * 0.786 },
    { level: 1, price: low }
  ];
  
  const extensionLevels = [
    { level: 1.272, price: low - range * 0.272 },
    { level: 1.618, price: low - range * 0.618 },
    { level: 2.0, price: low - range * 1.0 },
    { level: 2.618, price: low - range * 1.618 }
  ];
  
  return { retracementLevels, extensionLevels };
};

// حساب وقف الخسارة الأمثل
export const calculateOptimalStopLoss = (
  currentPrice: number, 
  direction: "صاعد" | "هابط" | "محايد", 
  support: number, 
  resistance: number
) => {
  if (direction === "صاعد") {
    return support * 0.99; // وقف خسارة أقل من مستوى الدعم
  } else if (direction === "هابط") {
    return resistance * 1.01; // وقف خسارة أعلى من مستوى المقاومة
  } else {
    // في حالة الاتجاه المحايد
    const range = resistance - support;
    return currentPrice - (range * 0.1); // وقف خسارة بنسبة 10% من المدى
  }
};

// دعم لمؤشرات الفنية الأساسية
export const EMA = (prices: number[], period: number): number[] => {
  // تنفيذ بسيط للمتوسط المتحرك الأسي
  const ema: number[] = [];
  const k = 2 / (period + 1);
  
  // استخدام المتوسط البسيط للقيمة الأولى
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += prices[i];
  }
  ema.push(sum / period);
  
  // حساب باقي قيم EMA
  for (let i = period; i < prices.length; i++) {
    ema.push(prices[i] * k + ema[ema.length - 1] * (1 - k));
  }
  
  return ema;
};

export const RSI = (prices: number[], period: number = 14): number[] => {
  // تنفيذ بسيط لمؤشر القوة النسبية
  const rsi: number[] = [];
  const deltas = [];
  
  for (let i = 1; i < prices.length; i++) {
    deltas.push(prices[i] - prices[i - 1]);
  }
  
  for (let i = period; i < deltas.length; i++) {
    const gains = [];
    const losses = [];
    
    for (let j = i - period; j < i; j++) {
      if (deltas[j] >= 0) gains.push(deltas[j]);
      else losses.push(Math.abs(deltas[j]));
    }
    
    const avgGain = gains.reduce((sum, val) => sum + val, 0) / period;
    const avgLoss = losses.reduce((sum, val) => sum + val, 0) / period;
    
    if (avgLoss === 0) {
      rsi.push(100);
    } else {
      const rs = avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }
  }
  
  return rsi;
};

export const MACD = (prices: number[]): { macd: number[], signal: number[], histogram: number[] } => {
  // تنفيذ بسيط لمؤشر MACD
  const ema12 = EMA(prices, 12);
  const ema26 = EMA(prices, 26);
  
  // احتساب خط MACD
  const macd: number[] = [];
  for (let i = 0; i < ema12.length && i < ema26.length; i++) {
    macd.push(ema12[i] - ema26[i]);
  }
  
  // احتساب خط الإشارة (9-EMA of MACD)
  const signal = EMA(macd, 9);
  
  // احتساب الهيستوغرام
  const histogram: number[] = [];
  for (let i = 0; i < macd.length && i < signal.length; i++) {
    histogram.push(macd[i] - signal[i]);
  }
  
  return { macd, signal, histogram };
};

export const BollingerBands = (prices: number[], period: number = 20, stdDev: number = 2): 
  { upper: number[], middle: number[], lower: number[] } => {
  // تنفيذ بسيط لمؤشر بولينجر باندز
  const middle: number[] = [];
  const upper: number[] = [];
  const lower: number[] = [];
  
  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1);
    const avg = slice.reduce((sum, price) => sum + price, 0) / period;
    middle.push(avg);
    
    let squareDiffSum = 0;
    for (let j = 0; j < slice.length; j++) {
      squareDiffSum += Math.pow(slice[j] - avg, 2);
    }
    const stdDevValue = Math.sqrt(squareDiffSum / period);
    
    upper.push(avg + (stdDevValue * stdDev));
    lower.push(avg - (stdDevValue * stdDev));
  }
  
  return { upper, middle, lower };
};
