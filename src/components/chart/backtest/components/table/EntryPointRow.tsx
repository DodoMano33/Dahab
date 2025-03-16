
import { Checkbox } from "@/components/ui/checkbox";
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";
import { formatDateArabic } from "@/utils/technicalAnalysis/timeUtils";

interface EntryPointRowProps {
  result: any;
  selected: boolean;
  onSelect: (id: string) => void;
  currentPrice: number | null;
}

export const EntryPointRow = ({
  result,
  selected,
  onSelect,
  currentPrice
}: EntryPointRowProps) => {
  // دالة لتنسيق الأرقام
  const formatNumber = (value: number | string | null | undefined) => {
    if (value === null || value === undefined) return "-";
    const num = typeof value === "string" ? parseFloat(value) : value;
    return Number(num).toFixed(3);
  };

  // دالة لحساب الربح/الخسارة
  const calculateProfitLoss = () => {
    if (!result.entry_point_price || !result.exit_price) return "-";
    
    const entryPrice = parseFloat(result.entry_point_price);
    const exitPrice = parseFloat(result.exit_price);
    let profitLoss = 0;
    
    if (result.direction === 'صاعد') {
      profitLoss = exitPrice - entryPrice;
    } else {
      profitLoss = entryPrice - exitPrice;
    }
    
    const formattedValue = Math.abs(profitLoss).toFixed(3);
    return profitLoss < 0 ? `-${formattedValue}` : formattedValue;
  };

  const displayedAnalysisType = getStrategyName(result.analysis_type);
  const profitLossValue = calculateProfitLoss();
  const profitLossClass = result.is_success ? 'text-success' : 'text-destructive';

  return (
    <div
      className={`grid grid-cols-12 gap-4 p-4 items-center text-right hover:bg-muted/50 transition-colors ${
        result.is_success ? 'bg-success/10' : 'bg-destructive/10'
      }`}
    >
      <div className="flex justify-center">
        <Checkbox 
          checked={selected}
          onCheckedChange={() => onSelect(result.id)}
        />
      </div>
      <div className="truncate" title={displayedAnalysisType}>
        {displayedAnalysisType}
      </div>
      <div className="truncate">{result.symbol}</div>
      <div className="truncate">{result.timeframe}</div>
      <div className="truncate">{result.direction}</div>
      <div className={`font-medium truncate ${profitLossClass}`}>{profitLossValue}</div>
      <div className="truncate">{formatNumber(result.exit_price)}</div>
      <div className="truncate">{formatNumber(result.entry_point_price)}</div>
      <div className="truncate">{formatNumber(result.target_price)}</div>
      <div className="truncate">{formatNumber(result.stop_loss)}</div>
      <div className="truncate">{formatDateArabic(result.result_timestamp)}</div>
      <div className="text-center font-bold text-primary">
        {currentPrice ? formatNumber(currentPrice) : "-"}
      </div>
    </div>
  );
};
