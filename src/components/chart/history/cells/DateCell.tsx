
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface DateCellProps {
  date: Date;
}

export const DateCell = ({ date }: DateCellProps) => (
  <div className="flex flex-col items-center justify-center whitespace-nowrap text-xs">
    <div>{format(date, 'yyyy/MM/dd', { locale: ar })}</div>
    <div className="font-medium">{format(date, 'HH:mm', { locale: ar })}</div>
  </div>
);
