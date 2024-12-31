import { useState } from "react";
import { ChartInput } from "./chart/ChartInput";
import { ChartDisplay } from "./chart/ChartDisplay";
import { SearchHistory } from "./chart/SearchHistory";
import { useAnalysisHandler } from "./chart/analysis/AnalysisHandler";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchHistory } from "./chart/hooks/useSearchHistory";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const ChartAnalyzer = () => {
  const { user } = useAuth();
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

  const {
    searchHistory,
    setSearchHistory,
    deleteHistoryItem
  } = useSearchHistory(user);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleAnalysis = async (
    symbol: string, 
    timeframe: string, 
    providedPrice?: number, 
    isScalping?: boolean,
    isAI?: boolean,
    isSMC?: boolean,
    isICT?: boolean,
    isTurtleSoup?: boolean
  ) => {
    try {
      if (!user) {
        toast.error("يرجى تسجيل الدخول لحفظ نتائج التحليل");
        return;
      }

      if (isAI) {
        toast.info("جاري تحليل البيانات باستخدام الذكاء الاصطناعي...");
      } else if (isSMC) {
        toast.info("جاري تحليل البيانات باستخدام نموذج SMC...");
      } else if (isICT) {
        toast.info("جاري تحليل البيانات باستخدام نموذج ICT...");
      } else if (isTurtleSoup) {
        toast.info("جاري تحليل البيانات باستخدام نموذج Turtle Soup...");
      }

      const result = await handleTradingViewConfig(
        symbol, 
        timeframe, 
        providedPrice, 
        isScalping, 
        isAI, 
        isSMC, 
        isICT,
        isTurtleSoup
      );
      
      if (result) {
        const { analysisResult, currentPrice, symbol: upperSymbol } = result;
        
        let analysisType: "عادي" | "سكالبينج" | "ذكي" | "SMC" | "ICT" | "Turtle Soup";
        
        if (isTurtleSoup) {
          analysisType = "Turtle Soup";
        } else if (isICT) {
          analysisType = "ICT";
        } else if (isSMC) {
          analysisType = "SMC";
        } else if (isAI) {
          analysisType = "ذكي";
        } else if (isScalping) {
          analysisType = "سكالبينج";
        } else {
          analysisType = "عادي";
        }

        console.log("Saving analysis with type:", analysisType);
        
        const { data, error: saveError } = await supabase
          .from('search_history')
          .insert({
            user_id: user.id,
            symbol: upperSymbol,
            current_price: currentPrice,
            analysis: analysisResult,
            analysis_type: analysisType
          })
          .select()
          .single();

        if (saveError) {
          console.error("Error saving to Supabase:", saveError);
          throw saveError;
        }

        console.log("Successfully saved to Supabase:", data);

        const newHistoryEntry = {
          id: data.id,
          date: new Date(),
          symbol: upperSymbol,
          currentPrice,
          analysis: analysisResult,
          targetHit: false,
          stopLossHit: false,
          analysisType
        };

        setSearchHistory(prev => [newHistoryEntry, ...prev]);
        console.log("Updated search history:", newHistoryEntry);

        showSuccessMessage(isAI, isSMC, isICT, isTurtleSoup);
      }
    } catch (error) {
      console.error("خطأ في التحليل:", error);
      toast.error("حدث خطأ أثناء التحليل");
    }
  };

  const showSuccessMessage = (isAI: boolean, isSMC: boolean, isICT: boolean, isTurtleSoup: boolean) => {
    if (isAI) {
      toast.success("تم إكمال التحليل الذكي بنجاح");
    } else if (isSMC) {
      toast.success("تم إكمال تحليل SMC بنجاح");
    } else if (isICT) {
      toast.success("تم إكمال تحليل ICT بنجاح");
    } else if (isTurtleSoup) {
      toast.success("تم إكمال تحليل Turtle Soup بنجاح");
    }
  };

  const handleShowHistory = () => {
    if (!user) {
      toast.error("يرجى تسجيل الدخول لعرض سجل البحث");
      return;
    }
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
        onDelete={deleteHistoryItem}
      />
    </div>
  );
};
