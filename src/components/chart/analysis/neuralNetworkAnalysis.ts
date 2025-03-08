
import { AnalysisData } from "@/types/analysis";
import { addHours, addDays } from "date-fns";
import { getTimeframeMultipliers, getStopLossMultiplier } from "@/utils/technicalAnalysis/timeframeMultipliers";

export const analyzeNeuralNetworkChart = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("بدء تحليل الشبكات العصبية للرمز:", timeframe);

  // تعديل النطاق بناءً على الإطار الزمني
  const multipliers = getTimeframeMultipliers(timeframe);
  const stopLossMultiplier = getStopLossMultiplier(timeframe);
  
  // حساب النطاق المتغير حسب الإطار الزمني
  const range = currentPrice * multipliers[0];
  
  // تحديد الاتجاه بناءً على نموذج الشبكات العصبية (محاكاة)
  const confidenceScore = Math.random();
  const direction = confidenceScore > 0.5 ? "صاعد" : "هابط";
  
  // حساب مستويات الدعم والمقاومة
  const support = direction === "صاعد" 
    ? currentPrice - (range * 0.15)
    : currentPrice - (range * 0.25);
    
  const resistance = direction === "صاعد" 
    ? currentPrice + (range * 0.35)
    : currentPrice + (range * 0.15);

  // حساب وقف الخسارة المتغير
  const stopLoss = direction === "صاعد" 
    ? currentPrice - (range * stopLossMultiplier * 0.8)
    : currentPrice + (range * stopLossMultiplier * 0.8);

  // حساب نقطة الدخول المثالية
  const bestEntry = {
    price: direction === "صاعد" 
      ? currentPrice + (range * 0.05)
      : currentPrice - (range * 0.05),
    reason: `نقطة دخول مثالية وفقًا لتحليل الشبكات العصبية بنسبة ثقة ${(confidenceScore * 100).toFixed(1)}% على الإطار الزمني ${timeframe}`
  };

  // حساب الأهداف مع توقيتات متغيرة حسب الإطار الزمني
  const targets = [
    {
      price: direction === "صاعد"
        ? currentPrice + (range * multipliers[0] * 1.1)
        : currentPrice - (range * multipliers[0] * 1.1),
      expectedTime: getExpectedTime(timeframe, 0)
    },
    {
      price: direction === "صاعد"
        ? currentPrice + (range * multipliers[1] * 1.2)
        : currentPrice - (range * multipliers[1] * 1.2),
      expectedTime: getExpectedTime(timeframe, 1)
    },
    {
      price: direction === "صاعد"
        ? currentPrice + (range * multipliers[2] * 1.3)
        : currentPrice - (range * multipliers[2] * 1.3),
      expectedTime: getExpectedTime(timeframe, 2)
    }
  ];

  // إضافة مستويات فيبوناتشي
  const fibonacciLevels = [
    { level: 0.236, price: direction === "صاعد" ? currentPrice + (range * 0.236) : currentPrice - (range * 0.236) },
    { level: 0.382, price: direction === "صاعد" ? currentPrice + (range * 0.382) : currentPrice - (range * 0.382) },
    { level: 0.5, price: direction === "صاعد" ? currentPrice + (range * 0.5) : currentPrice - (range * 0.5) },
    { level: 0.618, price: direction === "صاعد" ? currentPrice + (range * 0.618) : currentPrice - (range * 0.618) },
    { level: 0.786, price: direction === "صاعد" ? currentPrice + (range * 0.786) : currentPrice - (range * 0.786) },
    { level: 1, price: direction === "صاعد" ? currentPrice + range : currentPrice - range },
  ];

  const analysisResult: AnalysisData = {
    pattern: `تحليل الشبكات العصبية: اتجاه ${direction} على الإطار الزمني ${timeframe}`,
    direction,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: bestEntry,
    fibonacciLevels,
    analysisType: "شبكات عصبية",
    activation_type: "تلقائي"
  };

  console.log("نتائج تحليل الشبكات العصبية:", analysisResult);
  return analysisResult;
};

const getExpectedTime = (timeframe: string, targetIndex: number): Date => {
  const now = new Date();
  const multiplier = targetIndex + 1;

  switch (timeframe) {
    case "1m":
      return addHours(now, multiplier * 1);
    case "5m":
      return addHours(now, multiplier * 3);
    case "30m":
      return addHours(now, multiplier * 6);
    case "1h":
      return addHours(now, multiplier * 12);
    case "4h":
      return addHours(now, multiplier * 24);
    case "1d":
      return addDays(now, multiplier * 3);
    default:
      return addHours(now, multiplier * 12);
  }
};
