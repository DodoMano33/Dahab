
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

  // استمع للأحداث الخارجية مثل تغيرات الرمز
  useEffect(() => {
    const handleSymbolUpdate = (event: any) => {
      if (event.detail?.symbol) {
        setCurrentSymbol(event.detail.symbol);
      }
    };

    window.addEventListener("symbol-update", handleSymbolUpdate);
    return () => {
      window.removeEventListener("symbol-update", handleSymbolUpdate);
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
      const { handleTradingViewConfig } = useAnalysisHandler();

      // إجراء التحليل باستخدام قيمة ثابتة بدل السعر
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
        
        // حفظ التحليل في سجل البحث
        const historyItem = await saveAnalysisToHistory({
          symbol,
          timeframe,
          analysisResult: analysisResult.analysisResult,
          currentPrice: 100, // قيمة ثابتة بدل السعر الحقيقي
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
    currentTimeframe
  };
};
