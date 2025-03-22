export type AnalysisType = 
  | "سكالبينج" 
  | "ذكي" 
  | "SMC" 
  | "ICT" 
  | "Turtle Soup" 
  | "Gann" 
  | "Waves" 
  | "Patterns" 
  | "Price Action" 
  | "شبكات عصبية" 
  | "شبكات عصبية متكررة" 
  | "تصفيق زمني" 
  | "تباين متعدد العوامل" 
  | "شمعات مركبة" 
  | "تحليل سلوكي" 
  | "فيبوناتشي"
  | "فيبوناتشي متقدم"
  | "عادي"
  | "نمطي"
  | "تقلبات"
  | "جان"
  | "الحساء السلحفائي"
  | "نظرية السوق"
  | "نظرية هيكل السوق"
  | "يومي"
  | "مضاربة"
  | "حركة السعر";

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
  analysis_duration_hours?: number;
}

export interface SearchHistoryItem {
  id: string;
  date: Date;
  symbol: string;
  currentPrice: number;
  analysis: AnalysisData;
  analysisType: AnalysisType; 
  timeframe: string;
  targetHit?: boolean;
  stopLossHit?: boolean;
  analysis_duration_hours?: number;
  last_checked_price?: number;
  last_checked_at?: Date | string | null;
  result_timestamp?: Date | string | null;
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
    isNeuralNetwork?: boolean,
    isRNN?: boolean,
    isTimeClustering?: boolean,
    isMultiVariance?: boolean,
    isCompositeCandlestick?: boolean,
    isBehavioral?: boolean,
    isFibonacci?: boolean,
    isFibonacciAdvanced?: boolean,
    duration?: string
  ) => void;
}
