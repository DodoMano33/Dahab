
import { TableCell } from "@/components/ui/table";

interface CurrentPriceCellProps {
  price: number;
}

export const CurrentPriceCell = ({ price }: CurrentPriceCellProps) => (
  <TableCell className="w-16 p-2 text-center">
    {price}
  </TableCell>
);
