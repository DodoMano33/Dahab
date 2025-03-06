
import { TableCell } from "@/components/ui/table";

interface TimeframeCellProps {
  timeframe: string;
}

export const TimeframeCell = ({ timeframe }: TimeframeCellProps) => (
  <TableCell className="w-[80px] text-center whitespace-nowrap">
    {timeframe}
  </TableCell>
);
