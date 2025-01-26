import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { saveAnalysis } from "../utils/saveAnalysis";
import { SearchHistoryItem } from "@/types/analysis";
import { mapToAnalysisType } from "../utils/analysisTypeMapper";
import { useAnalysisHandler } from "../AnalysisHandler";

interface AutoAnalysisConfig {
  timeframes: string[];
  interval: string;
  analysisTypes: string[];
  repetitions: number;
  currentPrice: number;
  symbol: string;
  duration: number;
  onAnalysisComplete?: (newItem: SearchHistoryItem) => void;
}

export const useAutoAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisInterval, setAnalysisInterval] = useState<NodeJS.Timeout | null>(null);
  const { user } = useAuth();
  const { handleTradingViewConfig } = useAnalysisHandler();

  const validateInputs = (timeframes: string[], interval: string, analysisTypes: string[], currentPrice?: number, duration?: number) => {
    if (timeframes.length === 0) {
      toast.error("الرجاء اختيار إطار زمني واحد على الأقل");
      return false;
    }

    if (!interval) {
      toast.error("الرجاء اختيار الفاصل الزمني");
      return false;
    }

    if (analysisTypes.length === 0) {
      toast.error("الرجاء اختيار نوع تحليل واحد على الأقل");
      return false;
    }

    if (!currentPrice) {
      toast.error("الرجاء إدخال السعر الحالي للتحليل");
      return false;
    }

    if (!duration || duration < 1 || duration > 72) {
      toast.error("مدة التحليل يجب أن تكون بين 1 و 72 ساعة");
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
    const { timeframes, interval, analysisTypes, repetitions, currentPrice, symbol, duration, onAnalysisComplete } = config;

    if (!user) {
      toast.error("يرجى تسجيل الدخول لحفظ نتائج التحليل");
      return;
    }

    if (!validateInputs(timeframes, interval, analysisTypes, currentPrice, duration)) {
      return;
    }

    setIsAnalyzing(true);
    console.log("Starting auto analysis with config:", { ...config, symbol });

    const runAnalysis = async () => {
      try {
        for (const timeframe of timeframes) {
          for (const analysisType of analysisTypes) {
            console.log(`Running analysis for ${symbol} on ${timeframe} with type ${analysisType}`);
            
            // Pass only the required arguments in the correct order
            const result = await handleTradingViewConfig(
              symbol,
              timeframe,
              currentPrice,
              analysisType === "scalping",
              false, // isAI
              analysisType === "smc",
              analysisType === "ict",
              analysisType === "turtle_soup",
              analysisType === "gann",
              analysisType === "waves",
              analysisType === "patterns",
              analysisType === "price_action"
            );

            if (result && result.analysisResult) {
              console.log("Analysis completed successfully:", result);
              
              try {
                const mappedAnalysisType = mapToAnalysisType(analysisType);
                
                const savedData = await saveAnalysis({
                  userId: user.id,
                  symbol: symbol,
                  currentPrice: currentPrice,
                  analysisResult: result.analysisResult,
                  analysisType: mappedAnalysisType,
                  timeframe: timeframe,
                  durationHours: duration
                });

                if (savedData && onAnalysisComplete) {
                  const newHistoryEntry: SearchHistoryItem = {
                    id: savedData.id,
                    date: new Date(),
                    symbol: symbol,
                    currentPrice: currentPrice,
                    analysis: result.analysisResult,
                    targetHit: false,
                    stopLossHit: false,
                    analysisType: mappedAnalysisType,
                    timeframe: timeframe,
                    analysis_duration_hours: duration
                  };
                  
                  console.log("Adding new analysis to history:", newHistoryEntry);
                  onAnalysisComplete(newHistoryEntry);
                }
              } catch (saveError) {
                console.error("Error saving analysis:", saveError);
                toast.error("حدث خطأ أثناء حفظ التحليل");
              }
            }
          }
        }
      } catch (error) {
        console.error("Error in auto analysis:", error);
        toast.error("حدث خطأ أثناء التحليل التلقائي");
      }
    };

    await runAnalysis();

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
    startAutoAnalysis,
    stopAutoAnalysis
  };
};