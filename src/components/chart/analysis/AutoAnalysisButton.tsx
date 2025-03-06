
import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";
import { useState, useEffect } from "react";
import { BackTestResultsDialog } from "../backtest/BackTestResultsDialog";
import { supabase } from "@/lib/supabase";
import { HistoryButton } from "./components/HistoryButton";

interface AutoAnalysisButtonProps {
  isAnalyzing: boolean;
  onClick: () => void;
  onBackTestClick?: () => void;
  disabled?: boolean;
  setIsHistoryOpen: (open: boolean) => void;
}

export const AutoAnalysisButton = ({ 
  isAnalyzing, 
  onClick, 
  disabled,
  setIsHistoryOpen
}: AutoAnalysisButtonProps) => {
  const [isBackTestOpen, setIsBackTestOpen] = useState(false);
  const [isEntryPointBackTestOpen, setIsEntryPointBackTestOpen] = useState(false);
  const [backtestCount, setBacktestCount] = useState(0);
  const [searchHistoryCount, setSearchHistoryCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Get backtest results count
        const { count: backtestCount, error: backtestError } = await supabase
          .from('backtest_results')
          .select('*', { count: 'exact', head: true });

        if (backtestError) {
          console.error('Error fetching backtest count:', backtestError);
          return;
        }

        // Get search history count
        const { count: historyCount, error: historyError } = await supabase
          .from('search_history')
          .select('*', { count: 'exact', head: true });

        if (historyError) {
          console.error('Error fetching history count:', historyError);
          return;
        }

        setBacktestCount(backtestCount || 0);
        setSearchHistoryCount(historyCount || 0);

        // Set up realtime subscription for counts
        const channel = supabase
          .channel('counts_changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'backtest_results' },
            () => fetchCounts()
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'search_history' },
            () => fetchCounts()
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('Error in fetchCounts:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <Button 
        onClick={onClick}
        disabled={disabled}
        className={`${
          isAnalyzing ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
        } text-white px-8 py-2 text-lg flex items-center gap-2 h-17 max-w-[600px] w-full`}
      >
        {isAnalyzing ? (
          <>
            <Square className="w-5 h-5" />
            إيقاف التفعيل
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            تفعيل
          </>
        )}
      </Button>

      <div className="grid grid-cols-1 gap-4 mt-4">
        <HistoryButton
          onClick={() => setIsBackTestOpen(true)}
          title="Back Test Results"
          count={backtestCount}
          className="bg-[#800000] hover:bg-[#600000] text-white"
        />

        <HistoryButton
          onClick={() => setIsEntryPointBackTestOpen(true)}
          title={
            <>
              Back Test Results
              <br />
              (أفضل نقطة دخول)
            </>
          }
          count={backtestCount}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        />

        <HistoryButton
          onClick={() => setIsHistoryOpen(true)}
          title="سجل البحث"
          count={searchHistoryCount}
          variant="outline"
        />
      </div>

      <BackTestResultsDialog 
        isOpen={isBackTestOpen}
        onClose={() => setIsBackTestOpen(false)}
      />

      <BackTestResultsDialog 
        isOpen={isEntryPointBackTestOpen}
        onClose={() => setIsEntryPointBackTestOpen(false)}
        useEntryPoint={true}
      />
    </div>
  );
};
