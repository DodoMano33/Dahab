
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

// Remove the declare global block to avoid duplicate declarations
// These are already declared in src/types/tradingview.d.ts
