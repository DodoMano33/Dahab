
import { Checkbox } from "@/components/ui/checkbox";
import { formatDateArabic } from "@/utils/technicalAnalysis/timeUtils";
import { TableCell } from "./TableCell";

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
  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "-";
    return Number(value).toFixed(3);
  };
  
  return (
    <div
      className="grid grid-cols-11 gap-4 p-4 items-center text-right hover:bg-muted/50 transition-colors bg-success/10"
    >
      <div className="flex justify-center">
        <Checkbox 
          checked={selected}
          onCheckedChange={() => onSelect(result.id)}
        />
      </div>
      <div>{result.stop_loss}</div>
      <div>{result.target_price}</div>
      <div>{result.entry_point_price}</div>
      <div>{result.exit_price}</div>
      <div className="font-medium text-success">
        {result.profit_loss !== null ? result.profit_loss.toFixed(4) : 'N/A'}
      </div>
      <div>{result.timeframe}</div>
      <div>{result.analysis_type}</div>
      <div>{result.symbol}</div>
      <div>
        {formatDateArabic(result.result_timestamp)}
      </div>
      <div className="text-center font-bold text-primary">
        {currentPrice ? formatNumber(currentPrice) : "-"}
      </div>
    </div>
  );
};
