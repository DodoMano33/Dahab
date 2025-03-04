export type AnalysisType = "سكالبينج" | "ذكي" | "SMC" | "ICT" | "Turtle Soup" | "Gann" | "Waves" | "Patterns" | "Price Action" | "شبكات عصبية" | "عادي";

export interface ImageData {
  height: number;
  width: number;
  data: Uint8ClampedArray;
}

export interface AnalysisData {
  pattern: string;
  direction: "صاعد" | "هابط" | "محايد";
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
  activation_type?: "تلقائي" | "يدوي";
  analysisType: AnalysisType;
}

export interface SearchHistoryItem {
  id: string;
  date: Date;
  symbol: string;
  currentPrice: number;
  analysis: AnalysisData;
  targetHit?: boolean;
  stopLossHit?: boolean;
  analysisType: AnalysisType;
  timeframe: string;
  analysis_duration_hours?: number;
  last_checked_price?: number;
  last_checked_at?: Date;
  result_timestamp?: Date; // إضافة حقل result_timestamp
  is_success?: boolean;    // إضافة حقل is_success
}

export interface CombinedAnalysisProps {
  symbol: string;
  defaultSymbol: string;
  price: string;
  defaultPrice: number | null;
  timeframe: string;
  duration?: string;
  onSubmit: (
    symbol: string,
    timeframe: string,
    providedPrice?: number,
    isScalping?: boolean,
    isAI?: boolean,
    isSMC?: boolean,
    isICT?: boolean,
    isTurtleSoup?: boolean,
    isGann?: boolean,
    isWaves?: boolean,
    isPatternAnalysis?: boolean,
    isPriceAction?: boolean,
    duration?: string
  ) => void;
}
