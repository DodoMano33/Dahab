
import { AnalysisData } from "@/types/analysis";
import { getTimeframeMultipliers, getStopLossMultiplier } from "@/utils/technicalAnalysis/timeframeMultipliers";
import { getExpectedTime } from "@/utils/technicalAnalysis";
import { EMA, RSI, BollingerBands, MACD } from "technicalindicators";

// وظيفة للكشف عن الاتجاهات بناءً على المؤشرات الفنية
const detectTrend = (prices: number[]): "صاعد" | "هابط" => {
  if (prices.length < 14) {
    return Math.random() > 0.5 ? "صاعد" : "هابط"; // إذا كانت البيانات غير كافية
  }

  // استخدام RSI للكشف عن الاتجاه
  const rsiValues = RSI.calculate({
    period: 14,
    values: prices
  });

  const lastRSI = rsiValues[rsiValues.length - 1];
  
  // استخدام MACD للتأكيد
  const macdResult = MACD.calculate({
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    values: prices
  });
  
  const lastMACD = macdResult[macdResult.length - 1];
  
  // تحديد الاتجاه بناءً على تحليل مشترك للمؤشرات
  if (lastRSI > 50 && lastMACD.histogram > 0) {
    return "صاعد";
  } else if (lastRSI < 50 && lastMACD.histogram < 0) {
    return "هابط";
  } else {
    // استخدام المتوسط المتحرك للكشف عن الاتجاه العام
    const ema50 = EMA.calculate({
      period: 50,
      values: prices
    });
    
    const ema200 = EMA.calculate({
      period: 200,
      values: prices.slice(0, prices.length)
    });
    
    if (ema50[ema50.length - 1] > ema200[ema200.length - 1]) {
      return "صاعد";
    } else {
      return "هابط";
    }
  }
};

// وظيفة حساب مستويات فيبوناتشي
const calculateFibonacciLevels = (
  highPrice: number,
  lowPrice: number,
  direction: "صاعد" | "هابط"
): { level: number; price: number }[] => {
  const fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
  const range = direction === "صاعد" ? (highPrice - lowPrice) : (lowPrice - highPrice);
  
  return fibLevels.map(level => {
    let price;
    if (direction === "صاعد") {
      price = lowPrice + (range * level);
    } else {
      price = highPrice - (range * level);
    }
    return { level, price };
  });
};

// تحليل الموجات الفعلي
export const analyzeWavesChart = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  duration?: number
): Promise<AnalysisData> => {
  console.log("بدء تحليل Waves للرمز:", timeframe);
  console.log("مدة التحليل المحددة:", duration || 36, "ساعات");

  // محاكاة بيانات الأسعار التاريخية (في التطبيق الحقيقي ستأتي من API)
  const simulatedPrices: number[] = [];
  const volatility = 0.01; // نسبة التقلب
  
  // توليد 200 سعر تاريخي للمحاكاة
  for (let i = 0; i < 200; i++) {
    if (i === 0) {
      simulatedPrices.push(currentPrice * (1 - volatility));
    } else {
      const change = (Math.random() - 0.5) * volatility * 2;
      simulatedPrices.push(simulatedPrices[i - 1] * (1 + change));
    }
  }
  simulatedPrices.push(currentPrice);

  // تعديل النطاق بناءً على الإطار الزمني
  const multipliers = getTimeframeMultipliers(timeframe);
  const stopLossMultiplier = getStopLossMultiplier(timeframe);
  
  // استخدام البيانات لتحديد الاتجاه
  const direction = detectTrend(simulatedPrices);
  
  // حساب الدعم والمقاومة باستخدام Bollinger Bands
  const bollingerResult = BollingerBands.calculate({
    period: 20,
    values: simulatedPrices,
    stdDev: 2
  });
  
  const lastBollinger = bollingerResult[bollingerResult.length - 1];
  const support = lastBollinger.lower;
  const resistance = lastBollinger.upper;
  
  // تحديد أعلى وأدنى سعر للفترة السابقة
  const highPrice = Math.max(...simulatedPrices.slice(-50));
  const lowPrice = Math.min(...simulatedPrices.slice(-50));
  
  // حساب مستويات فيبوناتشي
  const fibLevels = calculateFibonacciLevels(highPrice, lowPrice, direction);
  
  // حساب وقف الخسارة بناء على مستويات فيبوناتشي
  const stopLossLevel = direction === "صاعد" ? fibLevels[1] : fibLevels[5]; // استخدام 0.236 للصعودي و 0.786 للهبوطي
  const stopLoss = stopLossLevel.price;
  
  // تحديد نقطة الدخول المثالية
  const bestEntryLevel = direction === "صاعد" ? fibLevels[2] : fibLevels[4]; // استخدام 0.382 للصعودي و 0.618 للهبوطي
  const bestEntry = {
    price: bestEntryLevel.price,
    reason: direction === "صاعد"
      ? `نقطة دخول عند تصحيح الموجة بنسبة ${bestEntryLevel.level * 100}% على الإطار الزمني ${timeframe}`
      : `نقطة دخول عند اكتمال الموجة التصحيحية بنسبة ${(1 - bestEntryLevel.level) * 100}% على الإطار الزمني ${timeframe}`
  };

  // حساب الأهداف باستخدام مستويات فيبوناتشي المتبقية
  const targetLevels = direction === "صاعد" 
    ? [fibLevels[4], fibLevels[5], fibLevels[6]] 
    : [fibLevels[2], fibLevels[1], fibLevels[0]];
  
  const targets = targetLevels.map((level, index) => ({
    price: level.price,
    expectedTime: getExpectedTime(timeframe, index)
  }));

  const analysisResult: AnalysisData = {
    pattern: `نموذج موجي ${direction} مع مستويات فيبوناتشي على الإطار الزمني ${timeframe}`,
    direction,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: bestEntry,
    analysisType: "Waves",
    analysis_duration_hours: duration || 36 // استخدام مدة التحليل المقدمة أو الافتراضية
  };

  console.log("نتائج تحليل Waves:", analysisResult);
  return analysisResult;
};
