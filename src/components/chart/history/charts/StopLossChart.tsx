
import { SearchHistoryItem } from "@/types/analysis";
import { AnalysisChart } from "../../charting/AnalysisChart";
import { useMemo } from "react";
import { formatChartLabels } from "../../charting/chartUtils";

interface StopLossChartProps {
  searchHistory: SearchHistoryItem[];
}

export const StopLossChart = ({ searchHistory }: StopLossChartProps) => {
  const { labels, dataPoints, currentPrice } = useMemo(() => {
    const filteredHistory = searchHistory.filter(item => 
      typeof item.analysis.stopLoss === 'number' && !isNaN(item.analysis.stopLoss)
    );

    const chartLabels = formatChartLabels(filteredHistory);
    const stopLossPrices = filteredHistory.map(item => item.analysis.stopLoss);
    
    // Use the most recent price from any of the analyses
    const latestPrice = filteredHistory.length > 0 
      ? filteredHistory[filteredHistory.length - 1].currentPrice 
      : null;

    return {
      labels: chartLabels,
      dataPoints: stopLossPrices,
      currentPrice: latestPrice
    };
  }, [searchHistory]);

  if (labels.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        لا توجد نقاط وقف خسارة في التحليلات النشطة
      </div>
    );
  }

  return (
    <AnalysisChart
      labels={labels}
      dataPoints={dataPoints}
      currentPrice={currentPrice}
      isTargets={false}
    />
  );
};
