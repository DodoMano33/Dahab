import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchHistoryItem } from "@/types/analysis";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface HistoryRowProps extends SearchHistoryItem {
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (() => void) | null;
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
      <TableCell className="w-[50px]">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
        />
      </TableCell>
      <TableCell>{format(date, 'PPpp', { locale: ar })}</TableCell>
      <TableCell>{symbol}</TableCell>
      <TableCell>{currentPrice}</TableCell>
      <TableCell>{analysisType}</TableCell>
      <TableCell>{timeframe}</TableCell>
    </TableRow>
  );
};