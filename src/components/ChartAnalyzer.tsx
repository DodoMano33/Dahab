import { useState, useEffect } from "react";
import { ChartInput } from "./chart/ChartInput";
import { ChartDisplay } from "./chart/ChartDisplay";
import { SearchHistory } from "./chart/SearchHistory";
import { useAnalysisHandler } from "./chart/analysis/AnalysisHandler";
import { AnalysisData } from "@/types/analysis";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

type SearchHistoryItem = {
  date: Date;
  symbol: string;
  currentPrice: number;
  analysis: AnalysisData;
  targetHit?: boolean;
  stopLossHit?: boolean;
  analysisType: "عادي" | "سكالبينج" | "ذكي" | "SMC" | "ICT";
};

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

  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Fetch search history when user logs in
  useEffect(() => {
    if (user) {
      fetchSearchHistory();
    } else {
      setSearchHistory([]);
    }
  }, [user]);

  const fetchSearchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedHistory: SearchHistoryItem[] = data.map(item => ({
        date: new Date(item.created_at),
        symbol: item.symbol,
        currentPrice: item.current_price,
        analysis: item.analysis,
        analysisType: item.analysis_type
      }));

      setSearchHistory(formattedHistory);
    } catch (error) {
      console.error("Error fetching search history:", error);
      toast.error("حدث خطأ أثناء جلب سجل البحث");
    }
  };

  const handleAnalysis = async (
    symbol: string, 
    timeframe: string, 
    providedPrice?: number, 
    isScalping?: boolean,
    isAI?: boolean,
    isSMC?: boolean,
    isICT?: boolean
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
      }

      const result = await handleTradingViewConfig(symbol, timeframe, providedPrice, isScalping, isAI, isSMC, isICT);
      
      if (result) {
        const { analysisResult, currentPrice, symbol: upperSymbol } = result;
        
        const analysisType = isICT ? "ICT" : isSMC ? "SMC" : isAI ? "ذكي" : timeframe === "5" ? "سكالبينج" : "عادي";
        
        // Save to Supabase
        const { error: saveError } = await supabase
          .from('search_history')
          .insert({
            user_id: user.id,
            symbol: upperSymbol,
            current_price: currentPrice,
            analysis: analysisResult,
            analysis_type: analysisType
          });

        if (saveError) throw saveError;

        // Update local state
        const newHistoryEntry: SearchHistoryItem = {
          date: new Date(),
          symbol: upperSymbol,
          currentPrice,
          analysis: analysisResult,
          targetHit: false,
          stopLossHit: false,
          analysisType
        };

        setSearchHistory(prev => [newHistoryEntry, ...prev]);
        console.log("تم تحديث سجل البحث:", newHistoryEntry);

        if (isAI) {
          toast.success("تم إكمال التحليل الذكي بنجاح");
        } else if (isSMC) {
          toast.success("تم إكمال تحليل SMC بنجاح");
        } else if (isICT) {
          toast.success("تم إكمال تحليل ICT بنجاح");
        }
      }
    } catch (error) {
      console.error("خطأ في التحليل:", error);
      toast.error(isAI ? "حدث خطأ أثناء التحليل الذكي" : "حدث خطأ أثناء التحليل");
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
      />
    </div>
  );
};