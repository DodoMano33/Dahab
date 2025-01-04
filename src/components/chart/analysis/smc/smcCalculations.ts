import { getTimeframeMultipliers, getStopLossMultiplier } from "@/utils/technicalAnalysis/timeframeMultipliers";

export const calculateSMCStopLoss = (
  currentPrice: number, 
  direction: string, 
  support: number, 
  resistance: number,
  timeframe: string
): number => {
  const range = Math.abs(resistance - support);
  const stopLossMultiplier = getStopLossMultiplier(timeframe);
  console.log(`SMC Stop Loss calculation for ${timeframe}:`, { currentPrice, direction, stopLossMultiplier });
  
  if (direction === "صاعد") {
    // للاتجاه الصاعد، وقف الخسارة يكون تحت السعر الحالي بنسبة من المدى
    return Number((currentPrice * (1 - stopLossMultiplier)).toFixed(2));
  } else {
    // للاتجاه الهابط، وقف الخسارة يكون فوق السعر الحالي بنسبة من المدى
    return Number((currentPrice * (1 + stopLossMultiplier)).toFixed(2));
  }
};

export const calculateSMCTargets = (
  currentPrice: number, 
  direction: string, 
  support: number, 
  resistance: number,
  timeframe: string
): number[] => {
  const multipliers = getTimeframeMultipliers(timeframe);
  console.log(`SMC Targets calculation for ${timeframe}:`, { currentPrice, direction, multipliers });
  
  if (direction === "صاعد") {
    // للاتجاه الصاعد، الأهداف تكون أعلى من السعر الحالي
    return multipliers.map(multiplier => 
      Number((currentPrice * (1 + multiplier)).toFixed(2))
    );
  } else {
    // للاتجاه الهابط، الأهداف تكون أقل من السعر الحالي
    return multipliers.map(multiplier => 
      Number((currentPrice * (1 - multiplier)).toFixed(2))
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
  const entryMultiplier = getStopLossMultiplier(timeframe) * 0.5; // نصف مسافة وقف الخسارة للدخول
  console.log(`SMC Entry Point calculation for ${timeframe}:`, { currentPrice, direction, entryMultiplier });

  let entryPrice: number;
  if (direction === "صاعد") {
    // للاتجاه الصاعد، نقطة الدخول تكون أقل من السعر الحالي
    entryPrice = Number((currentPrice * (1 - entryMultiplier)).toFixed(2));
    return {
      price: entryPrice,
      reason: `نقطة دخول عند منطقة تجمع السيولة السفلية على الإطار الزمني ${timeframe}`
    };
  } else {
    // للاتجاه الهابط، نقطة الدخول تكون أعلى من السعر الحالي
    entryPrice = Number((currentPrice * (1 + entryMultiplier)).toFixed(2));
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