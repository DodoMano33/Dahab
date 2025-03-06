
import { TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface DateCellProps {
  date: Date;
}

export const DateCell = ({ date }: DateCellProps) => (
  <TableCell className="w-[110px] text-right whitespace-nowrap text-xs">
    {format(date, 'PPpp', { locale: ar })}
  </TableCell>
);
