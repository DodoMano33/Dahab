
import { useState } from "react";
import { AnalysisData, AnalysisType } from "@/types/analysis";
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
    providedPrice?: number,
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
    duration?: string,
    selectedTypes?: string[]
  ) => {
    try {
      console.log("Starting analysis with parameters:", {
        symbol,
        timeframe,
        providedPrice,
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
        selectedTypes
      });

      // Validate inputs
      if (!validateAnalysisInputs(symbol, timeframe, providedPrice)) {
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
      
      // Process the chart analysis
      const result = await processChartAnalysis({
        symbol: upperSymbol,
        timeframe,
        providedPrice: providedPrice as number,
        analysisType,
        // Use the provided selectedTypes if available, otherwise build them from the flags
        selectedTypes: selectedTypes || [],
        isAI,
        options,
        duration
      });
      
      // Ensure the analysis type is set correctly in the result
      if (result && result.analysisResult) {
        if (isFibonacci) {
          result.analysisResult.analysisType = "fibonacci" as AnalysisType;
        } else if (isFibonacciAdvanced) {
          result.analysisResult.analysisType = "fibonacci_advanced" as AnalysisType;
        }
      }
      
      // Store the image and analysis result
      setImage(result ? await getTradingViewChartImage(upperSymbol, timeframe, providedPrice as number) : null);
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

// Add this import at the top, it was missing in the updated code
import { getTradingViewChartImage } from "@/utils/tradingViewUtils";
