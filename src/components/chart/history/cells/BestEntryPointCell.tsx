
import { TableCell } from "@/components/ui/table";
import { BestEntryPoint } from "../BestEntryPoint";

interface BestEntryPointCellProps {
  price?: number | string | null;
  reason?: string;
}

export const BestEntryPointCell = ({ price, reason }: BestEntryPointCellProps) => {
  // تحويل السعر إلى رقم إذا كان سلسلة نصية
  const parsePrice = (value: number | string | null | undefined): number | undefined => {
    if (value === null || value === undefined) return undefined;
    
    // تحويل إلى رقم
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // التحقق من صحة الرقم
    return !isNaN(Number(numericValue)) ? numericValue : undefined;
  };
  
  // الحصول على القيمة الرقمية النهائية
  const validPrice = parsePrice(price);
  
  // تسجيل للتشخيص
  console.log(`BestEntryPointCell: original price=${price}, type=${typeof price}, validPrice=${validPrice}, reason=${reason}`);
  
  return (
    <TableCell className="w-24 p-2">
      <BestEntryPoint 
        price={validPrice} 
        reason={reason}
      />
    </TableCell>
  );
};
