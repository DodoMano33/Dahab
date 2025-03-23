

// حساب مستويات الدعم والمقاومة
export const calculateSupportResistance = (
  prices: number[]
): { support: number, resistance: number } => {
  try {
    if (!prices || prices.length === 0) {
      return { support: 0, resistance: 0 };
    }
    
    // ترتيب الأسعار تصاعدياً
    const sortedPrices = [...prices].sort((a, b) => a - b);
    
    // تحديد أدنى سعر كدعم وأعلى سعر كمقاومة
    const support = sortedPrices[0];
    const resistance = sortedPrices[sortedPrices.length - 1];
    
    return { support, resistance };
  } catch (error) {
    console.error("خطأ في حساب مستويات الدعم والمقاومة:", error);
    return { support: 0, resistance: 0 };
  }
};

// حساب المتوسط المتحرك البسيط
export const calculateSMA = (prices: number[], period: number): number[] => {
  const result: number[] = [];
  
  if (prices.length < period) {
    return result;
  }
  
  for (let i = period - 1; i < prices.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += prices[i - j];
    }
    result.push(sum / period);
  }
  
  return result;
};

// حساب المتوسط المتحرك الأسي
export const calculateEMA = (prices: number[], period: number): number[] => {
  const result: number[] = [];
  const k = 2 / (period + 1);
  
  // حساب SMA الأول
  let ema = prices.slice(0, period).reduce((total, price) => total + price, 0) / period;
  result.push(ema);
  
  // حساب باقي EMA
  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] * k) + (ema * (1 - k));
    result.push(ema);
  }
  
  return result;
};

// حساب المؤشر الفني RSI (مؤشر القوة النسبية)
export const calculateRSI = (prices: number[], period: number = 14): number[] => {
  const result: number[] = [];
  const changes: number[] = [];
  
  // حساب التغييرات اليومية
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }
  
  if (changes.length < period) {
    return result;
  }
  
  // حساب المتوسط الأول للمكاسب والخسائر
  let avgGain = 0;
  let avgLoss = 0;
  
  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) {
      avgGain += changes[i];
    } else {
      avgLoss += Math.abs(changes[i]);
    }
  }
  
  avgGain /= period;
  avgLoss /= period;
  
  // حساب RSI الأول
  let rs = avgGain / (avgLoss === 0 ? 0.0001 : avgLoss); // تجنب القسمة على صفر
  let rsi = 100 - (100 / (1 + rs));
  result.push(rsi);
  
  // حساب RSI المتبقي
  for (let i = period; i < changes.length; i++) {
    const currentGain = changes[i] > 0 ? changes[i] : 0;
    const currentLoss = changes[i] < 0 ? Math.abs(changes[i]) : 0;
    
    avgGain = ((avgGain * (period - 1)) + currentGain) / period;
    avgLoss = ((avgLoss * (period - 1)) + currentLoss) / period;
    
    rs = avgGain / (avgLoss === 0 ? 0.0001 : avgLoss);
    rsi = 100 - (100 / (1 + rs));
    
    result.push(rsi);
  }
  
  return result;
};

// حساب MACD (مؤشر تقارب وتباعد المتوسطات المتحركة)
export const calculateMACD = (
  prices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): { macdLine: number[], signalLine: number[], histogram: number[] } => {
  // حساب المتوسطات المتحركة
  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);
  
  // تأكد من أن المصفوفتين لهما نفس الطول (نأخذ القيم من آخر مصفوفة slowEMA)
  const macdLine: number[] = [];
  const offset = slowEMA.length - fastEMA.length;
  
  for (let i = 0; i < slowEMA.length; i++) {
    if (i >= offset) {
      macdLine.push(fastEMA[i - offset] - slowEMA[i]);
    }
  }
  
  // حساب خط الإشارة (EMA لخط MACD)
  const signalLine = calculateEMA(macdLine, signalPeriod);
  
  // حساب الهيستوغرام (الفرق بين خط MACD وخط الإشارة)
  const histogram: number[] = [];
  const signalOffset = macdLine.length - signalLine.length;
  
  for (let i = 0; i < macdLine.length; i++) {
    if (i >= signalOffset) {
      histogram.push(macdLine[i] - signalLine[i - signalOffset]);
    }
  }
  
  return { macdLine, signalLine, histogram };
};

// حساب Bollinger Bands
export const calculateBollingerBands = (
  prices: number[],
  period: number = 20,
  stdDev: number = 2
): { upper: number[], middle: number[], lower: number[] } => {
  const middle = calculateSMA(prices, period);
  const upper: number[] = [];
  const lower: number[] = [];
  
  // حساب الانحراف المعياري وحدود Bollinger
  for (let i = period - 1; i < prices.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += Math.pow(prices[i - j] - middle[i - period + 1], 2);
    }
    const standardDeviation = Math.sqrt(sum / period);
    
    upper.push(middle[i - period + 1] + (standardDeviation * stdDev));
    lower.push(middle[i - period + 1] - (standardDeviation * stdDev));
  }
  
  return { upper, middle, lower };
};

