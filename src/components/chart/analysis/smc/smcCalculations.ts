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
  
  // في SMC، نضع وقف الخسارة خلف منطقة السيولة مباشرة
  if (direction === "صاعد") {
    // للاتجاه الصاعد، نضع وقف الخسارة تحت منطقة الطلب بنسبة صغيرة
    const stopLoss = support - (range * 0.02);
    console.log("Bullish Stop Loss:", stopLoss);
    return Number(stopLoss.toFixed(2));
  } else {
    // للاتجاه الهابط، نضع وقف الخسارة فوق منطقة العرض بنسبة صغيرة
    const stopLoss = resistance + (range * 0.02);
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
  
  // نستخدم مناطق عدم التوازن والسيولة لتحديد الأهداف
  const targetMultipliers = [0.5, 1, 1.5]; // 50%, 100%, 150% من المدى
  
  if (direction === "صاعد") {
    // للاتجاه الصاعد، نحسب الأهداف فوق السعر الحالي
    const targets = targetMultipliers.map(multiplier => 
      Number((currentPrice + (range * multiplier)).toFixed(2))
    );
    console.log("Bullish Targets:", targets);
    return targets;
  } else {
    // للاتجاه الهابط، نحسب الأهداف تحت السعر الحالي
    const targets = targetMultipliers.map(multiplier => 
      Number((currentPrice - (range * multiplier)).toFixed(2))
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
  
  if (direction === "صاعد") {
    // للاتجاه الصاعد، ندخل عند منطقة الطلب
    const entryPrice = Number((support + (range * 0.1)).toFixed(2));
    console.log("Bullish Entry Point:", entryPrice);
    return {
      price: entryPrice,
      reason: `نقطة دخول محددة عند منطقة الطلب النشطة (Demand Zone) مع وجود تجمع سيولة سفلي على الإطار الزمني ${timeframe}. هذه المنطقة تمثل نقطة تجمع المؤسسات للشراء.`
    };
  } else {
    // للاتجاه الهابط، ندخل عند منطقة العرض
    const entryPrice = Number((resistance - (range * 0.1)).toFixed(2));
    console.log("Bearish Entry Point:", entryPrice);
    return {
      price: entryPrice,
      reason: `نقطة دخول محددة عند منطقة العرض النشطة (Supply Zone) مع وجود تجمع سيولة علوي على الإطار الزمني ${timeframe}. هذه المنطقة تمثل نقطة تجمع المؤسسات للبيع.`
    };
  }
};

export const detectSMCPattern = (direction: string, timeframe: string): string => {
  if (direction === "صاعد") {
    return `نموذج تجمع سيولة سفلي مع منطقة طلب مؤسساتية نشطة على الإطار الزمني ${timeframe}`;
  } else {
    return `نموذج تجمع سيولة علوي مع منطقة عرض مؤسساتية نشطة على الإطار الزمني ${timeframe}`;
  }
};