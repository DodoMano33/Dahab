
import { useState, useEffect } from "react";
import { AnalysisData } from "@/types/analysis";
import { validateAnalysisInputs } from "./utils/inputValidation";
import { buildAnalysisConfig } from "./utils/analysisConfigBuilder";
import { processChartAnalysis } from "./utils/chartAnalysisProcessor";
import { showErrorToast } from "./utils/toastUtils";
import { getTradingViewChartImage } from "@/utils/tradingViewUtils";
import { usePriceReader } from "@/hooks/usePriceReader";

export const useAnalysisHandler = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [currentSymbol, setCurrentSymbol] = useState<string>('');
  const [currentAnalysis, setCurrentAnalysis] = useState<string>('');
  const [tradingViewPrice, setTradingViewPrice] = useState<number | null>(null);
  const { price: screenPrice } = usePriceReader(1000);

  // استمع لتحديثات السعر من TradingView
  useEffect(() => {
    const handleTradingViewPriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        setTradingViewPrice(event.detail.price);
        console.log("AnalysisHandler received TradingView price update:", event.detail.price);
      }
    };

    window.addEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    return () => {
      window.removeEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    };
  }, []);

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
        tradingViewPrice,
        screenPrice,
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

      // استخدام السعر بترتيب: السعر من قارئ الشاشة، ثم السعر من TradingView، ثم السعر المقدم
      const finalPrice = screenPrice !== null ? screenPrice : 
                        tradingViewPrice !== null ? tradingViewPrice : 
                        providedPrice;

      // Validate inputs
      if (!validateAnalysisInputs(symbol, timeframe, finalPrice)) {
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
        providedPrice: finalPrice as number,
        analysisType,
        // Use the provided selectedTypes if available, otherwise build them from the flags
        selectedTypes: selectedTypes || [],
        isAI,
        options,
        duration
      });
      
      // Store the image and analysis result
      setImage(result ? await getTradingViewChartImage(upperSymbol, timeframe, finalPrice as number) : null);
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
    setIsAnalyzing,
    tradingViewPrice: screenPrice !== null ? screenPrice : tradingViewPrice
  };
};
