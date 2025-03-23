
import { AnalysisData } from "@/types/analysis";
import { getTimeframeMultipliers } from "@/utils/technicalAnalysis/timeframeMultipliers";
import { getExpectedTime } from "@/utils/technicalAnalysis";
import { 
  detectTrend, 
  calculateSupportResistance, 
  calculateOptimalStopLoss,
  calculateVolatility
} from "@/utils/technicalAnalysis/indicators";
import { detectCandlePatterns, convertToPriceData } from "@/utils/technicalAnalysis/candlePatterns";

export const analyzePriceAction = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  duration?: number
): Promise<AnalysisData> => {
  console.log("بدء تحليل حركة السعر للرمز:", timeframe, "بسعر حالي:", currentPrice);
  
  // محاكاة بيانات الأسعار التاريخية (في التطبيق الحقيقي ستأتي من API)
  const simulatedPrices: number[] = [];
  const volatility = 0.012; // نسبة التقلب
  
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
  
  // محاكاة بيانات OHLC
  const timestamps = Array.from({ length: simulatedPrices.length }, (_, i) => Date.now() - (simulatedPrices.length - i) * 3600000);
  const open = simulatedPrices.map((price, i) => i === 0 ? price : simulatedPrices[i-1]);
  const high = simulatedPrices.map(price => price * (1 + Math.random() * 0.005));
  const low = simulatedPrices.map(price => price * (1 - Math.random() * 0.005));
  const close = simulatedPrices;
  
  // تحويل البيانات لتنسيق PriceData لتحليل أنماط الشموع
  const candleData = convertToPriceData(timestamps, open, high, low, close);
  
  // استخدام المؤشرات الجديدة لتحليل البيانات
  const direction = detectTrend(simulatedPrices);
  
  // تحليل أنماط الشموع
  const patterns = detectCandlePatterns(candleData);
  
  // حساب الدعم والمقاومة
  const { support, resistance } = calculateSupportResistance(simulatedPrices);
  
  // حساب وقف الخسارة المثالي باستخدام مستويات التقلب
  const actualVolatility = calculateVolatility(simulatedPrices, 14);
  const stopLossPercent = Math.max(1, Math.min(3, actualVolatility * 100 * 2));
  const stopLoss = direction === "صاعد" 
    ? currentPrice * (1 - stopLossPercent / 100)
    : currentPrice * (1 + stopLossPercent / 100);
  
  // تحديد مدى الأهداف باستخدام ضعف وقف الخسارة (نسبة المخاطرة إلى المكافأة 1:2)
  const targetPercent = stopLossPercent * 2;
  
  // تحديد أهداف السعر
  const multipliers = getTimeframeMultipliers(timeframe);
  const targets = [
    {
      price: direction === "صاعد" 
        ? currentPrice * (1 + targetPercent / 100)
        : currentPrice * (1 - targetPercent / 100),
      expectedTime: getExpectedTime(timeframe, 0)
    },
    {
      price: direction === "صاعد"
        ? currentPrice * (1 + targetPercent / 100 * 1.5)
        : currentPrice * (1 - targetPercent / 100 * 1.5),
      expectedTime: getExpectedTime(timeframe, 1)
    },
    {
      price: direction === "صاعد"
        ? currentPrice * (1 + targetPercent / 100 * 2)
        : currentPrice * (1 - targetPercent / 100 * 2),
      expectedTime: getExpectedTime(timeframe, 2)
    }
  ];
  
  // تحديد نقطة الدخول المثالية
  let entryPrice = currentPrice;
  let entryReason = "";
  
  // تخصيص نقطة الدخول حسب الاتجاه وأنماط الشموع
  if (patterns.length > 0) {
    const strongestPattern = patterns.sort((a, b) => b.confidence - a.confidence)[0];
    
    if (strongestPattern.signal === "صاعد" && direction === "صاعد") {
      // نقطة دخول أدنى قليلاً من السعر الحالي للاتجاه الصاعد
      entryPrice = currentPrice * 0.995;
      entryReason = `نقطة دخول مثالية عند انعكاس نمط ${strongestPattern.pattern} الصاعد`;
    } else if (strongestPattern.signal === "هابط" && direction === "هابط") {
      // نقطة دخول أعلى قليلاً من السعر الحالي للاتجاه الهابط
      entryPrice = currentPrice * 1.005;
      entryReason = `نقطة دخول مثالية عند انعكاس نمط ${strongestPattern.pattern} الهابط`;
    } else {
      // في حالة تعارض الإشارات
      entryPrice = currentPrice;
      entryReason = "نقطة دخول في السعر الحالي بسبب إشارات متضاربة";
    }
  } else {
    // إذا لم يتم العثور على أنماط، استخدم مستويات الدعم والمقاومة
    if (direction === "صاعد") {
      entryPrice = Math.max(support, currentPrice * 0.99);
      entryReason = "نقطة دخول بالقرب من مستوى الدعم في حركة سعر صاعدة";
    } else {
      entryPrice = Math.min(resistance, currentPrice * 1.01);
      entryReason = "نقطة دخول بالقرب من مستوى المقاومة في حركة سعر هابطة";
    }
  }
  
  const bestEntry = {
    price: entryPrice,
    reason: entryReason
  };
  
  // تحديد وصف النمط
  let patternDescription = "تحليل حركة السعر: ";
  
  if (patterns.length > 0) {
    const topPatterns = patterns.sort((a, b) => b.confidence - a.confidence).slice(0, 2);
    patternDescription += topPatterns.map(p => p.pattern).join(" و ");
  } else {
    patternDescription += `اتجاه ${direction === "صاعد" ? "صاعد" : "هابط"} على الإطار الزمني ${timeframe}`;
  }
  
  // إضافة تقييم قوة التقلب
  let volatilityDesc = "";
  if (actualVolatility < 0.01) {
    volatilityDesc = "منخفض";
  } else if (actualVolatility < 0.02) {
    volatilityDesc = "متوسط";
  } else {
    volatilityDesc = "مرتفع";
  }
  
  patternDescription += ` مع تقلب ${volatilityDesc}`;
  
  const analysisResult: AnalysisData = {
    pattern: patternDescription,
    direction: direction === "محايد" ? (Math.random() > 0.5 ? "صاعد" : "هابط") : direction,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: bestEntry,
    analysisType: "حركة السعر",
    analysis_duration_hours: duration || 36
  };
  
  console.log("نتائج تحليل حركة السعر:", analysisResult);
  return analysisResult;
};
