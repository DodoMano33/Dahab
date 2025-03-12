
export interface AnalysisCheckerProps {
  symbol: string;
  currentPriceRef: React.MutableRefObject<number | null>;
}

export interface UseAnalysisCheckerResult {
  isChecking: boolean;
  lastErrorTime: Date | null;
  consecutiveErrors: number;
  retryCount: number;
}

export interface CheckAnalysesOptions {
  price: number | null;
  symbol: string;
  isManualCheck?: boolean;
}
