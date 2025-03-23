
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
  
  // حساب وقف الخسارة المثالي
  const stopLoss = calculateOptimalStopLoss(simulatedPrices, direction as "صاعد" | "هابط" | "محايد");
  
  // حساب مستويات فيبوناتشي
  const highPrice = Math.max(...simulatedPrices.slice(-50));
  const lowPrice = Math.min(...simulatedPrices.slice(-50));
  const fibLevels = calculateFibonacciLevels(
    highPrice, 
    lowPrice, 
    direction as "صاعد" | "هابط" | "محايد"
  );
  
  // تحديد أهداف السعر بناءً على مستويات فيبوناتشي
  let targets = [];
  
  if (direction === "صاعد") {
    // للاتجاه الصاعد، استخدم مستويات أعلى من السعر الحالي
    const upLevels = fibLevels.filter(level => level.price > currentPrice).slice(0, 3);
    
    targets = upLevels.map((level, index) => ({
      price: level.price,
      expectedTime: getExpectedTime(timeframe, index)
    }));
  } else if (direction === "هابط") {
    // للاتجاه الهابط، استخدم مستويات أقل من السعر الحالي
    const downLevels = fibLevels.filter(level => level.price < currentPrice).slice(0, 3);
    
    targets = downLevels.map((level, index) => ({
      price: level.price,
      expectedTime: getExpectedTime(timeframe, index)
    }));
  } else {
    // للاتجاه المحايد، استخدم مستويات حول السعر الحالي
    targets = [
      {
        price: currentPrice * 1.02,
        expectedTime: getExpectedTime(timeframe, 0)
      },
      {
        price: currentPrice * 0.98,
        expectedTime: getExpectedTime(timeframe, 1)
      }
    ];
  }
  
  // تأكد من أن لدينا على الأقل هدفًا واحدًا
  if (targets.length === 0) {
    const multipliers = getTimeframeMultipliers(timeframe);
    targets = [
      {
        price: direction === "صاعد" ? currentPrice * (1 + multipliers[0]) : currentPrice * (1 - multipliers[0]),
        expectedTime: getExpectedTime(timeframe, 0)
      }
    ];
  }
  
  // تحديد نقطة الدخول المثالية
  const bestEntry = {
    price: direction === "صاعد" 
      ? Math.min(currentPrice * 0.995, support * 1.005) 
      : Math.max(currentPrice * 1.005, resistance * 0.995),
    reason: direction === "صاعد"
      ? "نقطة دخول بالقرب من مستوى الدعم مع هيكل سوق صاعد"
      : "نقطة دخول بالقرب من مستوى المقاومة مع هيكل سوق هابط"
  };
  
  // تحديد نمط السوق استنادًا إلى أنماط الشموع المكتشفة
  let patternDescription = `هيكل سوق ${direction === "صاعد" ? "صاعد" : direction === "هابط" ? "هابط" : "محايد"}`;
  
  if (patterns.length > 0) {
    const strongestPattern = patterns.sort((a, b) => b.confidence - a.confidence)[0];
    patternDescription += ` مع نمط ${strongestPattern.pattern} (${strongestPattern.description})`;
  }
  
  const analysisResult: AnalysisData = {
    pattern: patternDescription,
    direction: direction === "محايد" ? (Math.random() > 0.5 ? "صاعد" : "هابط") : direction,
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
