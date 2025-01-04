export interface AnalysisData {
  pattern: string;
  direction: "صاعد" | "هابط" | "محايد";  // Updated to include "محايد"
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
  analysisType: "عادي" | "سكالبينج" | "ذكي" | "SMC" | "ICT" | "Turtle Soup" | "Gann" | "Waves" | "Patterns" | "Smart" | "Price Action";
}

export interface SearchHistoryItem {
  id: string;
  date: Date;
  symbol: string;
  currentPrice: number;
  analysis: AnalysisData;
  targetHit?: boolean;
  stopLossHit?: boolean;
  analysisType: "عادي" | "سكالبينج" | "ذكي" | "SMC" | "ICT" | "Turtle Soup" | "Gann" | "Waves" | "Patterns" | "Smart" | "Price Action";
  timeframe: string;
}

export interface ImageData {
  height: number;
  width: number;
  data: Uint8ClampedArray;
}