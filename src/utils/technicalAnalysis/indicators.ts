
import { 
  EMA, SMA, WMA, 
  RSI, MACD, ADX, 
  BollingerBands, 
  StochasticRSI, 
  IchimokuCloud, 
  Stochastic 
} from "technicalindicators";

export type PriceData = {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

// وظيفة للكشف عن الاتجاه باستخدام المؤشرات المتعددة
export const detectTrend = (prices: number[], period: number = 14): "صاعد" | "هابط" | "محايد" => {
  if (prices.length < period) {
    console.warn("البيانات غير كافية للتحليل، مطلوب على الأقل", period, "نقطة سعر");
    return "محايد";
  }

  try {
    // حساب RSI
    const rsiValues = RSI.calculate({
      period,
      values: prices
    });
    const lastRSI = rsiValues[rsiValues.length - 1];

    // حساب MACD
    const macdResult = MACD.calculate({
      values: prices,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    });
    const lastMACD = macdResult[macdResult.length - 1];

    // حساب المتوسطات المتحركة
    const ema50 = EMA.calculate({
      period: Math.min(50, Math.floor(prices.length / 2)),
      values: prices
    });
    
    const ema200 = EMA.calculate({
      period: Math.min(200, Math.floor(prices.length / 4)),
      values: prices
    });

    // تجميع الإشارات
    let bullishSignals = 0;
    let bearishSignals = 0;

    // إشارات RSI
    if (lastRSI > 60) bullishSignals++;
    else if (lastRSI < 40) bearishSignals++;

    // إشارات MACD
    if (lastMACD.histogram > 0 && lastMACD.MACD > lastMACD.signal) bullishSignals++;
    else if (lastMACD.histogram < 0 && lastMACD.MACD < lastMACD.signal) bearishSignals++;

    // إشارات المتوسطات المتحركة
    if (ema50.length > 0 && ema200.length > 0) {
      if (ema50[ema50.length - 1] > ema200[ema200.length - 1]) bullishSignals++;
      else if (ema50[ema50.length - 1] < ema200[ema200.length - 1]) bearishSignals++;
    }

    // تحليل الاتجاه الحالي (الأسعار الأخيرة)
    const recentPrices = prices.slice(-5);
    if (recentPrices[recentPrices.length - 1] > recentPrices[0]) bullishSignals++;
    else if (recentPrices[recentPrices.length - 1] < recentPrices[0]) bearishSignals++;

    // تحديد الاتجاه النهائي
    if (bullishSignals >= bearishSignals + 2) return "صاعد";
    else if (bearishSignals >= bullishSignals + 2) return "هابط";
    else return "محايد";
  } catch (error) {
    console.error("خطأ أثناء تحليل الاتجاه:", error);
    return "محايد";
  }
};

// وظيفة لحساب مستويات الدعم والمقاومة
export const calculateSupportResistance = (
  prices: number[],
  periods: number = 20
): { support: number, resistance: number } => {
  try {
    // استخدام Bollinger Bands لتقدير الدعم والمقاومة
    const bollingerResult = BollingerBands.calculate({
      period: periods,
      values: prices,
      stdDev: 2
    });
    
    const lastBollinger = bollingerResult[bollingerResult.length - 1];
    
    return {
      support: lastBollinger.lower,
      resistance: lastBollinger.upper
    };
  } catch (error) {
    console.error("خطأ في حساب الدعم والمقاومة:", error);
    // قيم افتراضية في حالة الخطأ
    const currentPrice = prices[prices.length - 1];
    return {
      support: currentPrice * 0.98,
      resistance: currentPrice * 1.02
    };
  }
};

// وظيفة لحساب مستويات فيبوناتشي
export const calculateFibonacciLevels = (
  highPrice: number,
  lowPrice: number,
  direction: "صاعد" | "هابط" | "محايد" = "صاعد"
): { level: number; price: number }[] => {
  // مستويات فيبوناتشي الرئيسية
  const fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.27, 1.618];
  const range = highPrice - lowPrice;
  
  return fibLevels.map(level => {
    let price;
    if (direction === "صاعد") {
      // للاتجاه الصاعد، نحسب المستويات تصاعديًا من أدنى سعر
      price = lowPrice + (range * level);
    } else if (direction === "هابط") {
      // للاتجاه الهابط، نحسب المستويات تنازليًا من أعلى سعر
      price = highPrice - (range * level);
    } else {
      // للاتجاه المحايد، نحسب من منتصف النطاق
      const midPrice = (highPrice + lowPrice) / 2;
      price = midPrice + (range * (level - 0.5));
    }
    
    return { level, price: Number(price.toFixed(2)) };
  });
};

