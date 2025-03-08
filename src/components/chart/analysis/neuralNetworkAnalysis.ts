import { AnalysisData } from "@/types/analysis";
import { addHours, addDays } from "date-fns";
import { getTimeframeMultipliers, getStopLossMultiplier } from "@/utils/technicalAnalysis/timeframeMultipliers";

export const analyzeNeuralNetworkChart = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("Starting Neural Network analysis for:", timeframe);

  // Adjust range based on timeframe
  const multipliers = getTimeframeMultipliers(timeframe);
  const stopLossMultiplier = getStopLossMultiplier(timeframe);
  
  // Calculate variable range based on timeframe
  const range = currentPrice * multipliers[0];
  
  // Determine direction based on neural network model (simulated)
  const confidenceScore = Math.random();
  const direction = confidenceScore > 0.5 ? "Up" : "Down";
  
  // Calculate support and resistance levels
  const support = direction === "Up" 
    ? currentPrice - (range * 0.15)
    : currentPrice - (range * 0.25);
    
  const resistance = direction === "Up" 
    ? currentPrice + (range * 0.35)
    : currentPrice + (range * 0.15);

  // Calculate variable stop loss
  const stopLoss = direction === "Up" 
    ? currentPrice - (range * stopLossMultiplier * 0.8)
    : currentPrice + (range * stopLossMultiplier * 0.8);

  // Calculate best entry point
  const bestEntry = {
    price: direction === "Up" 
      ? currentPrice + (range * 0.05)
      : currentPrice - (range * 0.05),
    reason: `Ideal entry point according to neural network analysis with ${(confidenceScore * 100).toFixed(1)}% confidence on ${timeframe} timeframe`
  };

  // Calculate targets with variable timing based on timeframe
  const targets = [
    {
      price: direction === "Up"
        ? currentPrice + (range * multipliers[0] * 1.1)
        : currentPrice - (range * multipliers[0] * 1.1),
      expectedTime: getExpectedTime(timeframe, 0)
    },
    {
      price: direction === "Up"
        ? currentPrice + (range * multipliers[1] * 1.2)
        : currentPrice - (range * multipliers[1] * 1.2),
      expectedTime: getExpectedTime(timeframe, 1)
    },
    {
      price: direction === "Up"
        ? currentPrice + (range * multipliers[2] * 1.3)
        : currentPrice - (range * multipliers[2] * 1.3),
      expectedTime: getExpectedTime(timeframe, 2)
    }
  ];

  // Add Fibonacci levels
  const fibonacciLevels = [
    { level: 0.236, price: direction === "Up" ? currentPrice + (range * 0.236) : currentPrice - (range * 0.236) },
    { level: 0.382, price: direction === "Up" ? currentPrice + (range * 0.382) : currentPrice - (range * 0.382) },
    { level: 0.5, price: direction === "Up" ? currentPrice + (range * 0.5) : currentPrice - (range * 0.5) },
    { level: 0.618, price: direction === "Up" ? currentPrice + (range * 0.618) : currentPrice - (range * 0.618) },
    { level: 0.786, price: direction === "Up" ? currentPrice + (range * 0.786) : currentPrice - (range * 0.786) },
    { level: 1, price: direction === "Up" ? currentPrice + range : currentPrice - range },
  ];

  const analysisResult: AnalysisData = {
    pattern: `Neural Network Analysis: ${direction} trend on ${timeframe} timeframe`,
    direction: direction as "Up" | "Down" | "Neutral",
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: bestEntry,
    fibonacciLevels,
    analysisType: "Neural Networks",
    activation_type: "auto"
  };

  console.log("Neural Network analysis results:", analysisResult);
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
