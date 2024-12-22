export const calculateFibonacciLevels = (high: number, low: number): { level: number; price: number }[] => {
  const diff = high - low;
  const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
  
  return levels.map(level => ({
    level,
    price: Math.round((low + diff * level) * 100) / 100
  }));
};

export const calculatePivotPoints = (high: number, low: number, close: number) => {
  const pp = (high + low + close) / 3;
  return {
    pp,
    r1: 2 * pp - low,
    r2: pp + (high - low),
    r3: high + 2 * (pp - low),
    s1: 2 * pp - high,
    s2: pp - (high - low),
    s3: low - 2 * (high - pp)
  };
};

export const detectTrend = (prices: number[]): "صاعد" | "هابط" => {
  if (prices.length < 2) return "صاعد";
  
  const recentPrices = prices.slice(-5);
  const avgChange = recentPrices.reduce((acc, price, i) => {
    if (i === 0) return 0;
    return acc + (price - recentPrices[i - 1]);
  }, 0) / (recentPrices.length - 1);

  return avgChange > 0 ? "صاعد" : "هابط";
};

export const calculateSupportResistance = (
  prices: number[],
  currentPrice: number,
  direction: "صاعد" | "هابط"
): { support: number; resistance: number } => {
  const sortedPrices = [...prices].sort((a, b) => a - b);
  const priceRange = sortedPrices[sortedPrices.length - 1] - sortedPrices[0];
  
  let support, resistance;
  
  if (direction === "صاعد") {
    support = Math.max(...prices.filter(p => p < currentPrice));
    resistance = currentPrice + (priceRange * 0.1);
  } else {
    resistance = Math.min(...prices.filter(p => p > currentPrice));
    support = currentPrice - (priceRange * 0.1);
  }
  
  return {
    support: Math.round(support * 100) / 100,
    resistance: Math.round(resistance * 100) / 100
  };
};

export const calculateStopLoss = (
  currentPrice: number,
  direction: "صاعد" | "هابط",
  support: number,
  resistance: number
): number => {
  const risk = 0.02; // 2% risk
  
  if (direction === "صاعد") {
    return Math.round((support * (1 - risk)) * 100) / 100;
  } else {
    return Math.round((resistance * (1 + risk)) * 100) / 100;
  }
};

export const calculateTargets = (
  currentPrice: number,
  direction: "صاعد" | "هابط",
  support: number,
  resistance: number
): number[] => {
  const range = Math.abs(resistance - support);
  
  if (direction === "صاعد") {
    return [
      Math.round((currentPrice + (range * 0.5)) * 100) / 100,
      Math.round((currentPrice + (range * 0.8)) * 100) / 100,
      Math.round((currentPrice + (range * 1.2)) * 100) / 100
    ];
  } else {
    return [
      Math.round((currentPrice - (range * 0.5)) * 100) / 100,
      Math.round((currentPrice - (range * 0.8)) * 100) / 100,
      Math.round((currentPrice - (range * 1.2)) * 100) / 100
    ];
  }
};
