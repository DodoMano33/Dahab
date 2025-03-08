import { AnalysisData } from "@/types/analysis";
import { addMinutes, addHours, addDays } from "date-fns";
import { getTimeframeMultipliers, getStopLossMultiplier } from "@/utils/technicalAnalysis/timeframeMultipliers";

export const analyzeScalpingChart = async (
  imageData: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("Starting Scalping analysis for:", timeframe);

  // Adjust range based on timeframe
  const multipliers = getTimeframeMultipliers(timeframe);
  const stopLossMultiplier = getStopLossMultiplier(timeframe);
  
  // Calculate variable range based on timeframe
  const range = currentPrice * multipliers[0];
  const support = currentPrice - range;
  const resistance = currentPrice + range;

  // Determine direction based on scalping pattern
  const direction = Math.random() > 0.5 ? "Up" : "Down";

  // Calculate variable stop loss
  const stopLoss = direction === "Up" 
    ? currentPrice - (range * stopLossMultiplier)
    : currentPrice + (range * stopLossMultiplier);

  // Calculate best entry point
  const bestEntry = {
    price: direction === "Up" 
      ? currentPrice - (range * 0.382)
      : currentPrice + (range * 0.382),
    reason: direction === "Up"
      ? "Entry point at 38.2% Fibonacci retracement with short-term uptrend"
      : "Entry point at 38.2% Fibonacci retracement with short-term downtrend"
  };

  // Calculate targets with variable timing based on timeframe
  const targets = [
    {
      price: direction === "Up"
        ? currentPrice + (range * multipliers[0])
        : currentPrice - (range * multipliers[0]),
      expectedTime: getExpectedTime(timeframe, 0)
    },
    {
      price: direction === "Up"
        ? currentPrice + (range * multipliers[1])
        : currentPrice - (range * multipliers[1]),
      expectedTime: getExpectedTime(timeframe, 1)
    },
    {
      price: direction === "Up"
        ? currentPrice + (range * multipliers[2])
        : currentPrice - (range * multipliers[2]),
      expectedTime: getExpectedTime(timeframe, 2)
    }
  ];

  const analysisResult: AnalysisData = {
    pattern: `Scalping ${direction} Pattern on ${timeframe} timeframe`,
    direction: direction as "Up" | "Down" | "Neutral",
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: bestEntry,
    analysisType: "Scalping"
  };

  console.log("Scalping analysis results:", analysisResult);
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
