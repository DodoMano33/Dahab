
import { TableCell } from "@/components/ui/table";

interface TimeframeCellProps {
  timeframe: string;
}

export const TimeframeCell = ({ timeframe }: TimeframeCellProps) => (
  <TableCell className="w-[80px] text-right whitespace-nowrap">
    {timeframe}
  </TableCell>
);
