
export type TrendDirection = "صاعد" | "هابط" | "محايد";

export interface PriceDataPoint {
  date?: Date | string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export type PriceData = PriceDataPoint;

export interface IndicatorOptions {
  period?: number;
  signalPeriod?: number;
  fastPeriod?: number;
  slowPeriod?: number;
  stdDev?: number;
}

export interface MACDResult {
  MACD: number;
  signal: number;
  histogram: number;
}

export interface BollingerBandsResult {
  upper: number;
  middle: number;
  lower: number;
}

export interface IchimokuResult {
  conversion: number;
  base: number;
  spanA: number;
  spanB: number;
}

export interface IndicatorResult {
  value: number | number[] | MACDResult | BollingerBandsResult | IchimokuResult;
  date?: Date | string;
}
