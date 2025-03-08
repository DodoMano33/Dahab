
import { getTimeframeMultipliers, getStopLossMultiplier, getRangeMultiplier } from './timeframeMultipliers';
import { getTimeframeLabel } from './timeUtils';

export const calculateFibonacciLevels = (high: number, low: number) => {
  const difference = high - low;
  const levels = [0.236, 0.382, 0.618];
  
  return levels.map(level => ({
    level,
    price: Number((high - difference * level).toFixed(2))
  }));
};

export const calculateTargets = (
  currentPrice: number, 
  direction: string, 
  support: number, 
  resistance: number, 
  timeframe: string
) => {
  const range = resistance - support;
  const targets = [];
  const multipliers = getTimeframeMultipliers(timeframe);
  
  if (direction === "صاعد") {
    targets.push(currentPrice + (range * multipliers[0]));
    targets.push(currentPrice + (range * multipliers[1]));
    targets.push(currentPrice + (range * multipliers[2]));
  } else {
    targets.push(currentPrice - (range * multipliers[0]));
    targets.push(currentPrice - (range * multipliers[1]));
    targets.push(currentPrice - (range * multipliers[2]));
  }
  
  return targets;
};

export const calculateStopLoss = (
  currentPrice: number, 
  direction: string, 
  support: number, 
  resistance: number, 
  timeframe: string
) => {
  const range = resistance - support;
  const stopLossMultiplier = getStopLossMultiplier(timeframe);
  
  return direction === "صاعد" ? 
    currentPrice - (range * stopLossMultiplier) : 
    currentPrice + (range * stopLossMultiplier);
};

export const calculateSupportResistance = (
  prices: number[], 
  currentPrice: number, 
  direction: string, 
  timeframe: string
) => {
  const sortedPrices = [...prices].sort((a, b) => a - b);
  const priceIndex = sortedPrices.findIndex(p => p >= currentPrice);
  
  const rangeMultiplier = getRangeMultiplier(timeframe);
  const range = Math.floor(sortedPrices.length * rangeMultiplier);
  
  const nearestLower = sortedPrices.slice(Math.max(0, priceIndex - range), priceIndex);
  const nearestHigher = sortedPrices.slice(priceIndex, Math.min(priceIndex + range, sortedPrices.length));
  
  const support = Math.min(...nearestLower);
  const resistance = Math.max(...nearestHigher);

  return { support, resistance };
};

export const calculateBestEntryPoint = (
  currentPrice: number,
  direction: string,
  support: number,
  resistance: number,
  fibLevels: { level: number; price: number }[],
  timeframe: string
): { price: number; reason: string } => {
  const range = resistance - support;
  const entryMultiplier = getStopLossMultiplier(timeframe);
  
  if (direction === "صاعد") {
    const entryPrice = currentPrice - (range * entryMultiplier);
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: `نقطة دخول محسوبة على الإطار الزمني ${getTimeframeLabel(timeframe)} مع اتجاه صاعد`
    };
  } else {
    const entryPrice = currentPrice + (range * entryMultiplier);
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: `نقطة دخول محسوبة على الإطار الزمني ${getTimeframeLabel(timeframe)} مع اتجاه هابط`
    };
  }
};

export const detectTrend = (prices: number[]): "صاعد" | "هابط" => {
  const isUptrend = prices[prices.length - 1] > prices[0];
  return isUptrend ? "صاعد" : "هابط";
};
