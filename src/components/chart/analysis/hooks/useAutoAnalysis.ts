
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

    // Normalize analysis types for reliable mapping
    const normalizeAnalysisType = (type: string): string => {
      const typeMap: Record<string, string> = {
        "fibonacci": "fibonacci",
        "fibonacci_advanced": "fibonacci_advanced", 
        "waves": "waves",
        "price_action": "price_action",
        "ict": "ict",
        "smc": "smc",
        "patterns": "patterns",
        "normal": "patterns",
        "pattern": "patterns",
        "scalping": "scalping",
        "gann": "gann",
        "turtle_soup": "turtle_soup",
        "neural_network": "neural_network",
        "rnn": "rnn",
        "multi_variance": "multi_variance",
        "time_clustering": "time_clustering",
        "composite_candlestick": "composite_candlestick",
        "behavioral": "behavioral"
      };
      
      return typeMap[type.toLowerCase()] || type;
    };

    const runAnalysis = async () => {
      try {
        for (const timeframe of timeframes) {
          for (const analysisType of analysisTypes) {
            console.log(`Running analysis for ${symbol} on ${timeframe} with type ${analysisType} and duration ${duration}`);
            
            // Normalize the analysis type for consistent mapping
            const normalizedType = normalizeAnalysisType(analysisType);
            console.log("Normalized analysis type:", normalizedType);
            
            // Map analysis type to boolean flags
            const isFibonacciAdvanced = normalizedType === "fibonacci_advanced";
            const isFibonacci = normalizedType === "fibonacci";
            const isScalping = normalizedType === "scalping";
            const isSMC = normalizedType === "smc";
            const isICT = normalizedType === "ict";
            const isTurtleSoup = normalizedType === "turtle_soup";
            const isGann = normalizedType === "gann";
            const isWaves = normalizedType === "waves";
            const isPatternAnalysis = normalizedType === "patterns";
            const isPriceAction = normalizedType === "price_action";
            const isNeuralNetwork = normalizedType === "neural_network";
            const isRNN = normalizedType === "rnn";
            const isTimeClustering = normalizedType === "time_clustering";
            const isMultiVariance = normalizedType === "multi_variance";
            const isCompositeCandlestick = normalizedType === "composite_candlestick";
            const isBehavioral = normalizedType === "behavioral";
            
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
              
              // Always set activation_type to تلقائي for automatic analysis
              result.analysisResult.activation_type = "تلقائي";
              console.log("Explicitly set activation_type to تلقائي for auto analysis");
              
              await saveAnalysisResult({
                userId: user.id,
                symbol,
                currentPrice,
                result,
                analysisType: normalizedType,
                timeframe,
                duration,
                onAnalysisComplete,
                isAutomatic: true // Add this flag to indicate automatic analysis
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
