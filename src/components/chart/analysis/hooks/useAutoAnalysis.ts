import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useAnalysisHandler } from "../AnalysisHandler";

interface AutoAnalysisConfig {
  timeframes: string[];
  interval: string;
  analysisTypes: string[];
  repetitions: number;
  onAnalysisComplete?: (newItem: any) => void;
}

export const useAutoAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisInterval, setAnalysisInterval] = useState<NodeJS.Timeout | null>(null);
  const { user } = useAuth();
  const { handleTradingViewConfig } = useAnalysisHandler();

  const validateInputs = (timeframes: string[], interval: string, analysisTypes: string[]) => {
    if (timeframes.length === 0) {
      toast.error("الرجاء اختيار إطار زمني واحد على الأقل");
      return false;
    }

    if (!interval) {
      toast.error("الرجاء اختيار فترة التحليل");
      return false;
    }

    if (analysisTypes.length === 0) {
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

  const startAutoAnalysis = async (config: AutoAnalysisConfig) => {
    const { timeframes, interval, analysisTypes, repetitions, onAnalysisComplete } = config;

    if (!validateInputs(timeframes, interval, analysisTypes)) {
      return;
    }

    setIsAnalyzing(true);
    console.log("Starting auto analysis with config:", config);

    const runAnalysis = async () => {
      try {
        for (const timeframe of timeframes) {
          for (const analysisType of analysisTypes) {
            const result = await handleTradingViewConfig(
              "BTCUSDT", // Default symbol for testing
              timeframe,
              undefined, // Price will be fetched automatically
              analysisType === "scalping",
              analysisType === "smart",
              analysisType === "smc",
              analysisType === "ict",
              analysisType === "turtleSoup",
              analysisType === "gann",
              analysisType === "waves",
              analysisType === "patterns",
              analysisType === "priceAction"
            );

            if (result && onAnalysisComplete) {
              onAnalysisComplete(result);
            }
          }
        }
      } catch (error) {
        console.error("Error in auto analysis:", error);
        toast.error("حدث خطأ أثناء التحليل التلقائي");
      }
    };

    // Run initial analysis
    await runAnalysis();

    // Set up interval for repeated analysis
    if (repetitions > 1) {
      const intervalId = setInterval(runAnalysis, getIntervalInMs(interval));
      setAnalysisInterval(intervalId);
    }
  };

  const stopAutoAnalysis = () => {
    if (analysisInterval) {
      clearInterval(analysisInterval);
      setAnalysisInterval(null);
    }
    setIsAnalyzing(false);
  };

  return {
    isAnalyzing,
    setIsAnalyzing,
    analysisInterval,
    setAnalysisInterval,
    validateInputs,
    getIntervalInMs,
    user,
    handleTradingViewConfig,
    startAutoAnalysis,
    stopAutoAnalysis
  };
};