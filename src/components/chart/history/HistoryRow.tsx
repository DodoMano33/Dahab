import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DirectionIndicator } from "./DirectionIndicator";
import { BestEntryPoint } from "./BestEntryPoint";
import { TargetsList } from "./TargetsList";
import { StopLoss } from "./StopLoss";

interface HistoryRowProps {
  id: string;
  date: Date;
  symbol: string;
  currentPrice: number;
  analysis: any;
  analysisType: string;
  timeframe: string;
  isSelected?: boolean;
  onSelect?: () => void;
  target_hit?: boolean;
  stop_loss_hit?: boolean;
}

export const HistoryRow = ({
  id,
  date,
  symbol,
  currentPrice,
  analysis,
  analysisType,
  timeframe,
  isSelected = false,
  onSelect,
  target_hit = false,
  stop_loss_hit = false
}: HistoryRowProps) => {
  const rowBackgroundColor = cn(
    "transition-colors duration-200",
    target_hit && "bg-green-50 hover:bg-green-100",
    stop_loss_hit && "bg-red-50 hover:bg-red-100"
  );

  return (
    <TableRow className={rowBackgroundColor}>
      {onSelect !== undefined && (
        <TableCell className="w-[60px] text-center p-2">
          <Checkbox checked={isSelected} onCheckedChange={onSelect} />
        </TableCell>
      )}
      <TableCell className="w-[120px] text-center p-2">
        {format(new Date(date), 'yyyy-MM-dd HH:mm')}
      </TableCell>
      <TableCell className="w-[100px] text-center p-2 font-medium">
        {symbol.toUpperCase()}
      </TableCell>
      <TableCell className="w-[140px] text-center p-2">
        {analysisType}
      </TableCell>
      <TableCell className="w-[100px] text-center p-2">
        {timeframe}
      </TableCell>
      <TableCell className="w-[120px] text-center p-2">
        {currentPrice}
      </TableCell>
      <TableCell className="w-[80px] text-center p-2">
        <DirectionIndicator direction={analysis.direction} />
      </TableCell>
      <TableCell className="w-[160px] text-center p-2">
        <BestEntryPoint 
          price={analysis.bestEntryPoint?.price} 
          reason={analysis.bestEntryPoint?.reason}
        />
      </TableCell>
      <TableCell className="w-[140px] text-center p-2">
        <TargetsList 
          targets={analysis.targets?.slice(0, 3) || []} 
          isTargetHit={target_hit}
        />
      </TableCell>
      <TableCell className="w-[120px] text-center p-2">
        <StopLoss 
          value={analysis.stopLoss} 
          isHit={stop_loss_hit}
        />
      </TableCell>
    </TableRow>
  );
};