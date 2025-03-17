
import { useState } from "react";
import { AnalysisData } from "@/types/analysis";
import { validateAnalysisInputs } from "./utils/inputValidation";
import { buildAnalysisConfig } from "./utils/analysisConfigBuilder";
import { processChartAnalysis } from "./utils/chartAnalysisProcessor";
import { showErrorToast } from "./utils/toastUtils";

export const useAnalysisHandler = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [currentSymbol, setCurrentSymbol] = useState<string>('');
  const [currentAnalysis, setCurrentAnalysis] = useState<string>('');

  const handleTradingViewConfig = async (
    symbol: string, 
    timeframe: string, 
    isScalping: boolean = false,
    isAI: boolean = false,
    isSMC: boolean = false,
    isICT: boolean = false,
    isTurtleSoup: boolean = false,
    isGann: boolean = false,
    isWaves: boolean = false,
    isPatternAnalysis: boolean = false,
    isPriceAction: boolean = false,
    isNeuralNetwork: boolean = false,
    isRNN: boolean = false,
    isTimeClustering: boolean = false,
    isMultiVariance: boolean = false,
    isCompositeCandlestick: boolean = false,
    isBehavioral: boolean = false,
    isFibonacci: boolean = false,
    isFibonacciAdvanced: boolean = false,
    duration?: string
  ) => {
    try {
      console.log("Starting analysis with parameters:", {
        symbol,
        timeframe,
        isScalping,
        isAI,
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
        isFibonacciAdvanced,
        duration,
      });

      // Validate inputs (بدون التحقق من صحة السعر)
      if (!validateAnalysisInputs(symbol, timeframe)) {
        return;
      }

      setIsAnalyzing(true);
      const upperSymbol = symbol.toUpperCase();
      setCurrentSymbol(upperSymbol);
      
      // Build configuration
      const { analysisType, options } = buildAnalysisConfig(
        isScalping,
        isAI,
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
      
      setCurrentAnalysis(analysisType);
      
      // Process the chart analysis (بدون الاعتماد على بيانات السعر)
      const result = await processChartAnalysis({
        symbol: upperSymbol,
        timeframe,
        analysisType,
        selectedTypes: [],
        isAI,
        options,
        duration
      });
      
      // Store the image and analysis result
      setImage(result ? "placeholder-image.png" : null);
      setAnalysis(result ? result.analysisResult : null);
      setIsAnalyzing(false);
      
      return result;
    } catch (error) {
      console.error("Error in TradingView analysis:", error);
      setIsAnalyzing(false);
      showErrorToast(error);
      throw error;
    }
  };

  return {
    isAnalyzing,
    image,
    analysis,
    currentSymbol,
    currentAnalysis,
    handleTradingViewConfig,
    setImage,
    setAnalysis,
    setIsAnalyzing
  };
};
