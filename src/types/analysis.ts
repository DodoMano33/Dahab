export interface AnalysisData {
  pattern: string;
  direction: "صاعد" | "هابط";
  currentPrice: number;
  support: number;
  resistance: number;
  stopLoss: number;
  targets?: {
    price: number;
    expectedTime: Date;
  }[];
  fibonacciLevels?: {
    level: number;
    price: number;
  }[];
}