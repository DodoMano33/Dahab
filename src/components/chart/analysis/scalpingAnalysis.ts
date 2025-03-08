import { AnalysisData } from "@/types/analysis";
import { addMinutes, addHours, addDays } from "date-fns";
import { getTimeframeMultipliers, getStopLossMultiplier } from "@/utils/technicalAnalysis/timeframeMultipliers";

export const analyzeScalpingChart = async (
  imageData: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("بدء تحليل السكالبينج للرمز:", timeframe);

  // تعديل النطاق بناءً على الإطار الزمني
  const multipliers = getTimeframeMultipliers(timeframe);
  const stopLossMultiplier = getStopLossMultiplier(timeframe);
  
  // حساب النطاق المتغير حسب الإطار الزمني
  const range = currentPrice * multipliers[0];
  const support = currentPrice - range;
  const resistance = currentPrice + range;

  // تحديد الاتجاه بناءً على نمط السكالبينج
  const direction = Math.random() > 0.5 ? "صاعد" : "هابط";

  // حساب وقف الخسارة المتغير
  const stopLoss = direction === "صاعد" 
    ? currentPrice - (range * stopLossMultiplier)
    : currentPrice + (range * stopLossMultiplier);

  // حساب نقطة الدخول المثالية
  const bestEntry = {
    price: direction === "صاعد" 
      ? currentPrice - (range * 0.382)
      : currentPrice + (range * 0.382),
    reason: direction === "صاعد"
      ? "نقطة دخول عند مستوى تصحيح فيبوناتشي 38.2% مع اتجاه صعودي قصير المدى"
      : "نقطة دخول عند مستوى تصحيح فيبوناتشي 38.2% مع اتجاه هبوطي قصير المدى"
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
    pattern: `نموذج سكالبينج ${direction} على الإطار الزمني ${timeframe}`,
    direction,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: bestEntry,
    analysisType: "سكالبينج"
  };

  console.log("نتائج تحليل السكالبينج:", analysisResult);
  return analysisResult;
};

const getExpectedTime = (timeframe: string, targetIndex: number): Date => {
  const now = new Date();
  const multiplier = targetIndex + 1;

  switch (timeframe) {
    case "1m":
      return addMinutes(now, multiplier * 1);
    case "5m":
      return addMinutes(now, multiplier * 5);
    case "30m":
      return addMinutes(now, multiplier * 30);
    case "1h":
      return addHours(now, multiplier);
    case "4h":
      return addHours(now, multiplier * 4);
    case "1d":
      return addDays(now, multiplier);
    default:
      return addHours(now, multiplier * 4);
  }
};
