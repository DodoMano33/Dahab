import { addHours, addDays } from "date-fns";

export const calculateFibonacciLevels = (high: number, low: number) => {
  const difference = high - low;
  return [
    high - difference * 0.236,
    high - difference * 0.382,
    high - difference * 0.618,
  ];
};

export const calculateTargets = (currentPrice: number, direction: string, support: number, resistance: number) => {
  const targets = [];
  if (direction === "صاعد") {
    targets.push(resistance + (resistance - support) * 0.5);
    targets.push(resistance + (resistance - support));
  } else {
    targets.push(support - (resistance - support) * 0.5);
    targets.push(support - (resistance - support));
  }
  return targets;
};

export const calculateStopLoss = (currentPrice: number, direction: string, support: number, resistance: number) => {
  return direction === "صاعد" ? support : resistance;
};

export const calculateSupportResistance = (prices: number[], currentPrice: number, direction: string) => {
  const support = Math.min(...prices);
  const resistance = Math.max(...prices);
  return { support, resistance };
};

export const detectTrend = (prices: number[]): "صاعد" | "هابط" => {
  const isUptrend = prices[prices.length - 1] > prices[0];
  return isUptrend ? "صاعد" : "هابط";
};

export const calculateExpectedTimes = (targetPrices: number[], direction: string): Date[] => {
  // Calculate expected times based on target distances
  return targetPrices.map((_, index) => {
    // First target expected in 24 hours, second target in 48 hours
    return addHours(new Date(), (index + 1) * 24);
  });
};

export const calculateBestEntryPoint = (
  currentPrice: number,
  direction: string,
  support: number,
  resistance: number,
  fibLevels: { level: number; price: number }[]
): { price: number; reason: string } => {
  console.log("حساب أفضل نقطة دخول:", { currentPrice, direction, support, resistance, fibLevels });
  
  if (direction === "صاعد") {
    const nearestFib = fibLevels.find(level => level.price < currentPrice);
    
    if (nearestFib) {
      return {
        price: nearestFib.price,
        reason: `أفضل نقطة دخول عند مستوى فيبوناتشي ${nearestFib.level * 100}% حيث يتوقع أن يكون مستوى دعم قوي`
      };
    }
    
    return {
      price: support,
      reason: "أفضل نقطة دخول عند مستوى الدعم الرئيسي"
    };
  } else {
    const nearestFib = fibLevels.find(level => level.price > currentPrice);
    
    if (nearestFib) {
      return {
        price: nearestFib.price,
        reason: `أفضل نقطة دخول عند مستوى فيبوناتشي ${nearestFib.level * 100}% حيث يتوقع أن يكون مستوى مقاومة قوي`
      };
    }
    
    return {
      price: resistance,
      reason: "أفضل نقطة دخول عند مستوى المقاومة الرئيسي"
    };
  }
};