
import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BackTestHeader } from "./components/BackTestHeader";
import { useBacktestStats } from "./hooks/useBacktestStats";
import { useBacktestResults } from "./hooks/useBacktestResults";
import { ResultsContent } from "./components/ResultsContent";
import { useBacktestResultsState } from "./hooks/useBacktestResultsState";
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
  const { stats, isLoading: isLoadingStats, refresh: refreshStats } = useBacktestStats();
  const {
    results: completedAnalyses,
    isLoading: isLoadingResults,
    hasMore,
    loadMore,
    refresh: refreshResults,
    totalProfitLoss,
    currentTradingViewPrice
  } = useBacktestResults();

  const {
    selectedItems,
    isDeleting,
    handleSelectAll,
    handleSelect,
    handleDeleteSelected,
    handleRefresh
  } = useBacktestResultsState(completedAnalyses, refreshResults, refreshStats);

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
          currentTradingViewPrice={currentTradingViewPrice}
        />

        <ResultsContent
          completedAnalyses={completedAnalyses}
          stats={stats}
          selectedItems={selectedItems}
          onSelectAll={handleSelectAll}
          onSelect={handleSelect}
          totalProfitLoss={totalProfitLoss}
          currentTradingViewPrice={currentTradingViewPrice}
          hasMore={hasMore}
          isLoadingStats={isLoadingStats}
          isLoadingResults={isLoadingResults}
          loadMore={loadMore}
        />
      </DialogContent>
    </Dialog>
  );
};
