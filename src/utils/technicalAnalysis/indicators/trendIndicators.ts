
import { 
  EMA, SMA, WMA, 
  RSI, MACD, ADX, 
  StochasticRSI 
} from "technicalindicators";
import { TrendDirection } from "./types";

// وظيفة للكشف عن الاتجاه باستخدام المؤشرات المتعددة
export const detectTrend = (prices: number[], period: number = 14): TrendDirection => {
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
