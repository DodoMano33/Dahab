
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
import { useHistoryRowData } from "./hooks/useHistoryRowData";
import { TableCell } from "@/components/ui/table";

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

  return (
    <TableRow className="text-xs hover:bg-muted/30 transition-colors border-b border-slate-100 dark:border-slate-800 group">
      <CheckboxCell isSelected={isSelected} onSelect={onSelect} />
      <TableCell className="text-center p-2.5 group-hover:bg-muted/10 transition-colors"><DateCell date={date} /></TableCell>
      <TableCell className="text-center p-2.5 group-hover:bg-muted/10 transition-colors">
        <AnalysisTypeCell 
          analysisType={displayAnalysisType} 
          pattern={analysis.pattern}
          activation_type={analysis.activation_type}
        />
      </TableCell>
      <TableCell className="text-center p-2.5 group-hover:bg-muted/10 transition-colors font-semibold"><SymbolCell symbol={symbol} /></TableCell>
      <TableCell className="text-center p-2.5 group-hover:bg-muted/10 transition-colors"><TimeframeCell timeframe={timeframe} /></TableCell>
      <TableCell className="text-center p-2.5 group-hover:bg-muted/10 transition-colors"><DirectionCell direction={analysis.direction} /></TableCell>
      <TableCell className="text-center p-2.5 group-hover:bg-muted/10 transition-colors"><CurrentPriceCell price={currentPrice} /></TableCell>
      <TableCell className="text-center p-2.5 group-hover:bg-muted/10 transition-colors">
        <StopLossCell 
          value={analysis.stopLoss} 
          isHit={false}
        />
      </TableCell>
      <TableCell className="text-center p-2.5 group-hover:bg-muted/10 transition-colors">
        <TargetsListCell 
          targets={fixedTargets} 
          isTargetHit={false}
        />
      </TableCell>
      <TableCell className="text-center p-2.5 group-hover:bg-muted/10 transition-colors">
        <BestEntryPointCell 
          price={bestEntryPoint.price}
          reason={bestEntryPoint.reason}
        />
      </TableCell>
      <TableCell className="text-center p-2.5 group-hover:bg-muted/10 transition-colors">
        <ExpiryTimerCell 
          createdAt={date} 
          analysisId={id} 
          durationHours={analysis_duration_hours}
        />
      </TableCell>
      <TableCell className="text-center p-2.5 group-hover:bg-muted/10 transition-colors">
        <LastCheckedCell 
          price={last_checked_price}
          timestamp={last_checked_at} 
          itemId={id}
        />
      </TableCell>
      <TableCell className="text-center p-2.5 group-hover:bg-muted/10 transition-colors">
        <MarketStatusCell itemId={id} />
      </TableCell>
    </TableRow>
  );
};
