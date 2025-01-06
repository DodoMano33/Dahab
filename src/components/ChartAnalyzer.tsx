import { useState, useEffect } from "react";
import { useAnalysisHandler } from "./chart/analysis/AnalysisHandler";
import { AnalysisForm } from "./chart/analysis/AnalysisForm";
import { HistoryDialog } from "./chart/history/HistoryDialog";
import { SearchHistoryItem } from "@/types/analysis";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { ChartDisplay } from "./ChartDisplay";

export const ChartAnalyzer = () => {
  const { user } = useAuth();
  const {
    isAnalyzing,
    image,
    analysis,
    currentSymbol,
    currentAnalysis,
    handleTradingViewConfig,
    setImage,
    setAnalysis,
    setIsAnalyzing
  } = useAnalysisHandler();

  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSearchHistory();
    } else {
      setSearchHistory([]);
    }
  }, [user]);

  const fetchSearchHistory = async () => {
    try {
      console.log("Fetching search history...");
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching search history:", error);
        throw error;
      }

      console.log("Received search history data:", data);

      const formattedHistory: SearchHistoryItem[] = data.map(item => ({
        id: item.id,
        date: new Date(item.created_at),
        symbol: item.symbol,
        currentPrice: item.current_price,
        analysis: item.analysis,
        analysisType: item.analysis_type,
        timeframe: item.timeframe || '1d'
      }));

      setSearchHistory(formattedHistory);
    } catch (error) {
      console.error("Error fetching search history:", error);
      toast.error("حدث خطأ أثناء جلب سجل البحث");
    }
  };

  const handleDeleteHistoryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSearchHistory(prev => prev.filter(item => item.id !== id));
      toast.success("تم حذف العنصر بنجاح");
    } catch (error) {
      console.error("Error deleting history item:", error);
      toast.error("حدث خطأ أثناء حذف العنصر");
    }
  };

  console.log("ChartAnalyzer - Current Analysis:", analysis);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
        <div>
          <AnalysisForm
            onAnalysis={(item) => setSearchHistory(prev => [item, ...prev])}
            isAnalyzing={isAnalyzing}
            onHistoryClick={() => setIsHistoryOpen(true)}
            currentAnalysis={currentAnalysis}
          />
        </div>
        {(image || analysis || isAnalyzing) && (
          <div>
            <ChartDisplay
              image={image}
              analysis={analysis}
              isAnalyzing={isAnalyzing}
              onClose={() => {
                setImage(null);
                setAnalysis(null);
              }}
              symbol={currentSymbol}
              currentAnalysis={currentAnalysis}
            />
          </div>
        )}
      </div>
      <HistoryDialog
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={searchHistory}
        onDelete={handleDeleteHistoryItem}
      />
    </div>
  );
};