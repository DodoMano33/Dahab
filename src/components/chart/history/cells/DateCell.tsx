
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface DateCellProps {
  date: Date;
}

export const DateCell = ({ date }: DateCellProps) => (
  <div className="whitespace-nowrap text-xs">
    {format(date, 'yyyy/MM/dd HH:mm', { locale: ar })}
  </div>
);
