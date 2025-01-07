import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
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
  activation_type?: 'تلقائي' | 'يدوي';
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
  activation_type = 'يدوي'
}: HistoryRowProps) => {
  console.log("Activation type:", activation_type); // Debug log

  return (
    <TableRow>
      <TableCell className="w-[120px] text-center p-2 whitespace-normal">
        <StopLoss 
          value={analysis.stopLoss} 
          isHit={false}
        />
      </TableCell>
      <TableCell className="w-[140px] text-center p-2 whitespace-normal">
        <div className="flex justify-center">
          <TargetsList 
            targets={analysis.targets?.slice(0, 3) || []} 
            isTargetHit={false}
          />
        </div>
      </TableCell>
      <TableCell className="w-[160px] text-center p-2 whitespace-normal">
        <div className="flex justify-center">
          <BestEntryPoint 
            price={analysis.bestEntryPoint?.price} 
            reason={analysis.bestEntryPoint?.reason}
          />
        </div>
      </TableCell>
      <TableCell className="w-[80px] text-center p-2">
        <DirectionIndicator direction={analysis.direction} />
      </TableCell>
      <TableCell className="w-[120px] text-center p-2">{currentPrice}</TableCell>
      <TimeframeCell timeframe={timeframe} />
      <AnalysisTypeCell analysisType={analysisType} pattern={analysis.pattern} />
      <TableCell className="w-[100px] text-center p-2 font-medium relative">
        {activation_type === 'يدوي' && (
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-500" />
        )}
        <div className="flex flex-col items-center">
          <div 
            className={`h-1 w-16 mb-1 rounded-full ${
              activation_type === 'تلقائي' 
                ? 'bg-emerald-500' // Using emerald for automatic activation
                : 'bg-orange-500' // Using orange for manual activation
            }`}
          />
          <span>{symbol.toUpperCase()}</span>
        </div>
      </TableCell>
      <DateCell date={date} />
      {onSelect !== undefined && (
        <TableCell className="w-[60px] text-center p-2">
          <Checkbox checked={isSelected} onCheckedChange={onSelect} />
        </TableCell>
      )}
    </TableRow>
  );
};
