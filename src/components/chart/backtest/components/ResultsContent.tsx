
import React from "react";
import { AnalysisStats } from "./AnalysisStats";
import { AnalysisTable } from "./AnalysisTable";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResultsContentProps {
  completedAnalyses: any[];
  stats: any[];
  selectedItems: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelect: (id: string) => void;
  totalProfitLoss: number;
  currentTradingViewPrice: number | null;
  hasMore: boolean;
  isLoadingStats: boolean;
  isLoadingResults: boolean;
  loadMore: () => void;
}

export const ResultsContent: React.FC<ResultsContentProps> = ({
  completedAnalyses,
  stats,
  selectedItems,
  onSelectAll,
  onSelect,
  totalProfitLoss,
  currentTradingViewPrice,
  hasMore,
  isLoadingStats,
  isLoadingResults,
  loadMore
}) => {
  const isMobile = useIsMobile();

  return (
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
          
          <div className={`overflow-x-auto ${isMobile ? 'touch-pan-x' : ''}`}>
            <div className={isMobile ? 'min-w-[800px]' : ''}>
              <AnalysisTable
                analyses={completedAnalyses}
                selectedItems={selectedItems}
                onSelectAll={onSelectAll}
                onSelect={onSelect}
                totalProfitLoss={totalProfitLoss}
                currentTradingViewPrice={currentTradingViewPrice}
              />
            </div>
            
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
  );
};
