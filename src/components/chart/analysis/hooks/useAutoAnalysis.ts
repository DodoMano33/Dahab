import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useAnalysisHandler } from "../AnalysisHandler";

export const useAutoAnalysis = (
  selectedTimeframes: string[],
  selectedInterval: string,
  selectedAnalysisTypes: string[]
) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisInterval, setAnalysisInterval] = useState<NodeJS.Timeout | null>(null);
  const { user } = useAuth();
  const { handleTradingViewConfig } = useAnalysisHandler();

  const validateInputs = () => {
    if (selectedTimeframes.length === 0) {
      toast.error("الرجاء اختيار إطار زمني واحد على الأقل");
      return false;
    }

    if (!selectedInterval) {
      toast.error("الرجاء اختيار فترة التحليل");
      return false;
    }

    if (selectedAnalysisTypes.length === 0) {
      toast.error("الرجاء اختيار نوع تحليل واحد على الأقل");
      return false;
    }

    return true;
  };

  const getIntervalInMs = (interval: string) => {
    const intervals: { [key: string]: number } = {
      "1m": 60000,
      "5m": 300000,
      "30m": 1800000,
      "1h": 3600000,
      "4h": 14400000,
      "1d": 86400000
    };
    return intervals[interval] || 60000;
  };

  return {
    isAnalyzing,
    setIsAnalyzing,
    analysisInterval,
    setAnalysisInterval,
    validateInputs,
    getIntervalInMs,
    user,
    handleTradingViewConfig
  };
};