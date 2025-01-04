import { getTimeframeMultipliers, getStopLossMultiplier } from "@/utils/technicalAnalysis/timeframeMultipliers";

export const calculateSMCStopLoss = (
  currentPrice: number, 
  direction: string, 
  support: number, 
  resistance: number,
  timeframe: string
): number => {
  const range = Math.abs(resistance - support);
  // نستخدم 30% من المدى بين الدعم والمقاومة لتحديد وقف الخسارة
  const stopLossRange = range * 0.3;
  
  console.log(`SMC Stop Loss calculation for ${timeframe}:`, { 
    currentPrice, 
    direction, 
    range,
    stopLossRange 
  });
  
  if (direction === "صاعد") {
    // للاتجاه الصاعد، نضع وقف الخسارة تحت منطقة تجمع السيولة السفلية
    return Number((support - stopLossRange).toFixed(2));
  } else {
    // للاتجاه الهابط، نضع وقف الخسارة فوق منطقة تجمع السيولة العلوية
    return Number((resistance + stopLossRange).toFixed(2));
  }
};

export const calculateSMCTargets = (
  currentPrice: number, 
  direction: string, 
  support: number, 
  resistance: number,
  timeframe: string
): number[] => {
  const range = Math.abs(resistance - support);
  // نستخدم مضاعفات المدى لتحديد الأهداف بناءً على مناطق عدم التوازن
  const targetMultipliers = [1.5, 2.5, 3.5];
  
  console.log(`SMC Targets calculation for ${timeframe}:`, { 
    currentPrice, 
    direction, 
    range,
    targetMultipliers 
  });
  
  if (direction === "صاعد") {
    // للاتجاه الصاعد، نحدد الأهداف فوق مستوى المقاومة
    return targetMultipliers.map(multiplier => 
      Number((resistance + (range * multiplier)).toFixed(2))
    );
  } else {
    // للاتجاه الهابط، نحدد الأهداف تحت مستوى الدعم
    return targetMultipliers.map(multiplier => 
      Number((support - (range * multiplier)).toFixed(2))
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
  const range = Math.abs(resistance - support);
  // نستخدم 20% من المدى للدخول قرب مناطق الطلب/العرض
  const entryRange = range * 0.2;
  
  console.log(`SMC Entry Point calculation for ${timeframe}:`, { 
    currentPrice, 
    direction, 
    range,
    entryRange 
  });

  if (direction === "صاعد") {
    // للاتجاه الصاعد، ندخل عند منطقة الطلب فوق الدعم مباشرة
    const entryPrice = Number((support + entryRange).toFixed(2));
    return {
      price: entryPrice,
      reason: `نقطة دخول عند منطقة الطلب (Demand Zone) فوق مستوى تجمع السيولة السفلي على الإطار الزمني ${timeframe}`
    };
  } else {
    // للاتجاه الهابط، ندخل عند منطقة العرض تحت المقاومة مباشرة
    const entryPrice = Number((resistance - entryRange).toFixed(2));
    return {
      price: entryPrice,
      reason: `نقطة دخول عند منطقة العرض (Supply Zone) تحت مستوى تجمع السيولة العلوي على الإطار الزمني ${timeframe}`
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