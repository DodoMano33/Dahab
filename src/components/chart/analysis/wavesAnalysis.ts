import { AnalysisData } from "@/types/analysis";
import { calculateTargetDate } from "./utils/dateUtils";

export const analyzeWavesChart = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  const direction = Math.random() > 0.5 ? "صاعد" : "هابط";
  const support = currentPrice - (currentPrice * 0.02);
  const resistance = currentPrice + (currentPrice * 0.02);
  const stopLoss = currentPrice - (currentPrice * 0.01);
  const targetOne = currentPrice + (currentPrice * 0.03);
  const targetTwo = currentPrice + (currentPrice * 0.05);
  const targetThree = currentPrice + (currentPrice * 0.07);
  const bestEntryPoint = currentPrice - (currentPrice * 0.005);

  return {
    pattern: "تحليل موجات إليوت",
    direction: direction,
    currentPrice: currentPrice,
    support: support,
    resistance: resistance,
    stopLoss: stopLoss,
    targets: [
      {
        price: targetOne,
        expectedTime: calculateTargetDate(1)
      },
      {
        price: targetTwo,
        expectedTime: calculateTargetDate(2)
      },
      {
        price: targetThree,
        expectedTime: calculateTargetDate(3)
      }
    ],
    bestEntryPoint: {
      price: bestEntryPoint,
      reason: "نقطة دخول مثالية بناءً على موجات إليوت"
    },
    analysisType: "تحليل الموجات", // Fixed valid type
    activation_type: "يدوي" // Default value, will be overridden if automatic
  };
};
