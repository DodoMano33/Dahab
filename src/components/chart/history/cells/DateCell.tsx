
import { TableCell } from "@/components/ui/table";
import { format, parseISO, isValid } from "date-fns";
import { ar } from "date-fns/locale";

interface DateCellProps {
  date: Date | string | null;
}

export const DateCell = ({ date }: DateCellProps) => {
  if (!date) return (
    <TableCell className="w-[110px] text-center whitespace-nowrap text-xs">
      -
    </TableCell>
  );
  
  try {
    let dateObj: Date;
    
    // التحقق من نوع البيانات وتحويلها إلى كائن Date
    if (typeof date === 'string') {
      dateObj = parseISO(date);
    } else {
      dateObj = date;
    }
    
    // التحقق من صحة التاريخ
    if (!isValid(dateObj)) {
      console.warn(`Invalid date in DateCell: ${date}`);
      return (
        <TableCell className="w-[110px] text-center whitespace-nowrap text-xs">
          تاريخ غير صالح
        </TableCell>
      );
    }
    
    // طباعة التاريخ للتشخيص
    console.log(`Formatting date in DateCell: ${date}, parsed as: ${dateObj}`);
    
    return (
      <TableCell className="w-[110px] text-center whitespace-nowrap text-xs">
        {format(dateObj, 'PPpp', { locale: ar })}
      </TableCell>
    );
  } catch (error) {
    console.error("Error formatting date in DateCell:", error, date);
    return (
      <TableCell className="w-[110px] text-center whitespace-nowrap text-xs">
        خطأ في التاريخ
      </TableCell>
    );
  }
};
