
import { AnalysisData } from "@/types/analysis";
import { getTimeframeMultipliers } from "@/utils/technicalAnalysis/timeframeMultipliers";
import { getExpectedTime } from "@/utils/technicalAnalysis";
import { 
  detectTrend, 
  calculateSupportResistance, 
  calculateOptimalStopLoss,
  calculateVolatility
} from "@/utils/technicalAnalysis/indicators/PriceData";

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
  
  // توليد بيانات محاكاة للتحليل
  for (let i = 0; i < 100; i++) {
    if (i === 0) {
      simulatedPrices.push(currentPrice * (1 - volatility));
    } else {
      const change = (Math.random() - 0.5) * volatility * 2;
      simulatedPrices.push(simulatedPrices[i - 1] * (1 + change));
    }
  }
  simulatedPrices.push(currentPrice);
  
  // استخدام المؤشرات الفنية لتحليل البيانات
  const direction = detectTrend(simulatedPrices);
  
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
  const entryPrice = direction === "صاعد" 
    ? currentPrice * 0.995 
    : currentPrice * 1.005;
  
  const bestEntry = {
    price: entryPrice,
    reason: `نقطة دخول مثالية للاتجاه ${direction} على الإطار الزمني ${timeframe}`
  };
  
  // تحديد وصف النمط
  const patternDescription = `تحليل حركة السعر: اتجاه ${direction} على الإطار الزمني ${timeframe}`;
  
  const analysisResult: AnalysisData = {
    pattern: patternDescription,
    direction,
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
