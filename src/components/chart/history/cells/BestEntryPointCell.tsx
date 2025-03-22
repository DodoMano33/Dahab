
import { TableCell } from "@/components/ui/table";
import { validatePrice } from "../utils/cellUtils";
import { EntryPointIndicator } from "../components/EntryPointIndicator";

interface BestEntryPointCellProps {
  price?: number | string | null;
  reason?: string;
}

export const BestEntryPointCell = ({ price, reason }: BestEntryPointCellProps) => {
  // Use the shared utility for price validation
  const validPrice = validatePrice(price);
  
  return (
    <TableCell className="w-24 p-2">
      <EntryPointIndicator 
        price={validPrice} 
        reason={reason}
      />
    </TableCell>
  );
};
