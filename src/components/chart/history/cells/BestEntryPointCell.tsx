
import { TableCell } from "@/components/ui/table";
import { BestEntryPoint } from "../BestEntryPoint";

interface BestEntryPointCellProps {
  price?: number;
  reason?: string;
}

export const BestEntryPointCell = ({ price, reason }: BestEntryPointCellProps) => (
  <TableCell className="w-24 p-2">
    <BestEntryPoint 
      price={price}
      reason={reason}
    />
  </TableCell>
);
