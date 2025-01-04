export interface PriceSubscription {
  symbol: string;
  onUpdate: (price: number) => void;
  onError: (error: Error) => void;
}

export interface CachedPrice {
  price: number;
  timestamp: number;
}