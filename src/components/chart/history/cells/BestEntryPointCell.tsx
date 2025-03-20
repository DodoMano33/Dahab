
import { TableCell } from "@/components/ui/table";
import { BestEntryPoint } from "../BestEntryPoint";

interface BestEntryPointCellProps {
  price?: number;
  reason?: string;
}

export const BestEntryPointCell = ({ price, reason }: BestEntryPointCellProps) => {
  // تحويل القيمة إلى رقم إذا كانت سلسلة نصية
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // التحقق من قيمة السعر والتأكد من أنها رقم صالح
  const validPrice = numericPrice !== undefined && !isNaN(Number(numericPrice)) ? numericPrice : undefined;
  
  // سجل للتشخيص
  console.log(`BestEntryPointCell: original price=${price}, numericPrice=${numericPrice}, validPrice=${validPrice}, reason=${reason}`);
  
  return (
    <TableCell className="w-24 p-2">
      <BestEntryPoint 
        price={validPrice}
        reason={reason}
      />
    </TableCell>
  );
};
