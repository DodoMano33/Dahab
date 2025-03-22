
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
    // فحص أنواع التحليل ومعالجتها عند تحميل النتائج
    if (completedAnalyses.length > 0) {
      // جمع أنواع التحليل الفريدة للتحقق
      const uniqueTypes = [...new Set(completedAnalyses.map(a => a.analysis_type))];
      console.log("BackTestResultsDialog: Unique analysis types:", uniqueTypes);
      
      // التأكد من توحيد أنواع التحليل
      const normalizedTypes = uniqueTypes.map(type => ({
        original: type,
        normalized: getStrategyName(type)
      }));
      
      console.log("BackTestResultsDialog: Normalized analysis types:", normalizedTypes);
    }
    
    // فحص أنواع الإحصائيات ومعالجتها عند تحميل الإحصائيات
    if (stats.length > 0) {
      console.log("BackTestResultsDialog: Stats types:", 
        stats.map(s => ({
          type: s.type,
          display: getStrategyName(s.type),
          displayFromStat: s.display_name
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
