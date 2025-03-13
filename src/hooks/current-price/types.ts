
export interface UseCurrentPriceResult {
  currentPrice: number | null;
  priceUpdateCount: number;
  priceSource?: string;
}

export interface PriceUpdateEvent extends CustomEvent {
  detail: {
    price: number;
    source?: string;
  };
}

export interface CurrentPriceResponseEvent extends CustomEvent {
  detail: {
    price: number;
    source?: string;
  };
}
