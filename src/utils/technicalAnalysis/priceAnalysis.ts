
import { getTimeframeMultipliers, getStopLossMultiplier, getRangeMultiplier, getEntryMultiplier, getTimeframeLabel } from './timeframe';

export const calculateTargets = (
  direction: string, 
  support: number, 
  resistance: number, 
  timeframe: string
) => {
  const range = resistance - support;
  const targets = [];
  
  const multipliers = getTimeframeMultipliers(timeframe);
  
  if (direction === "صاعد") {
    targets.push(support + (range * multipliers[0]));
    targets.push(support + (range * multipliers[1]));
    targets.push(support + (range * multipliers[2]));
  } else {
    targets.push(resistance - (range * multipliers[0]));
    targets.push(resistance - (range * multipliers[1]));
    targets.push(resistance - (range * multipliers[2]));
  }
  
  return targets;
};

export const calculateStopLoss = (
  direction: string, 
  support: number, 
  resistance: number, 
  timeframe: string
) => {
  const range = resistance - support;
  const stopLossMultiplier = getStopLossMultiplier(timeframe);
  
  return direction === "صاعد" ? 
    support - (range * stopLossMultiplier) : 
    resistance + (range * stopLossMultiplier);
};

export const calculateSupportResistance = (
  direction: string, 
  timeframe: string
) => {
  // أرقام ثابتة بدلاً من الاعتماد على السعر الحالي
  const baseValue = 100;
  const rangeMultiplier = getRangeMultiplier(timeframe);
  const range = baseValue * rangeMultiplier;
  
  const support = baseValue - range;
  const resistance = baseValue + range;

  return { support, resistance };
};

export const detectTrend = (): "صاعد" | "هابط" => {
  // عشوائياً نختار الاتجاه
  return Math.random() > 0.5 ? "صاعد" : "هابط";
};

export const calculateBestEntryPoint = (
  direction: string,
  support: number,
  resistance: number,
  fibLevels: { level: number; price: number }[],
  timeframe: string
): { price: number; reason: string } => {
  const range = resistance - support;
  const entryMultiplier = getEntryMultiplier(timeframe);
  
  if (direction === "صاعد") {
    const entryPrice = support + (range * entryMultiplier);
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: `نقطة دخول محسوبة على الإطار الزمني ${getTimeframeLabel(timeframe)} مع اتجاه صاعد`
    };
  } else {
    const entryPrice = resistance - (range * entryMultiplier);
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: `نقطة دخول محسوبة على الإطار الزمني ${getTimeframeLabel(timeframe)} مع اتجاه هابط`
    };
  }
};
