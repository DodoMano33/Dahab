
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SearchHistoryItem } from "@/types/analysis";
import { saveAnalysisToHistory } from "../utils/saveAnalysis";

interface UseAnalysisSubmitProps {
  onAnalysis: (item: SearchHistoryItem) => void;
}

export const useAnalysisSubmit = ({ onAnalysis }: UseAnalysisSubmitProps) => {
  const [currentSymbol, setCurrentSymbol] = useState<string>("");
  const [currentTimeframe, setCurrentTimeframe] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<number>(100); // قيمة افتراضية

  // استمع للأحداث الخارجية مثل تغيرات الرمز والسعر
  useEffect(() => {
    const handleSymbolUpdate = (event: any) => {
      if (event.detail?.symbol) {
        setCurrentSymbol(event.detail.symbol);
      }
    };
    
    const handlePriceUpdate = (event: any) => {
      if (event.detail?.price && !isNaN(event.detail.price)) {
        setCurrentPrice(event.detail.price);
      }
    };

    window.addEventListener("symbol-update", handleSymbolUpdate);
    window.addEventListener("price-update", handlePriceUpdate);
    
    // استخراج السعر من واجهة المستخدم عند التحميل
    const extractInitialPrice = () => {
      try {
        // محاولة العثور على سعر الذهب من عنصر القيمة الرئيسي
        const mainPriceElement = document.querySelector('.tv-symbol-price-quote__value');
        if (mainPriceElement) {
          const priceText = mainPriceElement.textContent || '';
          const price = parseFloat(priceText.replace(',', ''));
          if (!isNaN(price)) {
            setCurrentPrice(price);
            console.log('Initial price set from main UI element:', price);
          }
        }
      } catch (error) {
        console.error('Error extracting initial price:', error);
      }
    };
    
    extractInitialPrice();
    
    // إعادة المحاولة بعد فترة لضمان تحميل الويدجيت
    const retryTimer = setTimeout(extractInitialPrice, 3000);
    
    return () => {
      window.removeEventListener("symbol-update", handleSymbolUpdate);
      window.removeEventListener("price-update", handlePriceUpdate);
      clearTimeout(retryTimer);
    };
  }, []);

  const handleAnalysis = async (
    symbol: string,
    timeframe: string,
    isScalping?: boolean,
    isAI?: boolean,
    isSMC?: boolean,
    isICT?: boolean,
    isTurtleSoup?: boolean,
    isGann?: boolean,
    isWaves?: boolean,
    isPatternAnalysis?: boolean,
    isPriceAction?: boolean,
    isNeuralNetwork?: boolean,
    isRNN?: boolean,
    isTimeClustering?: boolean,
    isMultiVariance?: boolean,
    isCompositeCandlestick?: boolean,
    isBehavioral?: boolean,
    isFibonacci?: boolean,
    isFibonacciAdvanced?: boolean,
    duration?: string
  ) => {
    try {
      setCurrentSymbol(symbol);
      setCurrentTimeframe(timeframe);

      if (!symbol || !timeframe) {
        toast.error("الرجاء إدخال جميع البيانات المطلوبة");
        return;
      }

      // تحميل مكون AnalysisHandler ديناميكيًا
      const { useAnalysisHandler } = await import("../AnalysisHandler");
      const handler = useAnalysisHandler();
      const { handleTradingViewConfig } = handler;

      // إجراء التحليل باستخدام السعر الحالي
      const analysisResult = await handleTradingViewConfig(
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
        duration
      );

      if (analysisResult) {
        console.log("Analysis result received:", analysisResult);
        
        // حفظ التحليل في سجل البحث باستخدام السعر الحالي
        const historyItem = await saveAnalysisToHistory({
          symbol,
          timeframe,
          analysisResult: analysisResult.analysisResult,
          currentPrice: currentPrice, // استخدام السعر الحالي
          analysisType: analysisResult.analysisResult.analysisType || "normal"
        });

        if (historyItem) {
          console.log("Analysis saved to history:", historyItem);
          onAnalysis(historyItem);
        }

        return analysisResult;
      }
    } catch (error) {
      console.error("Error in analysis submit:", error);
      toast.error("فشل في إجراء التحليل");
    }
    
    return null;
  };

  return {
    handleAnalysis,
    currentSymbol,
    currentTimeframe,
    currentPrice
  };
};
