
import { addMinutes, addHours, addDays } from "date-fns";

// Calculate stop loss with volatility adjustment
export function calculateAdvancedStopLoss(
  currentPrice: number,
  fibLevels: { level: number, price: number }[],
  direction: string,
  volatilityFactor: number
): number {
  // Find appropriate Fibonacci level for stop loss
  const stopLevel = direction === "Up" 
    ? fibLevels.find(level => level.level === 0.786)?.price || currentPrice * 0.97
    : fibLevels.find(level => level.level === 1.27)?.price || currentPrice * 1.03;
  
  // Add buffer based on volatility
  const buffer = currentPrice * volatilityFactor * 0.5;
  const adjustedStop = direction === "Up"
    ? stopLevel - buffer
    : stopLevel + buffer;
  
  return Number(adjustedStop.toFixed(2));
}

// Find optimal entry point based on Fibonacci levels
export function findOptimalFibonacciEntry(
  currentPrice: number,
  fibLevels: { level: number, price: number }[],
  direction: string
) {
  // Find appropriate Fibonacci level for entry
  const entryLevel = direction === "Up" 
    ? fibLevels.find(level => level.level === 0.618)?.price || currentPrice * 0.97
    : fibLevels.find(level => level.level === 0.382)?.price || currentPrice * 1.03;
  
  return {
    price: Number(entryLevel.toFixed(2)),
    reason: `Entry at ${direction === "Up" ? "61.8%" : "38.2%"} Fibonacci level`
  };
}

// Calculate advanced targets based on Fibonacci projections
export function calculateAdvancedTargets(
  currentPrice: number,
  fibLevels: { level: number, price: number }[],
  direction: string,
  timeframe: string
): { price: number, expectedTime: Date }[] {
  const now = new Date();
  
  // Find appropriate Fibonacci levels for targets
  const targetsLevels = direction === "Up"
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
