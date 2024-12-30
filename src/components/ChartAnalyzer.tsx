import { useState } from "react";
import { ChartInput } from "./chart/ChartInput";
import { ChartDisplay } from "./chart/ChartDisplay";
import { SearchHistory } from "./chart/SearchHistory";
import { useAnalysisHandler } from "./chart/analysis/AnalysisHandler";
import { AnalysisData } from "@/types/analysis";
import { toast } from "sonner";

type SearchHistoryItem = {
  date: Date;
  symbol: string;
  currentPrice: number;
  analysis: AnalysisData;
  targetHit?: boolean;
  stopLossHit?: boolean;
  analysisType: "عادي" | "سكالبينج" | "ذكي" | "SMC";
};

export const ChartAnalyzer = () => {
  const {
    isAnalyzing,
    image,
    analysis,
    currentSymbol,
    handleTradingViewConfig,
    setImage,
    setAnalysis,
    setIsAnalyzing
  } = useAnalysisHandler();

  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleAnalysis = async (
    symbol: string, 
    timeframe: string, 
    providedPrice?: number, 
    isScalping?: boolean,
    isAI?: boolean,
    isSMC?: boolean
  ) => {
    try {
      if (isAI) {
        toast.info("جاري تحليل البيانات باستخدام الذكاء الاصطناعي...");
      } else if (isSMC) {
        toast.info("جاري تحليل البيانات باستخدام نموذج SMC...");
      }

      const result = await handleTradingViewConfig(symbol, timeframe, providedPrice, isScalping, isAI, isSMC);
      
      if (result) {
        const { analysisResult, currentPrice, symbol: upperSymbol } = result;
        
        const newHistoryEntry: SearchHistoryItem = {
          date: new Date(),
          symbol: upperSymbol,
          currentPrice,
          analysis: analysisResult,
          targetHit: false,
          stopLossHit: false,
          analysisType: isSMC ? "SMC" : isAI ? "ذكي" : timeframe === "5" ? "سكالبينج" : "عادي"
        };

        setSearchHistory(prev => [newHistoryEntry, ...prev]);
        console.log("تم تحديث سجل البحث:", newHistoryEntry);

        if (isAI) {
          toast.success("تم إكمال التحليل الذكي بنجاح");
        } else if (isSMC) {
          toast.success("تم إكمال تحليل SMC بنجاح");
        }
      }
    } catch (error) {
      console.error("خطأ في التحليل:", error);
      toast.error(isAI ? "حدث خطأ أثناء التحليل الذكي" : "حدث خطأ أثناء التحليل");
    }
  };

  const handleShowHistory = () => {
    setIsHistoryOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ChartInput
          mode="tradingview"
          onTradingViewConfig={handleAnalysis}
          onHistoryClick={handleShowHistory}
          isAnalyzing={isAnalyzing}
        />
        <ChartDisplay
          image={image}
          analysis={analysis}
          isAnalyzing={isAnalyzing}
          onClose={() => {
            setImage(null);
            setAnalysis(null);
            setIsAnalyzing(false);
          }}
          symbol={currentSymbol}
        />
      </div>
      <SearchHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={searchHistory}
      />
    </div>
  );
};