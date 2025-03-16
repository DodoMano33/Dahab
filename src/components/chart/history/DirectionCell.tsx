
import { TableCell } from "@/components/ui/table";
import { DirectionIndicator } from "./DirectionIndicator";

interface DirectionCellProps {
  direction: "صاعد" | "هابط" | "محايد";
}

export const DirectionCell = ({ direction }: DirectionCellProps) => (
  <TableCell className="w-16 p-2">
    <DirectionIndicator direction={direction} />
  </TableCell>
);
