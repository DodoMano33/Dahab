
export interface AnalysisStats {
  type: string;
  success: number;
  fail: number;
  display_name?: string;
}

export interface SuccessRateChartProps {
  successRate: number;
  totalTests: number;
  isLoading: boolean;
}

export interface AnalysisStatsChartProps {
  data: {
    name: string;
    success: number;
    fail: number;
    total: number;
    rate: number;
  }[];
  isLoading: boolean;
}

export interface TimeframePerfChartProps {
  data: {
    name: string;
    success: number;
    fail: number;
    total: number;
    rate: number;
  }[];
  isLoading: boolean;
}
