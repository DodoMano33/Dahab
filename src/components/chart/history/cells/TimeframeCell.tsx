import { TableCell } from "@/components/ui/table";

interface TimeframeCellProps {
  timeframe: string;
}

export const TimeframeCell = ({ timeframe }: TimeframeCellProps) => (
  <TableCell className="w-[100px] text-center whitespace-normal">
    {timeframe}
  </TableCell>
);