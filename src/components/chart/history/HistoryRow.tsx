import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { DirectionIndicator } from "./DirectionIndicator";
import { BestEntryPoint } from "./BestEntryPoint";
import { TargetsList } from "./TargetsList";
import { StopLoss } from "./StopLoss";
import { AnalysisData } from "@/types/analysis";

interface HistoryRowProps {
  date: Date;
  symbol: string;
  currentPrice: number;
  analysis: AnalysisData;
  analysisType: "عادي" | "سكالبينج";
}

export const HistoryRow = ({ 
  date, 
  symbol, 
  currentPrice, 
  analysis,
  analysisType
}: HistoryRowProps) => {
  return (
    <TableRow>
      <TableCell className="text-right">
        {format(date, 'PPpp', { locale: ar })}
      </TableCell>
      <TableCell className="text-right font-medium">
        {symbol.toUpperCase()}
      </TableCell>
      <TableCell className="text-right">
        {analysisType}
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
    </TableRow>
  );
};