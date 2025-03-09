
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
            // Normalize the analysis type for consistency
            const normalizedType = analysisType.toLowerCase().replace(/\s+/g, '');
            
            const isFibonacciAdvanced = normalizedType.includes("fibonacci_advanced") || 
                                       normalizedType.includes("فيبوناتشيمتقدم");
            const isFibonacci = normalizedType.includes("fibonacci") && !isFibonacciAdvanced;
            const isScalping = normalizedType.includes("scalping") || normalizedType.includes("سكالبينج");
            const isSMC = normalizedType.includes("smc");
            const isICT = normalizedType.includes("ict");
            const isTurtleSoup = normalizedType.includes("turtlesoup") || normalizedType.includes("حساءالسلحفاة");
            const isGann = normalizedType.includes("gann") || normalizedType.includes("جان");
            const isWaves = normalizedType.includes("waves") || normalizedType.includes("موجات");
            const isPatternAnalysis = normalizedType.includes("pattern") || normalizedType.includes("أنماط") || normalizedType.includes("انماط");
            const isPriceAction = normalizedType.includes("priceaction") || normalizedType.includes("حركةالسعر");
            const isNeuralNetwork = normalizedType.includes("neuralnetwork") || normalizedType.includes("شبكاتعصبية");
            const isRNN = normalizedType.includes("rnn");
            const isTimeClustering = normalizedType.includes("timeclustering") || normalizedType.includes("تصفيقزمني");
            const isMultiVariance = normalizedType.includes("multivariance") || normalizedType.includes("تباينمتعدد");
            const isCompositeCandlestick = normalizedType.includes("compositecandlestick") || normalizedType.includes("شمعاتمركبة");
            const isBehavioral = normalizedType.includes("behavioral") || normalizedType.includes("سلوكي");
            
            console.log("Analysis flags:", {
              isFibonacci, 
              isFibonacciAdvanced,
              isScalping,
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
              isBehavioral
            });
            
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
              
              // Always set automatic activation type for auto analysis
              result.analysisResult.activation_type = "تلقائي";
              console.log("Explicitly set activation_type to تلقائي for auto analysis");
              
              await saveAnalysisResult({
                userId: user.id,
                symbol,
                currentPrice,
                result,
                analysisType,
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
