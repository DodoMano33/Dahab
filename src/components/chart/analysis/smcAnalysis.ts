
import { AnalysisData } from "@/types/analysis";
import { getTimeframeMultipliers } from "@/utils/technicalAnalysis/timeframeMultipliers";
import { getExpectedTime } from "@/utils/technicalAnalysis";
import { 
  detectTrend, 
  calculateSupportResistance, 
  calculateOptimalStopLoss,
  calculateFibonacciLevels
} from "@/utils/technicalAnalysis/indicators";
import { detectCandlePatterns, convertToPriceData } from "@/utils/technicalAnalysis/candlePatterns";
import {
  calculateSMCStopLoss,
  calculateSMCTargets,
  calculateSMCEntryPoint,
  detectSMCPattern
} from "./smc/smcCalculations";

export const analyzeSMCChart = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  duration?: number
): Promise<AnalysisData> => {
  console.log("بدء تحليل SMC للرمز:", timeframe, "بسعر حالي:", currentPrice);
  
  // محاكاة بيانات الأسعار التاريخية (في التطبيق الحقيقي ستأتي من API)
  const simulatedPrices: number[] = [];
  const volatility = 0.015; // نسبة التقلب
  
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
  
  // استخدام حسابات SMC المخصصة
  const stopLoss = calculateSMCStopLoss(
    currentPrice, 
    direction as "صاعد" | "هابط" | "محايد", 
    support, 
    resistance, 
    timeframe
  );
  
  // حساب مستويات فيبوناتشي
  const highPrice = Math.max(...simulatedPrices.slice(-50));
  const lowPrice = Math.min(...simulatedPrices.slice(-50));
  const fibLevels = calculateFibonacciLevels(
    highPrice, 
    lowPrice, 
    direction as "صاعد" | "هابط" | "محايد"
  );
  
  // حساب الأهداف المبنية على السعر باستخدام حسابات SMC
  const smcTargetPrices = calculateSMCTargets(
    currentPrice, 
    direction as "صاعد" | "هابط" | "محايد", 
    support, 
    resistance, 
    timeframe
  );
  
  // تحويل الأسعار إلى أهداف مع أوقات متوقعة
  const targets = smcTargetPrices.map((price, index) => ({
    price,
    expectedTime: getExpectedTime(timeframe, index)
  }));
  
  // تحديد نقطة الدخول المثالية باستخدام حسابات SMC
  const bestEntry = calculateSMCEntryPoint(
    currentPrice, 
    direction as "صاعد" | "هابط" | "محايد", 
    support, 
    resistance, 
    timeframe
  );
  
  // تحديد نمط السوق استنادًا إلى استراتيجية SMC
  let patternDescription = detectSMCPattern(
    direction as "صاعد" | "هابط" | "محايد",
    timeframe
  );
  
  if (patterns.length > 0) {
    const strongestPattern = patterns.sort((a, b) => b.confidence - a.confidence)[0];
    patternDescription += ` مع نمط ${strongestPattern.pattern} (${strongestPattern.description})`;
  }
  
  const analysisResult: AnalysisData = {
    pattern: patternDescription,
    direction: direction === "محايد" ? (Math.random() > 0.5 ? "صاعد" : "هابط") : direction as "صاعد" | "هابط" | "محايد",
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: bestEntry,
    analysisType: "نظرية هيكل السوق",
    analysis_duration_hours: duration || 36
  };
  
  console.log("نتائج تحليل SMC:", analysisResult);
  return analysisResult;
};
