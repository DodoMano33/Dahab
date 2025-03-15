
export interface UseCurrentPriceResult {
  currentPrice: number | null;
  priceUpdateCount: number;
}

export interface PriceUpdateEvent extends CustomEvent {
  detail: {
    price: number;
  };
}

export interface CurrentPriceResponseEvent extends CustomEvent {
  detail: {
    price: number;
  };
}
