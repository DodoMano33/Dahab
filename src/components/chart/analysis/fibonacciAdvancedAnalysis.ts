
import { AnalysisData } from "@/types/analysis";
import { calculateFibonacciLevels, findOptimalFibonacciEntry, calculateFibonacciTargets } from "@/utils/technicalAnalysis/fibonacci";
import { calculateSupportResistance, detectTrend } from "@/utils/technicalAnalysis/calculations";
import { getWyckoffAnalysis } from "@/utils/technicalAnalysis/wyckoff";
import { addHours, addDays } from "date-fns";

export const analyzeFibonacciAdvanced = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("Starting Advanced Fibonacci analysis for price:", currentPrice, "timeframe:", timeframe);
  
  try {
    // Determine recent high and low with volatility based on timeframe
    const volatilityFactor = getVolatilityFactor(timeframe);
    const recentHigh = currentPrice * (1 + (Math.random() * volatilityFactor * 1.5));
    const recentLow = currentPrice * (1 - (Math.random() * volatilityFactor));
    
    // Detect the trend using advanced algorithm (simulated)
    const trend = detectAdvancedTrend(currentPrice, recentHigh, recentLow);
    const direction = trend.direction as "صاعد" | "هابط";
    
    // Calculate support and resistance levels with institutional order blocks
    const { support, resistance } = calculateSupportResistance([recentLow, currentPrice, recentHigh], currentPrice, direction, timeframe);
    
    // Calculate advanced Fibonacci levels with extensions and projections
    const fibLevels = calculateAdvancedFibonacciLevels(recentHigh, recentLow, currentPrice, direction);
    
    // Find optimal entry points with confirmation patterns
    const bestEntryPoint = findOptimalFibonacciEntry(
      currentPrice,
      fibLevels,
      direction,
      timeframe
    );
    
    // Calculate stop loss with volatility adjustment
    const stopLoss = calculateAdvancedStopLoss(
      currentPrice,
      fibLevels,
      direction,
      volatilityFactor
    );
    
    // Calculate targets based on market structure and Fibonacci projections
    const targets = calculateAdvancedTargets(
      currentPrice,
      fibLevels,
      direction,
      timeframe
    );
    
    // Get Wyckoff phase analysis for additional confirmation
    const wyckoffAnalysis = getWyckoffAnalysis(direction);
    
    // Return complete analysis with all data points
    return {
      pattern: "Fibonacci Advanced Analysis",
      direction,
      currentPrice,
      support,
      resistance,
      stopLoss,
      targets,
      fibonacciLevels: fibLevels,
      bestEntryPoint: {
        price: Number(bestEntryPoint.price.toFixed(2)),
        reason: bestEntryPoint.reason + ` (${wyckoffAnalysis.phase})`
      },
      analysisType: "Fibonacci", // Ensuring correct analysis type for database
      activation_type: "manual"
    };
  } catch (error) {
    console.error("Error in advanced Fibonacci analysis:", error);
    throw error;
  }
};

// Helper function to determine trend with probability skew
function detectAdvancedTrend(currentPrice: number, high: number, low: number) {
  // More sophisticated trend detection (simulated)
  const pricePosition = (currentPrice - low) / (high - low);
  const bullishProbability = pricePosition < 0.5 ? 0.7 : 0.3; // Higher chance of bullish if price is closer to the low
  
  return {
    direction: Math.random() < bullishProbability ? "صاعد" : "هابط",
    strength: Math.random() * 0.5 + 0.5, // Trend strength between 0.5-1.0
    confirmed: Math.random() > 0.3 // 70% chance the trend is confirmed
  };
}

// Helper function to get volatility factor based on timeframe
function getVolatilityFactor(timeframe: string): number {
  switch (timeframe) {
    case "1m": return 0.005; // 0.5%
    case "5m": return 0.01;  // 1%
    case "30m": return 0.015; // 1.5%
    case "1h": return 0.02;  // 2%
    case "4h": return 0.03;  // 3%
    case "1d": return 0.05;  // 5%
    default: return 0.03;
  }
}

