
import { SearchHistoryItem } from "@/types/analysis";
import { AnalysisChart } from "../../charting/AnalysisChart";
import { useMemo } from "react";
import { formatChartLabels } from "../../charting/chartUtils";

interface TargetsChartProps {
  searchHistory: SearchHistoryItem[];
}

export const TargetsChart = ({ searchHistory }: TargetsChartProps) => {
  const { labels, dataPoints, currentPrice } = useMemo(() => {
    const filteredHistory = searchHistory.filter(item => 
      item.analysis.targets && 
      item.analysis.targets.length > 0 && 
      item.analysis.targets[0].price
    );

    const chartLabels = formatChartLabels(filteredHistory);
    const targetPrices = filteredHistory.map(item => 
      item.analysis.targets && item.analysis.targets.length > 0 
        ? item.analysis.targets[0].price 
        : 0
    );
    
    // Use the most recent price from any of the analyses
    const latestPrice = filteredHistory.length > 0 
      ? filteredHistory[filteredHistory.length - 1].currentPrice 
      : null;

    return {
      labels: chartLabels,
      dataPoints: targetPrices,
      currentPrice: latestPrice
    };
  }, [searchHistory]);

  if (labels.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        لا توجد أهداف سعرية في التحليلات النشطة
      </div>
    );
  }

  return (
    <AnalysisChart
      labels={labels}
      dataPoints={dataPoints}
      currentPrice={currentPrice}
      isTargets={true}
    />
  );
};
