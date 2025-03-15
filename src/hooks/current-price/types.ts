
export interface UseCurrentPriceResult {
  currentPrice: number | null;
  priceUpdateCount: number;
}

export interface PriceUpdateEvent extends CustomEvent {
  detail: {
    price: number;
    symbol?: string;
  };
}

export interface CurrentPriceResponseEvent extends CustomEvent {
  detail: {
    price: number;
    symbol?: string;
    dayLow?: number;
    dayHigh?: number;
    weekLow?: number;
    weekHigh?: number;
    change?: number;
    changePercent?: number;
    recommendation?: string;
  };
}
