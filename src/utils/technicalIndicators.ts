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

export interface DetailedIndicators extends TechnicalIndicators {
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
  };
  stochastic: {
    k: number;
    d: number;
  };
  adx: number;
  cci: number;
  mfi: number;
  volumeProfile: {
    currentVolume: number;
    averageVolume: number;
    volumeRatio: number;
    recommendedVolume: number;
  };
}

export const calculateDetailedIndicators = (
  prices: number[],
  volumes?: number[]
): DetailedIndicators => {
  const baseIndicators = calculateTechnicalIndicators(prices, volumes);
  
  // Calculate MACD
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macdLine = ema12 - ema26;
  const signalLine = calculateEMA([macdLine], 9);
  
  // Calculate Stochastic
  const highestHigh = Math.max(...prices.slice(-14));
  const lowestLow = Math.min(...prices.slice(-14));
  const k = ((prices[prices.length - 1] - lowestLow) / (highestHigh - lowestLow)) * 100;
  const d = calculateSMA([k], 3);

  // Calculate ADX
  const adx = calculateADX(prices);

  // Calculate CCI
  const cci = calculateCCI(prices);

  // Calculate MFI
  const mfi = calculateMFI(prices, volumes || []);

  // Volume Profile
  const currentVolume = volumes ? volumes[volumes.length - 1] : 0;
  const averageVolume = volumes ? 
    volumes.reduce((a, b) => a + b, 0) / volumes.length : 
    0;

  return {
    ...baseIndicators,
    macd: {
      macdLine,
      signalLine,
      histogram: macdLine - signalLine
    },
    stochastic: {
      k,
      d
    },
    adx,
    cci,
    mfi,
    volumeProfile: {
      currentVolume,
      averageVolume,
      volumeRatio: currentVolume / averageVolume,
      recommendedVolume: averageVolume * 1.5 // 150% of average volume
    }
  };
};

// Helper functions
const calculateEMA = (prices: number[], period: number): number => {
  const multiplier = 2 / (period + 1);
  let ema = prices[0];
  
  for (let i = 1; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }
  
  return ema;
};

const calculateSMA = (prices: number[], period: number): number => {
  return prices.slice(-period).reduce((a, b) => a + b) / period;
};

const calculateADX = (prices: number[]): number => {
  // Simplified ADX calculation
  const changes = prices.slice(1).map((price, i) => Math.abs(price - prices[i]));
  return (changes.reduce((a, b) => a + b) / changes.length) * 100;
};

const calculateCCI = (prices: number[]): number => {
  const sma = calculateSMA(prices, 20);
  const meanDeviation = prices.reduce((acc, price) => acc + Math.abs(price - sma), 0) / prices.length;
  return (prices[prices.length - 1] - sma) / (0.015 * meanDeviation);
};

const calculateMFI = (prices: number[], volumes: number[]): number => {
  const typicalPrices = prices.map((price, i) => ({
    price,
    volume: volumes[i] || 0
  }));
  
  let positiveFlow = 0;
  let negativeFlow = 0;
  
  for (let i = 1; i < typicalPrices.length; i++) {
    const moneyFlow = typicalPrices[i].price * typicalPrices[i].volume;
    if (typicalPrices[i].price > typicalPrices[i-1].price) {
      positiveFlow += moneyFlow;
    } else {
      negativeFlow += moneyFlow;
    }
  }
  
  return 100 - (100 / (1 + (positiveFlow / negativeFlow)));
};
