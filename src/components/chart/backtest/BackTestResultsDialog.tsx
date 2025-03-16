
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BackTestHeader } from "./components/BackTestHeader";
import { AnalysisStats } from "./components/AnalysisStats";
import { AnalysisTable } from "./components/AnalysisTable";
import { useBacktestStats } from "./hooks/useBacktestStats";
import { useBacktestResults } from "./hooks/useBacktestResults";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { CurrentPriceListener } from "./components/table/CurrentPriceListener";

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
    if (isOpen) {
      // عند فتح النافذة، نقوم بإعادة تعيين العناصر المحددة
      setSelectedItems(new Set());
      
      // طلب تحديث السعر
      window.dispatchEvent(new Event('request-current-price'));
      window.dispatchEvent(new Event('request-extracted-price'));
      window.dispatchEvent(new Event('request-ui-price-update'));
    }
  }, [isOpen]);

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
    
    // إرسال طلب تحديث السعر
    window.dispatchEvent(new Event('request-current-price'));
    window.dispatchEvent(new Event('request-extracted-price'));
    window.dispatchEvent(new Event('request-ui-price-update'));
    
    await refreshResults();
    await refreshStats();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[98vw] md:max-w-7xl h-[90vh] flex flex-col p-0 overflow-hidden">
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
            <div className="p-2 space-y-4">
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
              
              <div className="overflow-visible">
                <CurrentPriceListener>
                  {(currentPrice) => (
                    <AnalysisTable
                      analyses={completedAnalyses.map(analysis => ({
                        ...analysis,
                        current_price: currentPrice || analysis.current_price
                      }))}
                      selectedItems={selectedItems}
                      onSelectAll={handleSelectAll}
                      onSelect={handleSelect}
                      totalProfitLoss={totalProfitLoss}
                    />
                  )}
                </CurrentPriceListener>
                
                {hasMore && (
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={loadMore}
                      disabled={isLoadingResults}
                      variant="outline"
                      size="sm"
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
