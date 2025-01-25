import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DateCell } from "./cells/DateCell";
import { TimeframeCell } from "./cells/TimeframeCell";
import { AnalysisTypeCell } from "./cells/AnalysisTypeCell";
import { DirectionIndicator } from "./DirectionIndicator";
import { StopLoss } from "./StopLoss";
import { TargetsList } from "./TargetsList";
import { BestEntryPoint } from "./BestEntryPoint";
import { ExpiryTimer } from "./ExpiryTimer";
import { AnalysisData } from "@/types/analysis";

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
}: HistoryRowProps) => {
  console.log("HistoryRow analysis_duration_hours:", analysis_duration_hours); // للتأكد من وصول القيمة

  return (
    <TableRow>
      {onSelect && (
        <TableCell className="w-12">
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={onSelect}
            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
        </TableCell>
      )}
      <TableCell className="font-medium">{symbol}</TableCell>
      <TableCell><DateCell date={date} /></TableCell>
      <TableCell><TimeframeCell timeframe={timeframe} /></TableCell>
      <TableCell>
        <AnalysisTypeCell 
          analysisType={analysisType} 
          pattern={analysis.pattern}
        />
      </TableCell>
      <TableCell>{currentPrice}</TableCell>
      <TableCell><DirectionIndicator direction={analysis.direction} /></TableCell>
      <TableCell>
        <StopLoss 
          value={analysis.stopLoss} 
          isHit={false}
        />
      </TableCell>
      <TableCell>
        <TargetsList 
          targets={analysis.targets || []} 
          isTargetHit={false}
        />
      </TableCell>
      <TableCell>
        <BestEntryPoint 
          price={analysis.bestEntryPoint?.price}
          reason={analysis.bestEntryPoint?.reason}
        />
      </TableCell>
      <TableCell>
        <ExpiryTimer 
          createdAt={date} 
          analysisId={id} 
          durationHours={analysis_duration_hours}
        />
      </TableCell>
    </TableRow>
  );
};