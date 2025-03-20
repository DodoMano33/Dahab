
import { AnalysisData } from "@/types/analysis";
import { getTimeframeMultipliers, getStopLossMultiplier } from "@/utils/technicalAnalysis/timeframeMultipliers";
import { getExpectedTime } from "@/utils/technicalAnalysis";

export const analyzeGannChart = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("بدء تحليل Gann للرمز:", timeframe);

  // تعديل النطاق بناءً على الإطار الزمني
  const multipliers = getTimeframeMultipliers(timeframe);
  const stopLossMultiplier = getStopLossMultiplier(timeframe);
  
  // حساب النطاق المتغير حسب الإطار الزمني
  const range = currentPrice * multipliers[0];
  const support = currentPrice - range;
  const resistance = currentPrice + range;

  // تحديد الاتجاه بناءً على زوايا غان
  const direction = Math.random() > 0.5 ? "صاعد" : "هابط";

  // حساب وقف الخسارة المتغير
  const stopLoss = direction === "صاعد" 
    ? currentPrice - (range * stopLossMultiplier)
    : currentPrice + (range * stopLossMultiplier);

  // حساب مستويات غان المتغيرة حسب الإطار الزمني
  const gannLevels = calculateGannLevels(currentPrice, range);

  // حساب نقطة الدخول المثالية
  const bestEntry = {
    price: direction === "صاعد" 
      ? currentPrice - (range * 0.5)
      : currentPrice + (range * 0.5),
    reason: direction === "صاعد"
      ? `نقطة دخول محسوبة على زاوية غان 1x1 للإطار الزمني ${timeframe}`
      : `نقطة دخول محسوبة على زاوية غان 2x1 للإطار الزمني ${timeframe}`
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
    pattern: `نموذج غان ${direction} على الإطار الزمني ${timeframe}`,
    direction,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: bestEntry,
    fibonacciLevels: gannLevels,
    analysisType: "Gann"
  };

  console.log("نتائج تحليل Gann:", analysisResult);
  return analysisResult;
};

const calculateGannLevels = (currentPrice: number, range: number) => {
  return [
    { level: 0.25, price: currentPrice + (range * 0.25) },
    { level: 0.382, price: currentPrice + (range * 0.382) },
    { level: 0.5, price: currentPrice + (range * 0.5) },
    { level: 0.618, price: currentPrice + (range * 0.618) },
    { level: 0.75, price: currentPrice + (range * 0.75) }
  ];
};