// وظيفة لحساب نقاط وقف الخسارة المُحسّنة
export const calculateOptimalStopLoss = (
  prices: number[],
  direction: "صاعد" | "هابط" | "محايد",
  riskPercentage: number = 2
): number => {
  try {
    const currentPrice = prices[prices.length - 1];
    
    // حساب التقلب (Volatility) باستخدام الانحراف المعياري
    const volatility = calculateVolatility(prices, 14);
    
    // تحديد نسبة وقف الخسارة بناءً على التقلب والاتجاه
    let stopLossPercentage = riskPercentage;
    
    // زيادة النسبة للأسواق شديدة التقلب
    if (volatility > 0.02) { // تقلب عالٍ
      stopLossPercentage = riskPercentage * 1.5;
    } else if (volatility < 0.01) { // تقلب منخفض
      stopLossPercentage = riskPercentage * 0.8;
    }
    
    // حساب قيمة وقف الخسارة
    if (direction === "صاعد") {
      return Number((currentPrice * (1 - stopLossPercentage / 100)).toFixed(2));
    } else if (direction === "هابط") {
      return Number((currentPrice * (1 + stopLossPercentage / 100)).toFixed(2));
    } else {
      // للاتجاه المحايد، نستخدم ATR للحصول على مسافة وقف خسارة معقولة
      const atrValue = calculateATR(prices, 14);
      return direction === "صاعد" 
        ? Number((currentPrice - atrValue * 2).toFixed(2)) 
        : Number((currentPrice + atrValue * 2).toFixed(2));
    }
  } catch (error) {
    console.error("خطأ في حساب وقف الخسارة:", error);
    // قيمة افتراضية في حالة الخطأ
    const currentPrice = prices[prices.length - 1];
    return direction === "صاعد" 
      ? currentPrice * 0.97 
      : currentPrice * 1.03;
  }
};

// وظيفة حساب متوسط المدى الحقيقي (ATR)
export const calculateATR = (prices: number[], period: number = 14): number => {
  // في النسخة المبسطة، نستخدم نطاق الأسعار كبديل للـ ATR
  const ranges = [];
  for (let i = 1; i < prices.length; i++) {
    ranges.push(Math.abs(prices[i] - prices[i - 1]));
  }
  
  // حساب متوسط النطاقات
  const sum = ranges.slice(-period).reduce((a, b) => a + b, 0);
  return sum / Math.min(period, ranges.length);
};

// حساب تقلب الأسعار (Volatility)
export const calculateVolatility = (prices: number[], period: number = 14): number => {
  // حساب التغيرات اليومية كنسبة مئوية
  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    const change = Math.abs((prices[i] - prices[i - 1]) / prices[i - 1]);
    changes.push(change);
  }
  
  // حساب متوسط التغيرات للفترة المحددة
  const recentChanges = changes.slice(-period);
  const avg = recentChanges.reduce((a, b) => a + b, 0) / recentChanges.length;
  
  return avg;
};

// وظيفة مساعدة لتحويل البيانات إلى التنسيق المطلوب لبعض المؤشرات
export const prepareDataForIndicators = (data: PriceData[]): {
  open: number[],
  high: number[],
  low: number[],
  close: number[],
  volume: number[]
} => {
  return {
    open: data.map(d => d.open),
    high: data.map(d => d.high),
    low: data.map(d => d.low),
    close: data.map(d => d.close),
    volume: data.map(d => d.volume || 0)
  };
};
