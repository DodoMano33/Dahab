
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useBestEntryPointResults } from "./hooks/useBestEntryPointResults";
import { BackTestHeader } from "./components/BackTestHeader";
import { BestEntryPointTable } from "./components/BestEntryPointTable";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface BestEntryPointResultsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BestEntryPointResultsDialog = ({
  isOpen,
  onClose,
}: BestEntryPointResultsDialogProps) => {
  const {
    results,
    isLoading,
    hasMore,
    loadMore,
    refresh,
    selectedItems,
    handleSelectItem,
    handleSelectAll,
    handleDeleteSelected,
    isDeleting,
    currentTradingViewPrice,
    totalProfitLoss
  } = useBestEntryPointResults();

  useEffect(() => {
    if (isOpen) {
      refresh();
    }
  }, [isOpen, refresh]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-[1200px] p-0 h-[90vh] flex flex-col" dir="rtl">
        <BackTestHeader
          initialAnalysesCount={results.length}
          onClose={onClose}
          onRefresh={refresh}
          onDeleteSelected={handleDeleteSelected}
          selectedItemsCount={selectedItems.size}
          isDeleting={isDeleting}
          useEntryPoint={true}
          totalProfitLoss={totalProfitLoss}
          currentTradingViewPrice={currentTradingViewPrice}
        />
        
        <div className="flex-1 overflow-auto p-6">
          {isLoading && results.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-gray-500">جاري تحميل النتائج...</div>
            </div>
          ) : results.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="text-gray-500 mb-4">لا توجد نتائج متاحة</div>
              <Button onClick={refresh} variant="outline">تحديث</Button>
            </div>
          ) : (
            <>
              <BestEntryPointTable
                results={results}
                selectedItems={selectedItems}
                onSelectAll={handleSelectAll}
                onSelect={handleSelectItem}
                currentTradingViewPrice={currentTradingViewPrice}
              />
              
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <Button 
                    onClick={loadMore} 
                    variant="outline" 
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري التحميل..." : "تحميل المزيد"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
