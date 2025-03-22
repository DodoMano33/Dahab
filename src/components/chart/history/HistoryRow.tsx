
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
    <TableRow className="text-xs text-center">
      <CheckboxCell isSelected={isSelected} onSelect={onSelect} />
      <TableCell className="text-center p-2 w-36"><DateCell date={date} /></TableCell>
      <TableCell className="text-center p-2 w-28">
        <AnalysisTypeCell 
          analysisType={displayAnalysisType} 
          pattern={analysis.pattern}
          activation_type={analysis.activation_type}
        />
      </TableCell>
      <TableCell className="text-center p-2 w-16"><SymbolCell symbol={symbol} /></TableCell>
      <TableCell className="text-center p-2 w-20"><TimeframeCell timeframe={timeframe} /></TableCell>
      <TableCell className="text-center p-2 w-16"><DirectionCell direction={analysis.direction} /></TableCell>
      <TableCell className="text-center p-2 w-16"><CurrentPriceCell price={currentPrice} /></TableCell>
      <TableCell className="text-center p-2 w-20">
        <StopLossCell 
          value={analysis.stopLoss} 
          isHit={false}
        />
      </TableCell>
      <TableCell className="text-center p-2 w-24">
        <TargetsListCell 
          targets={fixedTargets} 
          isTargetHit={false}
        />
      </TableCell>
      <TableCell className="text-center p-2 w-24">
        <BestEntryPointCell 
          price={bestEntryPoint.price}
          reason={bestEntryPoint.reason}
        />
      </TableCell>
      <TableCell className="text-center p-2 w-20">
        <ExpiryTimerCell 
          createdAt={date} 
          analysisId={id} 
          durationHours={analysis_duration_hours}
        />
      </TableCell>
      <TableCell className="text-center p-2 w-24">
        <LastCheckedCell 
          price={last_checked_price}
          timestamp={last_checked_at} 
          itemId={id}
        />
      </TableCell>
      <TableCell className="text-center p-2 w-16">
        <MarketStatusCell itemId={id} />
      </TableCell>
    </TableRow>
  );
};
