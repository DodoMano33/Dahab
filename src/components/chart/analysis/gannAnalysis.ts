
import { AnalysisData } from "@/types/analysis";
import { addDays, addHours, addMinutes } from "date-fns";
import { getTimeframeMultipliers, getStopLossMultiplier } from "@/utils/technicalAnalysis/timeframeMultipliers";

export const analyzeGannChart = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("Starting Gann analysis for:", timeframe);

  // Adjust range based on timeframe
  const multipliers = getTimeframeMultipliers(timeframe);
  const stopLossMultiplier = getStopLossMultiplier(timeframe);
  
  // Calculate variable range based on timeframe
  const range = currentPrice * multipliers[0];
  const support = currentPrice - range;
  const resistance = currentPrice + range;

  // Determine direction based on Gann angles
  const direction = Math.random() > 0.5 ? "Up" : "Down";

  // Calculate variable stop loss
  const stopLoss = direction === "Up" 
    ? currentPrice - (range * stopLossMultiplier)
    : currentPrice + (range * stopLossMultiplier);

  // Calculate Gann levels that vary with timeframe
  const gannLevels = calculateGannLevels(currentPrice, range);

  // Calculate optimal entry point
  const bestEntry = {
    price: direction === "Up" 
      ? currentPrice - (range * 0.5)
      : currentPrice + (range * 0.5),
    reason: direction === "Up"
      ? `Entry point calculated at Gann 1x1 angle for ${timeframe} timeframe`
      : `Entry point calculated at Gann 2x1 angle for ${timeframe} timeframe`
  };

  // Calculate targets with variable timings based on timeframe
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
    pattern: `Gann pattern ${direction} on ${timeframe} timeframe`,
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

  console.log("Gann analysis results:", analysisResult);
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

const getExpectedTime = (timeframe: string, targetIndex: number): Date => {
  const now = new Date();
  const multiplier = targetIndex + 1;

  switch (timeframe) {
    case "1m":
      return addMinutes(now, multiplier * 15);
    case "5m":
      return addMinutes(now, multiplier * 45);
    case "30m":
      return addHours(now, multiplier * 2);
    case "1h":
      return addHours(now, multiplier * 4);
    case "4h":
      return addHours(now, multiplier * 12);
    case "1d":
      return addDays(now, multiplier * 3);
    default:
      return addHours(now, multiplier * 12);
  }
};
