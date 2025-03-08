
// Helper function to determine trend with probability skew
export function detectAdvancedTrend(currentPrice: number, high: number, low: number) {
  // More sophisticated trend detection (simulated)
  const pricePosition = (currentPrice - low) / (high - low);
  const bullishProbability = pricePosition < 0.5 ? 0.7 : 0.3; // Higher chance of bullish if price is closer to the low
  
  return {
    direction: Math.random() < bullishProbability ? "Up" : "Down",
    strength: Math.random() * 0.5 + 0.5, // Trend strength between 0.5-1.0
    confirmed: Math.random() > 0.3 // 70% chance the trend is confirmed
  };
}

// Helper function to get volatility factor based on timeframe
export function getVolatilityFactor(timeframe: string): number {
  switch (timeframe) {
    case "1m": return 0.005; // 0.5%
    case "5m": return 0.01;  // 1%
    case "30m": return 0.015; // 1.5%
    case "1h": return 0.02;  // 2%
    case "4h": return 0.03;  // 3%
    case "1d": return 0.05;  // 5%
    default: return 0.03;
  }
}

// Calculate advanced Fibonacci levels (more comprehensive than basic)
export function calculateAdvancedFibonacciLevels(high: number, low: number, currentPrice: number, direction: string) {
  const range = high - low;
  
  // Basic retracement levels
  const basicLevels = [
    { level: 0.236, price: high - range * 0.236 },
    { level: 0.382, price: high - range * 0.382 },
    { level: 0.5, price: high - range * 0.5 },
    { level: 0.618, price: high - range * 0.618 },
    { level: 0.786, price: high - range * 0.786 },
    { level: 0.886, price: high - range * 0.886 }
  ];
  
  // Extension levels
  const extensionLevels = [
    { level: 1.27, price: high + range * 0.27 },
    { level: 1.41, price: high + range * 0.41 },
    { level: 1.618, price: high + range * 0.618 },
    { level: 2.0, price: high + range * 1.0 },
    { level: 2.618, price: high + range * 1.618 }
  ];
  
  // Projection levels (from current price)
  const projectionBase = direction === "Up" ? currentPrice - low : high - currentPrice;
  const projectionLevels = [
    { level: 0.618, price: currentPrice + (direction === "Up" ? 1 : -1) * projectionBase * 0.618 },
    { level: 1.0, price: currentPrice + (direction === "Up" ? 1 : -1) * projectionBase },
    { level: 1.618, price: currentPrice + (direction === "Up" ? 1 : -1) * projectionBase * 1.618 }
  ];
  
  // Combine all levels and round to 2 decimal places
  return [...basicLevels, ...extensionLevels, ...projectionLevels].map(level => ({
    level: level.level,
    price: Number(level.price.toFixed(2))
  }));
}
