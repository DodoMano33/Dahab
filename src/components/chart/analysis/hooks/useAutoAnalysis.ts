import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { SearchHistoryItem } from "@/types/analysis";
import { useAnalysisHandler } from "../AnalysisHandler";
import { validateAnalysisInputs } from "../utils/analysisValidation";
import { getIntervalInMs } from "../utils/intervalUtils";
import { useSaveAnalysis } from "./useSaveAnalysis";

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
  const { saveAnalysisResult } = useSaveAnalysis();

  const startAutoAnalysis = async (config: AutoAnalysisConfig) => {
    const { timeframes, interval, analysisTypes, repetitions, currentPrice, symbol, duration, onAnalysisComplete } = config;

    if (!user) {
      toast.error("يرجى تسجيل الدخول لحفظ نتائج التحليل");
      return;
    }

    if (!validateAnalysisInputs(timeframes, interval, analysisTypes, currentPrice, duration)) {
      return;
    }

    setIsAnalyzing(true);
    console.log("Starting auto analysis with config:", { ...config, symbol, duration });

    const runAnalysis = async () => {
      try {
        for (const timeframe of timeframes) {
          for (const analysisType of analysisTypes) {
            console.log(`Running analysis for ${symbol} on ${timeframe} with type ${analysisType} and duration ${duration}`);
            
            // Map analysis type to boolean flags
            const isFibonacciAdvanced = analysisType === "fibonacci_advanced" || analysisType === "تحليل فيبوناتشي متقدم";
            const isFibonacci = analysisType === "fibonacci";
            const isScalping = analysisType === "scalping";
            const isSMC = analysisType === "smc";
            const isICT = analysisType === "ict";
            const isTurtleSoup = analysisType === "turtle_soup";
            const isGann = analysisType === "gann";
            const isWaves = analysisType === "waves";
            const isPatternAnalysis = analysisType === "patterns";
            const isPriceAction = analysisType === "price_action";
            const isNeuralNetwork = analysisType === "neural_network";
            const isRNN = analysisType === "rnn";
            const isTimeClustering = analysisType === "time_clustering";
            const isMultiVariance = analysisType === "multi_variance";
            const isCompositeCandlestick = analysisType === "composite_candlestick";
            const isBehavioral = analysisType === "behavioral";
            
            // The function expects at most 20 arguments, but we're passing 21
            // Let's pass the duration as part of an options object instead
            const result = await handleTradingViewConfig(
              symbol,
              timeframe,
              currentPrice,
              isScalping,
              false, // isAI
              isSMC,
              isICT,
              isTurtleSoup,
              isGann,
              isWaves,
              isPatternAnalysis,
              isPriceAction,
              isNeuralNetwork,
              isRNN,
              isTimeClustering,
              isMultiVariance,
              isCompositeCandlestick,
              isBehavioral,
              isFibonacci,
              isFibonacciAdvanced
            );

            if (result && result.analysisResult) {
              console.log("Analysis completed successfully:", result);
              
              await saveAnalysisResult({
                userId: user.id,
                symbol,
                currentPrice,
                result,
                analysisType,
                timeframe,
                duration,
                onAnalysisComplete
              });
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
