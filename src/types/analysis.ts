export interface AnalysisData {
  pattern: string;
  direction: "صاعد" | "هابط";
  currentPrice: number;
  support: number;
  resistance: number;
  stopLoss: number;
  bestEntryPoint?: {
    price: number;
    reason: string;
  };
  targets?: {
    price: number;
    expectedTime: Date;
  }[];
  fibonacciLevels?: {
    level: number;
    price: number;
  }[];
  analysisType: "عادي" | "سكالبينج" | "ذكي" | "SMC" | "ICT" | "Turtle Soup" | "Gann";
}