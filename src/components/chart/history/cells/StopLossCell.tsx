
import { TableCell } from "@/components/ui/table";
import { StopLoss } from "../StopLoss";

interface StopLossCellProps {
  value: number;
  isHit: boolean;
}

export const StopLossCell = ({ value, isHit }: StopLossCellProps) => (
  <TableCell className="w-20 p-2">
    <StopLoss 
      value={value} 
      isHit={isHit}
    />
  </TableCell>
);
