import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { DirectionIndicator } from "./DirectionIndicator";
import { BestEntryPoint } from "./BestEntryPoint";
import { TargetsList } from "./TargetsList";
import { StopLoss } from "./StopLoss";
import { AnalysisData } from "@/types/analysis";
import { DateCell } from "./cells/DateCell";
import { AnalysisTypeCell } from "./cells/AnalysisTypeCell";
import { TimeframeCell } from "./cells/TimeframeCell";

interface HistoryRowProps {
  id: string;
  date: Date;
  symbol: string;
  currentPrice: number;
  analysis: AnalysisData;
  analysisType: "عادي" | "سكالبينج" | "ذكي" | "SMC" | "ICT" | "Turtle Soup" | "Gann" | "Waves" | "Patterns" | "Smart" | "Price Action";
  timeframe: string;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
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
  onDelete
}: HistoryRowProps) => {
  return (
    <TableRow>
      {onDelete && (
        <TableCell className="text-left">
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      )}
      <TableCell className="text-right">
        <StopLoss 
          value={analysis.stopLoss} 
          isHit={false}
        />
      </TableCell>
      <TableCell className="text-right">
        <TargetsList 
          targets={analysis.targets?.slice(0, 3) || []} 
          isTargetHit={false}
        />
      </TableCell>
      <TableCell className="text-right">
        <BestEntryPoint 
          price={analysis.bestEntryPoint?.price} 
          reason={analysis.bestEntryPoint?.reason}
        />
      </TableCell>
      <TableCell className="text-right">
        <DirectionIndicator direction={analysis.direction} />
      </TableCell>
      <TableCell className="text-right">{currentPrice}</TableCell>
      <TimeframeCell timeframe={timeframe} />
      <AnalysisTypeCell analysisType={analysisType} pattern={analysis.pattern} />
      <TableCell className="text-right font-medium">
        {symbol.toUpperCase()}
      </TableCell>
      <DateCell date={date} />
      {onSelect !== undefined && (
        <TableCell className="text-right">
          <Checkbox checked={isSelected} onCheckedChange={onSelect} />
        </TableCell>
      )}
    </TableRow>
  );
};