import { useState, useEffect } from "react";
import { AnalysisData } from "@/types/analysis";
import { useAnalysisProcessing } from "./hooks/useAnalysisProcessing";
import { useTradingViewPrice } from "./hooks/useTradingViewPrice";
import { useSymbolState } from "./hooks/useSymbolState";
import { useAnalysisState } from "./hooks/useAnalysisState";
import { validateAnalysisInput } from "./utils/processors/inputValidator";

export const useAnalysisHandler = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  
  const { currentSymbol, setCurrentSymbol } = useSymbolState();
  const { currentAnalysis, setCurrentAnalysis } = useAnalysisState();
  const { tradingViewPrice, setupTradingViewPriceListener } = useTradingViewPrice();
  const { processAnalysis } = useAnalysisProcessing(setIsAnalyzing, setAnalysis);

  // Setup the price listener when component mounts
  useEffect(() => {
    return setupTradingViewPriceListener();
  }, [setupTradingViewPriceListener]);

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
      // Use the price from TradingView if available, otherwise use the provided price
      const finalPrice = tradingViewPrice !== null ? tradingViewPrice : providedPrice;
      const upperSymbol = symbol.toUpperCase();
      
      // Validate analysis inputs
      const analysisInput = {
        symbol: upperSymbol,
        timeframe,
        providedPrice: finalPrice as number,
        analysisType: determineAnalysisType(
          isScalping, isAI, isSMC, isICT, isTurtleSoup, isGann, isWaves,
          isPatternAnalysis, isPriceAction, isNeuralNetwork, isRNN,
          isTimeClustering, isMultiVariance, isCompositeCandlestick,
          isBehavioral, isFibonacci, isFibonacciAdvanced
        ),
        selectedTypes: selectedTypes || [],
        isAI, isSMC, isICT, isTurtleSoup, isGann, isWaves,
        isPatternAnalysis, isPriceAction, isNeuralNetwork, isRNN,
        isTimeClustering, isMultiVariance, isCompositeCandlestick,
        isBehavioral, isFibonacci, isFibonacciAdvanced,
        duration
      };
      
      if (!validateAnalysisInput(analysisInput)) {
        return;
      }
      
      setIsAnalyzing(true);
      setCurrentSymbol(upperSymbol);
      setCurrentAnalysis(analysisInput.analysisType);
      
      // Get or generate chart image
      const chartImage = await getChartImage(image, upperSymbol, timeframe, finalPrice as number);
      setImage(chartImage);
      
      // Process the analysis with all inputs
      const result = await processAnalysis({
        ...analysisInput,
        chartImage
      });
      
      setIsAnalyzing(false);
      return result;
    } catch (error) {
      console.error("Error in TradingView analysis:", error);
      setIsAnalyzing(false);
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
    setIsAnalyzing,
    tradingViewPrice
  };
};

// Export helper functions to keep the main hook smaller
export { determineAnalysisType } from "./utils/analysisConfigBuilder";
export { getChartImage } from "./utils/chartImageHelper";
