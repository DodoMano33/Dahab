import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BackTestHeader } from "./components/BackTestHeader";
import { AnalysisStats } from "./components/AnalysisStats";
import { AnalysisTable } from "./components/AnalysisTable";
import { useBacktestStats } from "./hooks/useBacktestStats";
import { useBacktestResults } from "./hooks/useBacktestResults";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";

interface BackTestResultsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  useEntryPoint?: boolean;
}

export const BackTestResultsDialog = ({
  isOpen,
  onClose,
  useEntryPoint = false
}: BackTestResultsDialogProps) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const { stats, isLoading: isLoadingStats, refresh: refreshStats } = useBacktestStats();
  const {
    results: completedAnalyses,
    isLoading: isLoadingResults,
    hasMore,
    loadMore,
    refresh: refreshResults,
    totalProfitLoss
  } = useBacktestResults();

  useEffect(() => {
    if (completedAnalyses.length > 0) {
      console.log("BackTestResultsDialog: Loaded analysis types:", 
        completedAnalyses.slice(0, 20).map(a => a.analysis_type));
      
      console.log("BackTestResultsDialog: Unique analysis types:", 
        [...new Set(completedAnalyses.map(a => a.analysis_type))]);
        
      console.log("BackTestResultsDialog: Analysis types with display names:", 
        completedAnalyses.slice(0, 20).map(a => ({
          id: a.id,
          type: a.analysis_type,
          display: getStrategyName(a.analysis_type)
        })));
    }
    
    if (stats.length > 0) {
      console.log("BackTestResultsDialog: Loaded stats types:", 
        stats.map(s => s.type));
      
      console.log("BackTestResultsDialog: Unique stats types:", 
        [...new Set(stats.map(s => s.type))]);
      
      console.log("BackTestResultsDialog: Stats types with display names:", 
        stats.map(s => ({
          type: s.type,
          display: getStrategyName(s.type),
          displayFromStat: s.display_name,
          success: s.success,
          fail: s.fail
        })));
    }
  }, [completedAnalyses, stats]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = completedAnalyses.map(analysis => analysis.id);
      setSelectedItems(new Set(allIds));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) {
      toast.error("الرجاء تحديد عناصر للحذف", { duration: 500 });
      return;
    }

    try {
      setIsDeleting(true);
      const selectedArray = Array.from(selectedItems);
      
      const { error } = await supabase
        .from('backtest_results')
        .delete()
        .in('id', selectedArray);

      if (error) {
        throw error;
      }

      toast.success("تم حذف العناصر المحددة بنجاح", { duration: 500 });
      setSelectedItems(new Set());
      await refreshResults();
      await refreshStats();
    } catch (error) {
      console.error('Error deleting items:', error);
      toast.error("حدث خطأ أثناء حذف العناصر", { duration: 500 });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = async () => {
    console.log("Refreshing backtest results and stats...");
    await refreshResults();
    await refreshStats();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[98vw] md:max-w-7xl h-[90vh] flex flex-col p-0">
        <BackTestHeader
          initialAnalysesCount={completedAnalyses.length}
          onClose={onClose}
          onRefresh={handleRefresh}
          onDeleteSelected={handleDeleteSelected}
          selectedItemsCount={selectedItems.size}
          isDeleting={isDeleting}
          useEntryPoint={useEntryPoint}
          totalProfitLoss={totalProfitLoss}
        />

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-4 space-y-4">
              {!isLoadingStats && (
                <>
                  <AnalysisStats stats={stats} />
                  {stats.length === 0 && !isLoadingStats && (
                    <div className="text-center p-4 bg-muted rounded-lg">
                      لا توجد إحصائيات لعرضها. قم بإجراء بعض التحليلات أولاً.
                    </div>
                  )}
                </>
              )}
              
              <div className="overflow-x-auto">
                <AnalysisTable
                  analyses={completedAnalyses}
                  selectedItems={selectedItems}
                  onSelectAll={handleSelectAll}
                  onSelect={handleSelect}
                  totalProfitLoss={totalProfitLoss}
                />
                
                {hasMore && (
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={loadMore}
                      disabled={isLoadingResults}
                      variant="outline"
                    >
                      {isLoadingResults ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          جاري التحميل...
                        </>
                      ) : (
                        'تحميل المزيد'
                      )}
                    </Button>
                  </div>
                )}
                
                {completedAnalyses.length === 0 && !isLoadingResults && (
                  <div className="text-center p-4 bg-muted rounded-lg mt-4">
                    لا توجد نتائج باك تست لعرضها.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