// Calculate advanced Fibonacci levels (more comprehensive than basic)
function calculateAdvancedFibonacciLevels(high: number, low: number, currentPrice: number, direction: string) {
  const range = high - low;
  
  // Basic retracement levels
  const basicLevels = [
    { level: 0.236, price: high - range * 0.236 },
    { level: 0.382, price: high - range * 0.382 },
    { level: 0.5, price: high - range * 0.5 },
    { level: 0.618, price: high - range * 0.618 },
    { level: 0.786, price: high - range * 0.786 },
    { level: 0.886, price: high - range * 0.886 }
  ];
  
  // Extension levels
  const extensionLevels = [
    { level: 1.27, price: high + range * 0.27 },
    { level: 1.41, price: high + range * 0.41 },
    { level: 1.618, price: high + range * 0.618 },
    { level: 2.0, price: high + range * 1.0 },
    { level: 2.618, price: high + range * 1.618 }
  ];
  
  // Projection levels (from current price)
  const projectionBase = direction === "صاعد" ? currentPrice - low : high - currentPrice;
  const projectionLevels = [
    { level: 0.618, price: currentPrice + (direction === "صاعد" ? 1 : -1) * projectionBase * 0.618 },
    { level: 1.0, price: currentPrice + (direction === "صاعد" ? 1 : -1) * projectionBase },
    { level: 1.618, price: currentPrice + (direction === "صاعد" ? 1 : -1) * projectionBase * 1.618 }
  ];
  
  // Combine all levels and round to 2 decimal places
  return [...basicLevels, ...extensionLevels, ...projectionLevels].map(level => ({
    level: level.level,
    price: Number(level.price.toFixed(2))
  }));
}

// Calculate stop loss with volatility adjustment
function calculateAdvancedStopLoss(
  currentPrice: number,
  fibLevels: { level: number, price: number }[],
  direction: string,
  volatilityFactor: number
): number {
  // Find appropriate Fibonacci level for stop loss
  const stopLevel = direction === "صاعد" 
    ? fibLevels.find(level => level.level === 0.786)?.price || currentPrice * 0.97
    : fibLevels.find(level => level.level === 1.27)?.price || currentPrice * 1.03;
  
  // Add buffer based on volatility
  const buffer = currentPrice * volatilityFactor * 0.5;
  const adjustedStop = direction === "صاعد"
    ? stopLevel - buffer
    : stopLevel + buffer;
  
  return Number(adjustedStop.toFixed(2));
}

// Calculate advanced targets based on Fibonacci projections
function calculateAdvancedTargets(
  currentPrice: number,
  fibLevels: { level: number, price: number }[],
  direction: string,
  timeframe: string
): { price: number, expectedTime: Date }[] {
  const now = new Date();
  
  // Find appropriate Fibonacci levels for targets
  const targetsLevels = direction === "صاعد"
    ? [
        fibLevels.find(level => level.level === 1.27)?.price || currentPrice * 1.02,
        fibLevels.find(level => level.level === 1.618)?.price || currentPrice * 1.05,
        fibLevels.find(level => level.level === 2.0)?.price || currentPrice * 1.08
      ]
    : [
        fibLevels.find(level => level.level === 0.786)?.price || currentPrice * 0.98,
        fibLevels.find(level => level.level === 0.618)?.price || currentPrice * 0.95,
        fibLevels.find(level => level.level === 0.5)?.price || currentPrice * 0.92
      ];

  // Calculate expected time based on timeframe
  const getExpectedTime = (index: number) => {
    switch (timeframe) {
      case "1m": return addHours(now, (index + 1) * 1);
      case "5m": return addHours(now, (index + 1) * 3);
      case "30m": return addHours(now, (index + 1) * 6);
      case "1h": return addHours(now, (index + 1) * 12);
      case "4h": return addDays(now, index + 1);
      case "1d": return addDays(now, (index + 1) * 3);
      default: return addDays(now, index + 1);
    }
  };
  
  // Create targets with expected time
  return targetsLevels.map((price, index) => ({
    price: Number(price.toFixed(2)),
    expectedTime: getExpectedTime(index)
  }));
}
