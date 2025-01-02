import { getTimeframeStopLossMultiplier, getTimeframeTargetMultipliers } from "./timeframeCalculations";

export const calculateSMCStopLoss = (
  currentPrice: number, 
  direction: string, 
  support: number, 
  resistance: number,
  timeframe: string
): number => {
  const range = resistance - support;
  const stopLossMultiplier = getTimeframeStopLossMultiplier(timeframe);
  
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
  const multipliers = getTimeframeTargetMultipliers(timeframe);
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
  fibLevels: { level: number; price: number }[],
  timeframe: string
): { price: number; reason: string } => {
  const range = resistance - support;
  
  if (direction === "صاعد") {
    const entryPrice = currentPrice - (range * 0.1);
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: "نقطة دخول عند منطقة تجمع السيولة السفلية مع احتمالية اختراق صعودي"
    };
  } else {
    const entryPrice = currentPrice + (range * 0.1);
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: "نقطة دخول عند منطقة تجمع السيولة العلوية مع احتمالية اختراق هبوطي"
    };
  }
};

export const detectSMCPattern = (direction: string, prices: number[], currentPrice: number): string => {
  if (direction === "صاعد") {
    return "نموذج تجميع سيولة قبل الاختراق الصعودي";
  } else {
    return "نموذج تجميع سيولة قبل الاختراق الهبوطي";
  }
};