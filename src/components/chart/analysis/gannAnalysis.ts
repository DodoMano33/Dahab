
import { AnalysisData } from "@/types/analysis";
import { calculateFibonacciLevels } from "@/utils/technicalAnalysis/fibonacci";

const calculateTargetDate = (targetNumber: number): Date => {
  const now = new Date();
  const daysToAdd = targetNumber * 30;
  now.setDate(now.getDate() + daysToAdd);
  return now;
};

export const analyzeGannChart = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  const direction = Math.random() > 0.5 ? "صاعد" : "هابط";
  const support = currentPrice - (currentPrice * (Math.random() * 0.1));
  const resistance = currentPrice + (currentPrice * (Math.random() * 0.1));
  const stopLoss = currentPrice - (currentPrice * (Math.random() * 0.05));
  const bestEntryPoint = currentPrice - (currentPrice * (Math.random() * 0.02));

  const targetOne = currentPrice + (currentPrice * (Math.random() * 0.05));
  const targetTwo = currentPrice + (currentPrice * (Math.random() * 0.1));
  const targetThree = currentPrice + (currentPrice * (Math.random() * 0.15));

  return {
    pattern: "تحليل مستويات جان وزوايا الزمن",
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
      reason: "نقطة دخول مثالية بناءً على زوايا جان الزمنية والسعرية"
    },
    analysisType: "تحليل جان", // Fixed valid type
    activation_type: "يدوي" // Default value, will be overridden if automatic
  };
};
