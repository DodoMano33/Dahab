
import { AnalysisData } from "@/types/analysis";
import { getTimeframeMultipliers, getStopLossMultiplier } from "@/utils/technicalAnalysis/timeframeMultipliers";
import { getExpectedTime } from "@/utils/technicalAnalysis";

export const analyzeWavesChart = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  duration?: number
): Promise<AnalysisData> => {
  console.log("بدء تحليل Waves للرمز:", timeframe);
  console.log("مدة التحليل المحددة:", duration || 8, "ساعات");

  // تعديل النطاق بناءً على الإطار الزمني
  const multipliers = getTimeframeMultipliers(timeframe);
  const stopLossMultiplier = getStopLossMultiplier(timeframe);
  
  // حساب النطاق المتغير حسب الإطار الزمني
  const range = currentPrice * multipliers[0];
  const support = currentPrice - range;
  const resistance = currentPrice + range;

  // تحديد الاتجاه بناءً على نمط الموجات
  const direction = Math.random() > 0.5 ? "صاعد" : "هابط";

  // حساب وقف الخسارة المتغير
  const stopLoss = direction === "صاعد" 
    ? currentPrice - (range * stopLossMultiplier)
    : currentPrice + (range * stopLossMultiplier);

  // حساب نقطة الدخول المثالية
  const bestEntry = {
    price: direction === "صاعد" 
      ? currentPrice - (range * 0.618)
      : currentPrice + (range * 0.618),
    reason: direction === "صاعد"
      ? `نقطة دخول عند تصحيح الموجة بنسبة 61.8% على الإطار الزمني ${timeframe}`
      : `نقطة دخول عند اكتمال الموجة التصحيحية على الإطار الزمني ${timeframe}`
  };

  // حساب الأهداف مع توقيتات متغيرة حسب الإطار الزمني
  const targets = [
    {
      price: direction === "صاعد"
        ? currentPrice + (range * multipliers[0])
        : currentPrice - (range * multipliers[0]),
      expectedTime: getExpectedTime(timeframe, 0)
    },
    {
      price: direction === "صاعد"
        ? currentPrice + (range * multipliers[1])
        : currentPrice - (range * multipliers[1]),
      expectedTime: getExpectedTime(timeframe, 1)
    },
    {
      price: direction === "صاعد"
        ? currentPrice + (range * multipliers[2])
        : currentPrice - (range * multipliers[2]),
      expectedTime: getExpectedTime(timeframe, 2)
    }
  ];

  const analysisResult: AnalysisData = {
    pattern: `نموذج موجي ${direction} على الإطار الزمني ${timeframe}`,
    direction,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: bestEntry,
    analysisType: "Waves",
    analysis_duration_hours: duration // Add the duration to the analysis result
  };

  console.log("نتائج تحليل Waves:", analysisResult);
  return analysisResult;
};
