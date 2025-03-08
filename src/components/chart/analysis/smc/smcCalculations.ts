
import { getTimeframeMultipliers } from "@/utils/technicalAnalysis/timeframeMultipliers";

export const calculateSMCStopLoss = (
  currentPrice: number, 
  direction: string, 
  support: number, 
  resistance: number,
  timeframe: string
): number => {
  console.log("SMC Stop Loss Calculation Input:", {
    currentPrice,
    direction,
    support,
    resistance,
    timeframe
  });

  const range = Math.abs(resistance - support) || currentPrice * 0.02; // Fallback if range is 0
  
  // In SMC, we place stop loss directly behind liquidity area
  if (direction === "Up") {
    // For bullish direction, place stop loss below demand zone with a small buffer
    const stopLoss = support - (range * 0.02);
    console.log("Bullish Stop Loss:", stopLoss);
    return isFinite(stopLoss) ? Number(stopLoss.toFixed(2)) : Number((currentPrice * 0.98).toFixed(2));
  } else {
    // For bearish direction, place stop loss above supply zone with a small buffer
    const stopLoss = resistance + (range * 0.02);
    console.log("Bearish Stop Loss:", stopLoss);
    return isFinite(stopLoss) ? Number(stopLoss.toFixed(2)) : Number((currentPrice * 1.02).toFixed(2));
  }
};

export const calculateSMCTargets = (
  currentPrice: number, 
  direction: string, 
  support: number, 
  resistance: number,
  timeframe: string
): number[] => {
  console.log("SMC Targets Calculation Input:", {
    currentPrice,
    direction,
    support,
    resistance,
    timeframe
  });

  const range = Math.abs(resistance - support) || currentPrice * 0.05; // Fallback if range is 0
  
  // Use imbalance areas and liquidity to determine targets
  const targetMultipliers = [0.5, 1, 1.5]; // 50%, 100%, 150% of range
  
  if (direction === "Up") {
    // For bullish direction, calculate targets above current price
    const targets = targetMultipliers.map(multiplier => {
      const target = currentPrice + (range * multiplier);
      return isFinite(target) ? Number(target.toFixed(2)) : Number((currentPrice * (1 + multiplier * 0.02)).toFixed(2));
    });
    console.log("Bullish Targets:", targets);
    return targets;
  } else {
    // For bearish direction, calculate targets below current price
    const targets = targetMultipliers.map(multiplier => {
      const target = currentPrice - (range * multiplier);
      return isFinite(target) ? Number(target.toFixed(2)) : Number((currentPrice * (1 - multiplier * 0.02)).toFixed(2));
    });
    console.log("Bearish Targets:", targets);
    return targets;
  }
};

export const calculateSMCEntryPoint = (
  currentPrice: number,
  direction: string,
  support: number,
  resistance: number,
  timeframe: string
): { price: number; reason: string } => {
  console.log("SMC Entry Point Calculation Input:", {
    currentPrice,
    direction,
    support,
    resistance,
    timeframe
  });

  const range = Math.abs(resistance - support) || currentPrice * 0.02; // Fallback if range is 0
  
  if (direction === "Up") {
    // For bullish direction, enter at demand zone
    const entryPrice = support + (range * 0.1);
    const finalPrice = isFinite(entryPrice) ? Number(entryPrice.toFixed(2)) : Number((currentPrice * 0.995).toFixed(2));
    console.log("Bullish Entry Point:", finalPrice);
    return {
      price: finalPrice,
      reason: `Entry point specified at active demand zone with lower liquidity pool on ${timeframe} timeframe. This area represents institutional buying area.`
    };
  } else {
    // For bearish direction, enter at supply zone
    const entryPrice = resistance - (range * 0.1);
    const finalPrice = isFinite(entryPrice) ? Number(entryPrice.toFixed(2)) : Number((currentPrice * 1.005).toFixed(2));
    console.log("Bearish Entry Point:", finalPrice);
    return {
      price: finalPrice,
      reason: `Entry point specified at active supply zone with upper liquidity pool on ${timeframe} timeframe. This area represents institutional selling area.`
    };
  }
};

export const detectSMCPattern = (direction: string, timeframe: string): string => {
  if (direction === "Up") {
    return `Lower liquidity pool pattern with active institutional demand zone on ${timeframe} timeframe`;
  } else {
    return `Upper liquidity pool pattern with active institutional supply zone on ${timeframe} timeframe`;
  }
};
