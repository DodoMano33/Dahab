import { getTimeframeMultipliers, getStopLossMultiplier } from "@/utils/technicalAnalysis/timeframeMultipliers";

export const calculateSMCStopLoss = (
  currentPrice: number, 
  direction: string, 
  support: number, 
  resistance: number,
  timeframe: string
): number => {
  const range = resistance - support;
  const stopLossMultiplier = getStopLossMultiplier(timeframe);
  console.log(`SMC Stop Loss calculation for ${timeframe}:`, { currentPrice, direction, stopLossMultiplier });
  
  if (direction === "صاعد") {
    return Number((currentPrice - (range * stopLossMultiplier)).toFixed(2));
  } else {
    return Number((currentPrice + (range * stopLossMultiplier)).toFixed(2));
  }
};

export const calculateSMCTargets = (
  currentPrice: number, 
  direction: string, 
  support: number, 
  resistance: number,
  timeframe: string
): number[] => {
  const range = resistance - support;
  const multipliers = getTimeframeMultipliers(timeframe);
  console.log(`SMC Targets calculation for ${timeframe}:`, { currentPrice, direction, multipliers });
  
  if (direction === "صاعد") {
    return multipliers.map(multiplier => 
      Number((currentPrice + (range * multiplier)).toFixed(2))
    );
  } else {
    return multipliers.map(multiplier => 
      Number((currentPrice - (range * multiplier)).toFixed(2))
    );
  }
};

export const calculateSMCEntryPoint = (
  currentPrice: number,
  direction: string,
  support: number,
  resistance: number,
  timeframe: string
): { price: number; reason: string } => {
  const range = resistance - support;
  const entryMultiplier = getStopLossMultiplier(timeframe) * 0.5; // Using half of stop loss for entry
  console.log(`SMC Entry Point calculation for ${timeframe}:`, { currentPrice, direction, entryMultiplier });

  let entryPrice: number;
  if (direction === "صاعد") {
    entryPrice = Number((currentPrice - (range * entryMultiplier)).toFixed(2));
    return {
      price: entryPrice,
      reason: `نقطة دخول عند منطقة تجمع السيولة السفلية على الإطار الزمني ${timeframe}`
    };
  } else {
    entryPrice = Number((currentPrice + (range * entryMultiplier)).toFixed(2));
    return {
      price: entryPrice,
      reason: `نقطة دخول عند منطقة تجمع السيولة العلوية على الإطار الزمني ${timeframe}`
    };
  }
};

export const detectSMCPattern = (direction: string, timeframe: string): string => {
  return direction === "صاعد"
    ? `نموذج تجميع سيولة قبل الاختراق الصعودي على الإطار الزمني ${timeframe}`
    : `نموذج تجميع سيولة قبل الاختراق الهبوطي على الإطار الزمني ${timeframe}`;
};