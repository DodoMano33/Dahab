import { addDays, addHours, addMinutes } from "date-fns";

export const calculateFibonacciLevels = (high: number, low: number) => {
  const difference = high - low;
  const levels = [0.236, 0.382, 0.618];
  
  return levels.map(level => ({
    level,
    price: Number((high - difference * level).toFixed(2))
  }));
};

export const calculateTargets = (currentPrice: number, direction: string, support: number, resistance: number, isScalping: boolean = false) => {
  const range = resistance - support;
  const targets = [];
  
  if (isScalping) {
    // أهداف أقصر للسكالبينج
    if (direction === "صاعد") {
      targets.push(currentPrice + (range * 0.2));  // هدف قصير المدى
      targets.push(currentPrice + (range * 0.4));  // هدف متوسط المدى
    } else {
      targets.push(currentPrice - (range * 0.2));
      targets.push(currentPrice - (range * 0.4));
    }
  } else {
    // أهداف التحليل العادي
    if (direction === "صاعد") {
      targets.push(resistance + (range * 0.5));
      targets.push(resistance + range);
    } else {
      targets.push(support - (range * 0.5));
      targets.push(support - range);
    }
  }
  
  return targets;
};

export const calculateStopLoss = (currentPrice: number, direction: string, support: number, resistance: number, isScalping: boolean = false) => {
  const range = resistance - support;
  
  if (isScalping) {
    // وقف خسارة أقرب للسكالبينج
    return direction === "صاعد" ? 
      currentPrice - (range * 0.1) : // 10% من المدى للسكالبينج
      currentPrice + (range * 0.1);
  }
  
  // وقف الخسارة للتحليل العادي
  return direction === "صاعد" ? support : resistance;
};

export const calculateSupportResistance = (prices: number[], currentPrice: number, direction: string, isScalping: boolean = false) => {
  const sortedPrices = [...prices].sort((a, b) => a - b);
  let support, resistance;

  if (isScalping) {
    // حساب مستويات أقرب للسعر الحالي في السكالبينج
    const priceIndex = sortedPrices.findIndex(p => p >= currentPrice);
    const nearestLower = sortedPrices.slice(Math.max(0, priceIndex - 3), priceIndex);
    const nearestHigher = sortedPrices.slice(priceIndex, Math.min(priceIndex + 3, sortedPrices.length));
    
    support = Math.min(...nearestLower);
    resistance = Math.max(...nearestHigher);
  } else {
    // التحليل العادي
    support = Math.min(...sortedPrices);
    resistance = Math.max(...sortedPrices);
  }

  return { support, resistance };
};

export const detectTrend = (prices: number[]): "صاعد" | "هابط" => {
  const isUptrend = prices[prices.length - 1] > prices[0];
  return isUptrend ? "صاعد" : "هابط";
};

export const getCurrentPriceFromTradingView = async (symbol: string): Promise<number> => {
  try {
    const mockPrice = Math.random() * 1000 + 100;
    return Number(mockPrice.toFixed(2));
  } catch (error) {
    console.error("Error fetching current price:", error);
    throw error;
  }
};

export const calculateBestEntryPoint = (
  currentPrice: number,
  direction: string,
  support: number,
  resistance: number,
  fibLevels: { level: number; price: number }[],
  isScalping: boolean = false
): { price: number; reason: string } => {
  console.log("حساب أفضل نقطة دخول للسكالبينج:", { currentPrice, direction, support, resistance, fibLevels, isScalping });
  
  if (isScalping) {
    const range = resistance - support;
    if (direction === "صاعد") {
      const entryPrice = currentPrice - (range * 0.05); // دخول قريب من السعر الحالي
      return {
        price: Number(entryPrice.toFixed(2)),
        reason: "نقطة دخول قريبة من السعر الحالي مع اتجاه صاعد قصير المدى"
      };
    } else {
      const entryPrice = currentPrice + (range * 0.05);
      return {
        price: Number(entryPrice.toFixed(2)),
        reason: "نقطة دخول قريبة من السعر الحالي مع اتجاه هابط قصير المدى"
      };
    }
  }
  
  // التحليل العادي
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
