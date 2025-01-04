import { getTimeframeMultipliers } from "@/utils/technicalAnalysis/timeframe";

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

  const range = Math.abs(resistance - support);
  const stopLossPercentage = 0.02; // 2% for tight stop loss in SMC
  
  if (direction === "صاعد") {
    // For bullish trend, place stop loss below the last low
    const stopLoss = currentPrice - (currentPrice * stopLossPercentage);
    console.log("Bullish Stop Loss:", stopLoss);
    return Number(stopLoss.toFixed(2));
  } else {
    // For bearish trend, place stop loss above the last high
    const stopLoss = currentPrice + (currentPrice * stopLossPercentage);
    console.log("Bearish Stop Loss:", stopLoss);
    return Number(stopLoss.toFixed(2));
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

  const range = Math.abs(resistance - support);
  
  // SMC target multipliers based on market structure
  const targetMultipliers = [0.015, 0.03, 0.05]; // 1.5%, 3%, 5%
  
  if (direction === "صاعد") {
    // For bullish trend, calculate targets above current price
    const targets = targetMultipliers.map(multiplier => 
      Number((currentPrice + (currentPrice * multiplier)).toFixed(2))
    );
    console.log("Bullish Targets:", targets);
    return targets;
  } else {
    // For bearish trend, calculate targets below current price
    const targets = targetMultipliers.map(multiplier => 
      Number((currentPrice - (currentPrice * multiplier)).toFixed(2))
    );
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

  const range = Math.abs(resistance - support);
  const entryOffset = 0.005; // 0.5% offset for entry
  
  if (direction === "صاعد") {
    // For bullish trend, enter near support
    const entryPrice = Number((support + (range * entryOffset)).toFixed(2));
    console.log("Bullish Entry Point:", entryPrice);
    return {
      price: entryPrice,
      reason: `نقطة دخول عند منطقة الطلب القوية (Demand Zone) مع وجود تجمع سيولة سفلي على الإطار الزمني ${timeframe}`
    };
  } else {
    // For bearish trend, enter near resistance
    const entryPrice = Number((resistance - (range * entryOffset)).toFixed(2));
    console.log("Bearish Entry Point:", entryPrice);
    return {
      price: entryPrice,
      reason: `نقطة دخول عند منطقة العرض القوية (Supply Zone) مع وجود تجمع سيولة علوي على الإطار الزمني ${timeframe}`
    };
  }
};

export const detectSMCPattern = (direction: string, timeframe: string): string => {
  if (direction === "صاعد") {
    return `نموذج تجمع سيولة سفلي مع منطقة طلب نشطة على الإطار الزمني ${timeframe}`;
  } else {
    return `نموذج تجمع سيولة علوي مع منطقة عرض نشطة على الإطار الزمني ${timeframe}`;
  }
};