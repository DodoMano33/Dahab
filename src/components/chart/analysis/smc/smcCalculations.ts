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
  
  if (direction === "صاعد") {
    return currentPrice - (range * stopLossMultiplier);
  } else {
    return currentPrice + (range * stopLossMultiplier);
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
  const targets = [];
  
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

export const calculateSMCEntryPoint = (
  currentPrice: number,
  direction: string,
  support: number,
  resistance: number,
  timeframe: string
): { price: number; reason: string } => {
  const range = resistance - support;
  const multiplier = getStopLossMultiplier(timeframe);
  
  if (direction === "صاعد") {
    const entryPrice = currentPrice - (range * multiplier);
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: `نقطة دخول عند منطقة تجمع السيولة السفلية على الإطار الزمني ${timeframe}`
    };
  } else {
    const entryPrice = currentPrice + (range * multiplier);
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: `نقطة دخول عند منطقة تجمع السيولة العلوية على الإطار الزمني ${timeframe}`
    };
  }
};

export const detectSMCPattern = (direction: string, timeframe: string): string => {
  if (direction === "صاعد") {
    return `نموذج تجميع سيولة قبل الاختراق الصعودي على الإطار الزمني ${timeframe}`;
  } else {
    return `نموذج تجميع سيولة قبل الاختراق الهبوطي على الإطار الزمني ${timeframe}`;
  }
};