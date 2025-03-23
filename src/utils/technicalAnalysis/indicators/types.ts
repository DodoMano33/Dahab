
// Common types used across technical indicators
export type PriceData = {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

export type TrendDirection = "صاعد" | "هابط" | "محايد";

// Input types for various indicators
export type MAInput = {
  values: number[];
  period: number;
};

export type RSIInput = {
  values: number[];
  period: number;
};

export type MACDInput = {
  values: number[];
  fastPeriod: number;
  slowPeriod: number;
  signalPeriod: number;
};

export type BollingerBandsInput = {
  values: number[];
  period: number;
  stdDev: number;
};

export type StochasticInput = {
  high: number[];
  low: number[];
  close: number[];
  period: number;
  signalPeriod: number;
};

export type IchimokuInput = {
  high: number[];
  low: number[];
  conversionPeriod: number;
  basePeriod: number;
  spanPeriod: number;
  displacement: number;
};

// Output types for various indicators
export type MAOutput = number[];

export type RSIOutput = number[];

export type MACDOutput = {
  macd: number[];
  signal: number[];
  histogram: number[];
};

export type BollingerBandsOutput = {
  upper: number[];
  middle: number[];
  lower: number[];
};

export type StochasticOutput = {
  k: number[];
  d: number[];
};

export type IchimokuOutput = {
  conversionLine: number[];
  baseLine: number[];
  spanA: number[];
  spanB: number[];
};

// Types for support and resistance
export type SupportResistanceLevel = {
  price: number;
  strength: number;
  type: 'support' | 'resistance';
};

export type SupportResistanceOutput = {
  support: number;
  resistance: number;
  levels?: SupportResistanceLevel[];
};

// Types for risk management calculations
export type RiskRewardRatio = {
  risk: number;
  reward: number;
  ratio: number;
};

export type StopLossData = {
  price: number;
  percentageFromEntry: number;
  reason?: string;
};

export type ProfitTargetData = {
  price: number;
  percentageFromEntry: number;
  probabilityScore?: number;
};

// Types for volatility indicators
export type VolatilityOutput = {
  value: number;
  classification: 'low' | 'medium' | 'high';
  percentile?: number;
};

// Types for pattern detection
export type PatternDetectionResult = {
  pattern: string;
  signalStrength: number;
  direction: TrendDirection;
  priceTarget?: number;
};

// Types for Fibonacci analysis
export type FibonacciLevel = {
  level: number;
  price: number;
  type?: 'retracement' | 'extension' | 'projection';
};

export type FibonacciOutput = {
  retracementLevels: FibonacciLevel[];
  extensionLevels?: FibonacciLevel[];
  projectionLevels?: FibonacciLevel[];
  allLevels?: FibonacciLevel[];
};
