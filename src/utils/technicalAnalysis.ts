import { addDays, addHours } from "date-fns";

export const calculateFibonacciLevels = (high: number, low: number) => {
  const difference = high - low;
  return [
    high - difference * 0.236,
    high - difference * 0.382,
    high - difference * 0.618,
  ];
};

export const calculateTargets = (currentPrice: number, direction: string, support: number, resistance: number, isScalping: boolean = false) => {
  const targets = [];
  const multiplier = isScalping ? 0.3 : 0.5; // أهداف أقصر للسكالبينج

  if (direction === "صاعد") {
    targets.push(resistance + (resistance - support) * multiplier);
    if (!isScalping) {
      targets.push(resistance + (resistance - support));
    }
  } else {
    targets.push(support - (resistance - support) * multiplier);
    if (!isScalping) {
      targets.push(support - (resistance - support));
    }
  }
  return targets;
};

export const calculateStopLoss = (currentPrice: number, direction: string, support: number, resistance: number, isScalping: boolean = false) => {
  if (isScalping) {
    // نقطة وقف خسارة أقرب للسكالبينج
    const range = resistance - support;
    return direction === "صاعد" ? 
      currentPrice - (range * 0.2) : 
      currentPrice + (range * 0.2);
  }
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

export const getCurrentPriceFromTradingView = async (symbol: string): Promise<number> => {
  try {
    // هذه مجرد محاكاة - يجب استبدالها بطلب API حقيقي
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
  fibLevels: { level: number; price: number }[]
): { price: number; reason: string } => {
  console.log("حساب أفضل نقطة دخول:", { currentPrice, direction, support, resistance, fibLevels });
  
  if (direction === "صاعد") {
    // البحث عن أقرب مستوى فيبوناتشي للسعر الحالي
    const nearestFib = fibLevels.find(level => level.price < currentPrice);
    
    if (nearestFib) {
      return {
        price: nearestFib.price,
        reason: `أفضل نقطة دخول عند مستوى فيبوناتشي ${nearestFib.level * 100}% حيث يتوقع أن يكون مستوى دعم قوي`
      };
    }
    
    // إذا لم نجد مستوى فيبوناتشي مناسب، نستخدم مستوى الدعم
    return {
      price: support,
      reason: "أفضل نقطة دخول عند مستوى الدعم الرئيسي"
    };
  } else {
    // في حالة الاتجاه الهابط
    const nearestFib = fibLevels.find(level => level.price > currentPrice);
    
    if (nearestFib) {
      return {
        price: nearestFib.price,
        reason: `أفضل نقطة دخول عند مستوى فيبوناتشي ${nearestFib.level * 100}% حيث يتوقع أن يكون مستوى مقاومة قوي`
      };
    }
    
    // إذا لم نجد مستوى فيبوناتشي مناسب، نستخدم مستوى المقاومة
    return {
      price: resistance,
      reason: "أفضل نقطة دخول عند مستوى المقاومة الرئيسي"
    };
  }
};
