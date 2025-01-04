import { TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface DateCellProps {
  date: Date;
}

export const DateCell = ({ date }: DateCellProps) => (
  <TableCell className="w-[120px] text-center whitespace-normal">
    {format(date, 'PPpp', { locale: ar })}
  </TableCell>
);