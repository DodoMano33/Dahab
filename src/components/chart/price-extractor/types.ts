
export interface PriceRecord {
  price: number;
  timestamp: Date;
  source: string;
}

export interface PriceExtractorProps {
  defaultInterval?: number;
  onPriceExtracted?: (price: number) => void;
  customSelectors?: string[];
}

export interface PriceExtractorOptions {
  interval?: number;
  enabled?: boolean;
  maxHistorySize?: number;
  customSelectors?: string[];
  extractOnMount?: boolean;
  debugMode?: boolean;
}
