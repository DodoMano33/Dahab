
export interface FetchDiagnostics {
  startTime: Date;
  endTime: Date | null;
  status: 'pending' | 'success' | 'error';
  responseStatus?: number;
  responseTime?: number;
  error?: string;
  retryCount: number;
}

export interface UseBackTestResult {
  triggerManualCheck: () => Promise<void>;
  cancelCurrentRequest: () => void;
  isLoading: boolean;
  lastCheckTime: Date | null;
  retryCount: number;
  diagnostics: FetchDiagnostics[];
}
