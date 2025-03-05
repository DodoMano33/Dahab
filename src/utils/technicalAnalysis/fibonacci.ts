
export const calculateFibonacciLevels = (high: number, low: number) => {
  const difference = high - low;
  
  // Retracement levels
  const retracementLevels = [
    { level: 0.236, price: Number((high - difference * 0.236).toFixed(2)), type: "retracement" },
    { level: 0.382, price: Number((high - difference * 0.382).toFixed(2)), type: "retracement" },
    { level: 0.5, price: Number((high - difference * 0.5).toFixed(2)), type: "retracement" },
    { level: 0.618, price: Number((high - difference * 0.618).toFixed(2)), type: "retracement" },
    { level: 0.786, price: Number((high - difference * 0.786).toFixed(2)), type: "retracement" }
  ];
  
  // Extension levels
  const extensionLevels = [
    { level: 1.272, price: Number((high + difference * 0.272).toFixed(2)), type: "extension" },
    { level: 1.618, price: Number((high + difference * 0.618).toFixed(2)), type: "extension" },
    { level: 2.618, price: Number((high + difference * 1.618).toFixed(2)), type: "extension" }
  ];
  
  // Convert to simple level/price format for compatibility
  const allLevels = [...retracementLevels, ...extensionLevels].map(level => ({
    level: level.level,
    price: level.price
  }));
  
  return {
    retracementLevels,
    extensionLevels,
    allLevels
  };
};

export const findOptimalFibonacciEntry = (price: number, trend: string, fibLevels: any) => {
  const { retracementLevels } = fibLevels;
  
  if (trend === "صاعد") {
    // For bullish trend, look for entry near 61.8% or 50% retracement
    const level61 = retracementLevels.find(l => l.level === 0.618);
    const level50 = retracementLevels.find(l => l.level === 0.5);
    
    return {
      price: level61 ? level61.price : level50.price,
      reason: `نقطة دخول على مستوى فيبوناتشي ${level61 ? "61.8%" : "50%"} في اتجاه صاعد`
    };
  } else {
    // For bearish trend, look for entry near 38.2% or 50% retracement
    const level38 = retracementLevels.find(l => l.level === 0.382);
    const level50 = retracementLevels.find(l => l.level === 0.5);
    
    return {
      price: level38 ? level38.price : level50.price,
      reason: `نقطة دخول على مستوى فيبوناتشي ${level38 ? "38.2%" : "50%"} في اتجاه هابط`
    };
  }
};

export const calculateFibonacciTargets = (price: number, trend: string, fibLevels: any) => {
  const { extensionLevels } = fibLevels;
  const now = new Date();
  
  if (trend === "صاعد") {
    return extensionLevels.map((level, index) => ({
      price: level.price,
      expectedTime: new Date(now.getTime() + (index + 1) * 24 * 60 * 60 * 1000) // +1, +2, +3 days
    }));
  } else {
    // For bearish trend, invert the targets
    return extensionLevels.map((level, index) => ({
      price: 2 * price - level.price, // Invert for bearish
      expectedTime: new Date(now.getTime() + (index + 1) * 24 * 60 * 60 * 1000)
    }));
  }
};
