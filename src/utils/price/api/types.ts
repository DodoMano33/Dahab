
export interface PriceResponse {
  success: boolean;
  price: number | null;
  message: string;
}

export interface PriceData {
  symbol: string;
  price: number;
  timestamp: number;
}

export interface PriceUpdateEvent extends CustomEvent {
  detail: {
    price: number;
    symbol: string;
  };
}

export interface RateLimitResponse {
  isLimited: boolean;
  resetTime?: number;
  message?: string;
}
