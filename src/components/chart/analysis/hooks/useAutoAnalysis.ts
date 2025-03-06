
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { SearchHistoryItem, AnalysisType } from "@/types/analysis";
import { useAnalysisHandler } from "../AnalysisHandler";
import { validateAnalysisInputs } from "../utils/analysisValidation";
import { getIntervalInMs } from "../utils/intervalUtils";
import { useSaveAnalysis } from "./useSaveAnalysis";
import { mapToAnalysisType } from "../utils/analysisTypeMapper";

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
            
            // Map the analysis type string to boolean flags 
            const isFibonacciAdvanced = analysisType === "fibonacci_advanced" || analysisType === "تحليل فيبوناتشي متقدم";
            const isFibonacci = analysisType === "fibonacci" || analysisType === "فيبوناتشي";
            const isScalping = analysisType === "scalping" || analysisType === "سكالبينج";
            const isSMC = analysisType === "smc" || analysisType === "نظرية هيكل السوق";
            const isICT = analysisType === "ict" || analysisType === "نظرية السوق";
            const isTurtleSoup = analysisType === "turtle_soup" || analysisType === "الحساء السلحفائي";
            const isGann = analysisType === "gann" || analysisType === "جان";
            const isWaves = analysisType === "waves" || analysisType === "تقلبات";
            const isPatternAnalysis = analysisType === "patterns" || analysisType === "نمطي";
            const isPriceAction = analysisType === "price_action" || analysisType === "حركة السعر";
            const isNeuralNetwork = analysisType === "neural_network" || analysisType === "شبكات عصبية";
            const isRNN = analysisType === "rnn" || analysisType === "شبكات عصبية متكررة";
            const isTimeClustering = analysisType === "time_clustering" || analysisType === "تصفيق زمني";
            const isMultiVariance = analysisType === "multi_variance" || analysisType === "تباين متعدد العوامل";
            const isCompositeCandlestick = analysisType === "composite_candlestick" || analysisType === "شمعات مركبة";
            const isBehavioral = analysisType === "behavioral" || analysisType === "تحليل سلوكي";
            
            console.log("Analysis flags:", {
              isFibonacciAdvanced, isFibonacci, isScalping, isSMC, isICT, isTurtleSoup, isGann, isWaves,
              isPatternAnalysis, isPriceAction, isNeuralNetwork, isRNN, isTimeClustering, isMultiVariance,
              isCompositeCandlestick, isBehavioral
            });
            
            try {
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
                
                // Map the analysis type to correct DB format
                const mappedAnalysisType = mapToAnalysisType(analysisType);
                console.log("Mapped analysis type for saving:", mappedAnalysisType);
                
                await saveAnalysisResult({
                  userId: user.id,
                  symbol,
                  currentPrice,
                  result,
                  analysisType: mappedAnalysisType,
                  timeframe,
                  duration,
                  onAnalysisComplete
                });
              }
            } catch (analysisError) {
              console.error(`Error in ${analysisType} analysis:`, analysisError);
              toast.error(`حدث خطأ أثناء إجراء تحليل ${analysisType}`);
              // Continue with other analyses even if one fails
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
    } else {
      setIsAnalyzing(false);
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
