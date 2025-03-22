
import { TableBody } from "@/components/ui/table";
import { HistoryRow } from "./HistoryRow";
import { SearchHistoryItem } from "@/types/analysis";

interface HistoryTableBodyProps {
  history: SearchHistoryItem[];
  selectedItems: Set<string>;
  onSelect: (id: string) => void;
  emptyMessage?: string;
}

export const HistoryTableBody = ({
  history,
  selectedItems,
  onSelect,
  emptyMessage = "لا توجد بيانات في سجل البحث"
}: HistoryTableBodyProps) => {
  return (
    <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
      {history.length > 0 ? (
        history.map((item) => (
          <HistoryRow
            key={item.id}
            {...item}
            analysis_duration_hours={item.analysis_duration_hours}
            last_checked_price={item.last_checked_price}
            last_checked_at={item.last_checked_at}
            isSelected={selectedItems.has(item.id)}
            onSelect={() => onSelect(item.id)}
          />
        ))
      ) : (
        <tr>
          <td colSpan={13} className="text-center py-8 text-muted-foreground">
            {emptyMessage}
          </td>
        </tr>
      )}
    </TableBody>
  );
};
