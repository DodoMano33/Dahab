
import { TableRow } from "@/components/ui/table";
import { AnalysisData } from "@/types/analysis";
import { CheckboxCell } from "./cells/CheckboxCell";
import { MarketStatusCell } from "./cells/MarketStatusCell";
import { LastCheckedCell } from "./cells/LastCheckedCell";
import { ExpiryTimerCell } from "./cells/ExpiryTimerCell";
import { BestEntryPointCell } from "./cells/BestEntryPointCell";
import { TargetsListCell } from "./cells/TargetsListCell";
import { StopLossCell } from "./cells/StopLossCell";
import { DirectionCell } from "./cells/DirectionCell";
import { CurrentPriceCell } from "./cells/CurrentPriceCell";
import { AnalysisTypeCell } from "./cells/AnalysisTypeCell";
import { TimeframeCell } from "./cells/TimeframeCell";
import { DateCell } from "./cells/DateCell";
import { SymbolCell } from "./cells/SymbolCell";
import { useHistoryRowData } from "./HistoryRowData";
import { TableCell } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

interface HistoryRowProps {
  id: string;
  date: Date;
  symbol: string;
  currentPrice: number;
  analysis: AnalysisData;
  analysisType: string;
  timeframe: string;
  isSelected?: boolean;
  onSelect?: () => void;
  analysis_duration_hours?: number;
  last_checked_price?: number;
  last_checked_at?: Date | string | null;
}

export const HistoryRow = ({
  id,
  date,
  symbol,
  currentPrice,
  analysis,
  analysisType,
  timeframe,
  isSelected,
  onSelect,
  analysis_duration_hours,
  last_checked_price,
  last_checked_at,
}: HistoryRowProps) => {
  // استخدام مكون معالجة البيانات
  const { displayAnalysisType, bestEntryPoint, fixedTargets } = useHistoryRowData({
    id,
    date,
    analysis,
    analysisType,
    last_checked_price,
    last_checked_at,
  });
  
  const isMobile = useIsMobile();
  const cellClass = isMobile 
    ? "text-center p-1.5 text-xs group-hover:bg-muted/10 transition-colors whitespace-nowrap"
    : "text-center p-2.5 group-hover:bg-muted/10 transition-colors";

  return (
    <TableRow className="text-xs hover:bg-muted/30 transition-colors border-b border-slate-100 dark:border-slate-800 group">
      <CheckboxCell isSelected={isSelected} onSelect={onSelect} />
      <TableCell className={cellClass}><DateCell date={date} /></TableCell>
      <TableCell className={cellClass}>
        <AnalysisTypeCell 
          analysisType={displayAnalysisType} 
          pattern={analysis.pattern}
          activation_type={analysis.activation_type}
        />
      </TableCell>
      <TableCell className={`${cellClass} font-semibold`}><SymbolCell symbol={symbol} /></TableCell>
      <TableCell className={cellClass}><TimeframeCell timeframe={timeframe} /></TableCell>
      <TableCell className={cellClass}><DirectionCell direction={analysis.direction} /></TableCell>
      <TableCell className={cellClass}><CurrentPriceCell price={currentPrice} /></TableCell>
      <TableCell className={cellClass}>
        <StopLossCell 
          value={analysis.stopLoss} 
          isHit={false}
        />
      </TableCell>
      <TableCell className={cellClass}>
        <TargetsListCell 
          targets={fixedTargets} 
          isTargetHit={false}
        />
      </TableCell>
      <TableCell className={cellClass}>
        <BestEntryPointCell 
          price={bestEntryPoint.price}
          reason={bestEntryPoint.reason}
        />
      </TableCell>
      <TableCell className={cellClass}>
        <ExpiryTimerCell 
          createdAt={date} 
          analysisId={id} 
          durationHours={analysis_duration_hours}
        />
      </TableCell>
      <TableCell className={cellClass}>
        <LastCheckedCell 
          price={last_checked_price}
          timestamp={last_checked_at} 
          itemId={id}
        />
      </TableCell>
      <TableCell className={cellClass}>
        <MarketStatusCell itemId={id} />
      </TableCell>
    </TableRow>
  );
};
