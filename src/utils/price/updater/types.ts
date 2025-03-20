
import { PriceSubscription } from '../types';

export interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
}

export interface PriceUpdaterConfig {
  rateLimitResetTime: number;
  pollingInterval: number;
}

export interface SubscriptionManager {
  subscribe: (subscription: PriceSubscription) => void;
  unsubscribe: (symbol: string, callback: (price: number) => void) => void;
  notifySubscribers: (symbol: string, price: number) => void;
  notifyError: (symbol: string, error: Error) => void;
  getSubscribedSymbols: () => string[];
  hasSubscribers: (symbol: string) => boolean;
}
