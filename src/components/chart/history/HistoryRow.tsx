import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { DirectionIndicator } from "./DirectionIndicator";
import { BestEntryPoint } from "./BestEntryPoint";
import { TargetsList } from "./TargetsList";
import { StopLoss } from "./StopLoss";
import { AnalysisData } from "@/types/analysis";

interface HistoryRowProps {
  id: string;
  date: Date;
  symbol: string;
  currentPrice: number;
  analysis: AnalysisData;
  analysisType: "عادي" | "سكالبينج" | "ذكي" | "SMC" | "ICT" | "Turtle Soup" | "Gann" | "Waves" | "Patterns";
  timeframe: string;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

const timeframeLabels: Record<string, string> = {
  "1m": "1 دقيقة",
  "5m": "5 دقائق",
  "30m": "30 دقيقة",
  "1h": "1 ساعة",
  "4h": "4 ساعات",
  "1d": "يومي",
};

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
      {onSelect !== undefined && (
        <TableCell>
          <Checkbox checked={isSelected} onCheckedChange={onSelect} />
        </TableCell>
      )}
      <TableCell className="text-right">
        {format(date, 'PPpp', { locale: ar })}
      </TableCell>
      <TableCell className="text-right font-medium">
        {symbol.toUpperCase()}
      </TableCell>
      <TableCell className="text-right">
        {analysisType}
      </TableCell>
      <TableCell className="text-right">
        {timeframeLabels[timeframe] || timeframe}
      </TableCell>
      <TableCell className="text-right">{currentPrice}</TableCell>
      <TableCell className="text-right">
        <DirectionIndicator direction={analysis.direction} />
      </TableCell>
      <TableCell className="text-right">
        <BestEntryPoint 
          price={analysis.bestEntryPoint?.price} 
          reason={analysis.bestEntryPoint?.reason}
        />
      </TableCell>
      <TableCell className="text-right">
        <TargetsList 
          targets={analysis.targets || []} 
          isTargetHit={false}
        />
      </TableCell>
      <TableCell className="text-right">
        <StopLoss 
          value={analysis.stopLoss} 
          isHit={false}
        />
      </TableCell>
      {onDelete && (
        <TableCell>
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
    </TableRow>
  );
};