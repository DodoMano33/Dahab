import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BackTestHeader } from "./components/BackTestHeader";
import { AnalysisStats } from "./components/AnalysisStats";
import { AnalysisTable } from "./components/AnalysisTable";
import { useBacktestStats } from "./hooks/useBacktestStats";
import { useBacktestResults } from "./hooks/useBacktestResults";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
  const { stats, isLoading: isLoadingStats } = useBacktestStats();
  const {
    results: completedAnalyses,
    isLoading: isLoadingResults,
    hasMore,
    loadMore,
    refresh
  } = useBacktestResults();

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-6xl h-[90vh] flex flex-col p-0">
        <BackTestHeader
          analysesCount={completedAnalyses.length}
          onClose={onClose}
          onRefresh={refresh}
          selectedItemsCount={selectedItems.size}
          isDeleting={false}
          useEntryPoint={useEntryPoint}
        />

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6 space-y-6">
              {!isLoadingStats && <AnalysisStats stats={stats} />}
              
              <div className="overflow-x-auto">
                <div style={{ minWidth: '800px' }}>
                  <AnalysisTable
                    analyses={completedAnalyses}
                    selectedItems={selectedItems}
                    onSelectAll={handleSelectAll}
                    onSelect={handleSelect}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};