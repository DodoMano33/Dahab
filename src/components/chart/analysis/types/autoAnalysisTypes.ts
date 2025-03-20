
import { SearchHistoryItem } from "@/types/analysis";

export interface AutoAnalysisConfig {
  timeframes: string[];
  interval: string;
  analysisTypes: string[];
  repetitions: number;
  symbol: string;
  currentPrice: number;
  duration: number;
  onAnalysisComplete?: (newItem: SearchHistoryItem) => void;
}

export interface TradingViewConfigHandler {
  (
    symbol: string,
    timeframe: string,
    currentPrice: number,
    isScalping?: boolean,
    isAI?: boolean,
    isSMC?: boolean,
    isICT?: boolean,
    isTurtleSoup?: boolean,
    isGann?: boolean,
    isWaves?: boolean,
    isPatternAnalysis?: boolean,
    isPriceAction?: boolean
  ): any;
}

export interface AnalysisParameters {
  symbol: string;
  price: number;
  timeframe: string;
  analysisType: string;
  user: any;
  handleTradingViewConfig: TradingViewConfigHandler;
  onAnalysisComplete?: (newItem: SearchHistoryItem) => void;
}

export interface ValidationResult {
  isValid: boolean;
}
