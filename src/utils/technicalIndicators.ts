interface TechnicalIndicators {
  rsi: number;
  obv: number;
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
  movingAverages: {
    short: number;
    long: number;
  };
}

export const calculateRSI = (prices: number[], period: number = 14): number => {
  if (prices.length < period) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i < period; i++) {
    const difference = prices[i] - prices[i - 1];
    if (difference >= 0) {
      gains += difference;
    } else {
      losses -= difference;
    }
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

export const calculateBollingerBands = (
  prices: number[],
  period: number = 20,
  stdDev: number = 2
) => {
  const sma = prices.slice(-period).reduce((a, b) => a + b) / period;
  
  const squaredDiffs = prices
    .slice(-period)
    .map(price => Math.pow(price - sma, 2));
  
  const variance = squaredDiffs.reduce((a, b) => a + b) / period;
  const standardDeviation = Math.sqrt(variance);
  
  return {
    upper: sma + standardDeviation * stdDev,
    middle: sma,
    lower: sma - standardDeviation * stdDev,
  };
};

export const calculateMovingAverages = (prices: number[]) => {
  const shortPeriod = 9;
  const longPeriod = 50;

  const shortMA = prices
    .slice(-shortPeriod)
    .reduce((a, b) => a + b) / shortPeriod;
  
  const longMA = prices
    .slice(-longPeriod)
    .reduce((a, b) => a + b) / longPeriod;

  return {
    short: shortMA,
    long: longMA,
  };
};

export const calculateOBV = (prices: number[], volumes: number[]): number => {
  let obv = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      obv += volumes[i];
    } else if (prices[i] < prices[i - 1]) {
      obv -= volumes[i];
    }
  }
  return obv;
};

export const calculateTechnicalIndicators = (
  prices: number[],
  volumes?: number[]
): TechnicalIndicators => {
  return {
    rsi: calculateRSI(prices),
    bollingerBands: calculateBollingerBands(prices),
    movingAverages: calculateMovingAverages(prices),
    obv: volumes ? calculateOBV(prices, volumes) : 0,
  };
};