
import { TableCell } from "@/components/ui/table";
import { BestEntryPoint } from "../BestEntryPoint";

interface BestEntryPointCellProps {
  price?: number;
  reason?: string;
}

export const BestEntryPointCell = ({ price, reason }: BestEntryPointCellProps) => {
  // التحقق من قيمة السعر والتأكد من أنها رقم صالح
  const validPrice = price !== undefined && !isNaN(price) ? price : undefined;
  
  // سجل للتشخيص
  console.log(`BestEntryPointCell: price=${price}, validPrice=${validPrice}, reason=${reason}`);
  
  return (
    <TableCell className="w-24 p-2">
      <BestEntryPoint 
        price={validPrice}
        reason={reason}
      />
    </TableCell>
  );
};
