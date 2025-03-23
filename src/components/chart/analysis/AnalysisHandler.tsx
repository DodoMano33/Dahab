
import { useState, useEffect } from "react";
import { AnalysisData } from "@/types/analysis";
import { validateAnalysisInputs } from "./utils/inputValidation";
import { buildAnalysisConfig } from "./utils/analysisConfigBuilder";
import { processChartAnalysis } from "./utils/chartAnalysisProcessor";
import { showErrorToast } from "./utils/toastUtils";
import { getTradingViewChartImage } from "@/utils/tradingViewUtils";
import { toast } from "sonner";

export const useAnalysisHandler = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [currentSymbol, setCurrentSymbol] = useState<string>('');
  const [currentAnalysis, setCurrentAnalysis] = useState<string>('');
  const [tradingViewPrice, setTradingViewPrice] = useState<number | null>(null);

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

      // استخدام السعر من TradingView إذا كان متاحًا، وإلا استخدام السعر المقدم
      const finalPrice = tradingViewPrice !== null ? tradingViewPrice : providedPrice;

      // Validate inputs
      if (!validateAnalysisInputs(symbol, timeframe, finalPrice)) {
        return;
      }

      // التحقق من صحة مدة التحليل
      const durationHours = duration ? parseInt(duration) : 8;
      console.log("Validating duration hours:", durationHours, "from input:", duration);
      
      if (isNaN(durationHours) || durationHours < 1 || durationHours > 72) {
        showErrorToast(new Error("مدة التحليل يجب أن تكون بين 1 و 72 ساعة"));
        return;
      }

      setIsAnalyzing(true);
      const upperSymbol = symbol.toUpperCase();
      setCurrentSymbol(upperSymbol);
      
      // Build configuration
      const { analysisType } = buildAnalysisConfig(
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
      
      let chartImage = image;
      
      // إذا لم تكن صورة الشارت محملة بالفعل، إنشاء صورة
      if (!chartImage) {
        try {
          // إنشاء صورة من TradingView للتحليل
          chartImage = await getTradingViewChartImage(upperSymbol, timeframe, finalPrice as number);
          setImage(chartImage);
          console.log("تم إنشاء صورة الشارت تلقائياً");
        } catch (error) {
          console.error("فشل في إنشاء صورة الشارت:", error);
          toast.warning("جاري التحليل بدون صورة الشارت. قد تكون النتائج أقل دقة.");
          // إنشاء صورة افتراضية للشارت
          chartImage = `data:image/svg+xml;base64,${btoa(`
            <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="#f5f5f5"/>
              <text x="50%" y="50%" font-family="Arial" font-size="20" text-anchor="middle" fill="#666">
                تحليل ${upperSymbol} على الإطار الزمني ${timeframe}
              </text>
            </svg>
          `)}`;
          setImage(chartImage);
        }
      }
      
      // استدعاء معالج التحليل
      const result = await processChartAnalysis({
        symbol: upperSymbol,
        timeframe,
        providedPrice: finalPrice as number,
        analysisType,
        selectedTypes: selectedTypes || [],
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
        chartImage
      });
      
      console.log("Analysis result returned with duration:", result.duration);
      
      // تخزين نتيجة التحليل
      if (result && result.analysisResult) {
        setAnalysis(result.analysisResult);
      }
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
    tradingViewPrice
  };
};
