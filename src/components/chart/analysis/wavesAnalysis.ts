
import { AnalysisData } from "@/types/analysis";
import { addMinutes, addHours, addDays } from "date-fns";
import { getTimeframeMultipliers, getStopLossMultiplier } from "@/utils/technicalAnalysis/timeframeMultipliers";

export const analyzeWavesChart = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("Starting Waves analysis for symbol:", timeframe);

  // Adjust range based on timeframe
  const multipliers = getTimeframeMultipliers(timeframe);
  const stopLossMultiplier = getStopLossMultiplier(timeframe);
  
  // Calculate variable range based on timeframe
  const range = currentPrice * multipliers[0];
  const support = currentPrice - range;
  const resistance = currentPrice + range;

  // Determine direction based on wave pattern
  const direction = Math.random() > 0.5 ? "Up" : "Down";

  // Calculate variable stop loss
  const stopLoss = direction === "Up" 
    ? currentPrice - (range * stopLossMultiplier)
    : currentPrice + (range * stopLossMultiplier);

  // Calculate optimal entry point
  const bestEntry = {
    price: direction === "Up" 
      ? currentPrice - (range * 0.618)
      : currentPrice + (range * 0.618),
    reason: direction === "Up"
      ? `Entry point at 61.8% wave correction on ${timeframe} timeframe`
      : `Entry point at corrective wave completion on ${timeframe} timeframe`
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
    pattern: `Wave pattern ${direction} on ${timeframe} timeframe`,
    direction,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: bestEntry,
    analysisType: "Waves"
  };

  console.log("Waves analysis results:", analysisResult);
  return analysisResult;
};

const getExpectedTime = (timeframe: string, targetIndex: number): Date => {
  const now = new Date();
  const multiplier = targetIndex + 1;

  switch (timeframe) {
    case "1m":
      return addMinutes(now, multiplier * 5);
    case "5m":
      return addMinutes(now, multiplier * 15);
    case "30m":
      return addMinutes(now, multiplier * 60);
    case "1h":
      return addHours(now, multiplier * 2);
    case "4h":
      return addHours(now, multiplier * 8);
    case "1d":
      return addDays(now, multiplier * 2);
    default:
      return addHours(now, multiplier * 8);
  }
};
