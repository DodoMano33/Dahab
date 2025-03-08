
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
            
            // Initialize all flags to false
            let isPatternAnalysis = false;
            let isScalping = false;
            let isSMC = false;
            let isICT = false;
            let isTurtleSoup = false;
            let isGann = false;
            let isWaves = false;
            let isPriceAction = false;
            let isNeuralNetwork = false;
            let isRNN = false;
            let isTimeClustering = false;
            let isMultiVariance = false;
            let isCompositeCandlestick = false;
            let isBehavioral = false;
            let isFibonacci = false;
            let isFibonacciAdvanced = false;
            
            // Set the appropriate flag based on the analysis type
            switch (analysisType.toLowerCase().replace(/[_\s-]/g, "")) {
              case "patterns":
                isPatternAnalysis = true;
                break;
              case "scalping":
                isScalping = true;
                break;
              case "smc":
                isSMC = true;
                break;
              case "ict":
                isICT = true;
                break;
              case "turtlesoup":
              case "turtle_soup":
                isTurtleSoup = true;
                break;
              case "gann":
                isGann = true;
                break;
              case "waves":
                isWaves = true;
                break;
              case "priceaction":
              case "price_action":
                isPriceAction = true;
                break;
              case "neuralnetworks":
              case "neural_networks":
                isNeuralNetwork = true;
                break;
              case "rnn":
                isRNN = true;
                break;
              case "timeclustering":
              case "time_clustering":
                isTimeClustering = true;
                break;
              case "multivariance":
              case "multi_variance":
                isMultiVariance = true;
                break;
              case "compositecandlestick":
              case "composite_candlestick":
                isCompositeCandlestick = true;
                break;
              case "behavioral":
                isBehavioral = true;
                break;
              case "fibonacci":
                isFibonacci = true;
                break;
              case "fibonacciadvanced":
              case "fibonacci_advanced":
                isFibonacciAdvanced = true;
                break;
            }
            
            // Call the analysis function with the correct flags set
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
