
import { useState } from "react";

// Define a basic stats type for compatibility
type BacktestStat = {
  type: string;
  success: number;
  fail: number;
  timeframe?: string;
  id?: string;
};

// This is a placeholder hook that returns empty data
export const useBacktestStats = () => {
  const [stats] = useState<BacktestStat[]>([]);
  const [isLoading] = useState(false);

  // Just provide the minimum required interface
  return {
    stats,
    isLoading,
    refresh: () => console.log("Refresh stats requested but not implemented"),
  };
};
