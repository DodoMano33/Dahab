
export interface UseTradingViewMessagesProps {
  symbol: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
}

export interface UseTradingViewMessagesResult {
  currentPrice: number | null;
  priceUpdateCount: number;
  lastPriceUpdateTime: Date | null;
  extractionMethods: string[];
}

export interface PriceEvent {
  price: number;
  timestamp: string;
  source: string;
  method?: string;
}

declare global {
  interface Window {
    lastPriceEvent?: PriceEvent;
    TradingView?: any;
    tvWidget?: any;
    activeChart?: any;
  }
}
