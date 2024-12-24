import { addHours } from "date-fns";

export const calculateFibonacciLevels = (high: number, low: number) => {
  const difference = high - low;
  return [
    low + difference * 0.236,
    low + difference * 0.382,
    low + difference * 0.618
  ];
};

export const calculateTargets = (currentPrice: number, direction: string, support: number, resistance: number) => {
  const range = Math.abs(resistance - support);
  if (direction === "صاعد") {
    return [
      currentPrice + range * 0.5,
      currentPrice + range
    ];
  } else {
    return [
      currentPrice - range * 0.5,
      currentPrice - range
    ];
  }
};

export const calculateStopLoss = (currentPrice: number, direction: string, support: number, resistance: number) => {
  const range = Math.abs(resistance - support);
  return direction === "صاعد" ? 
    currentPrice - (range * 0.1) : 
    currentPrice + (range * 0.1);
};

export const calculateSupportResistance = (prices: number[], currentPrice: number, direction: string) => {
  const sortedPrices = [...prices].sort((a, b) => a - b);
  const support = direction === "صاعد" ? 
    sortedPrices[Math.floor(sortedPrices.length * 0.2)] :
    sortedPrices[Math.floor(sortedPrices.length * 0.1)];
  const resistance = direction === "صاعد" ? 
    sortedPrices[Math.floor(sortedPrices.length * 0.9)] :
    sortedPrices[Math.floor(sortedPrices.length * 0.8)];
  return { support, resistance };
};

export const detectTrend = (prices: number[]) => {
  const isUptrend = prices[prices.length - 1] > prices[0];
  return isUptrend ? "صاعد" : "هابط";
};

export const calculateExpectedTimes = (targetPrices: number[], direction: string): Date[] => {
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
) => {
  console.log("حساب أفضل نقطة دخول:", { currentPrice, direction, support, resistance, fibLevels });
  
  if (direction === "صاعد") {
    const nearestFib = fibLevels.find(level => level.price < currentPrice);
    
    if (nearestFib) {
      return {
        price: nearestFib.price,
        reason: `أفضل نقطة دخول عند مستوى فيبوناتشي ${nearestFib.level}`
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
        reason: `أفضل نقطة دخول عند مستوى فيبوناتشي ${nearestFib.level}`
      };
    }
    
    return {
      price: resistance,
      reason: "أفضل نقطة دخول عند مستوى المقاومة الرئيسي"
    };
  }
};