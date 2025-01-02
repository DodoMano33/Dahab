import { TableCell } from "@/components/ui/table";

const timeframeLabels: Record<string, string> = {
  "1m": "1 دقيقة",
  "5m": "5 دقائق",
  "30m": "30 دقيقة",
  "1h": "1 ساعة",
  "4h": "4 ساعات",
  "1d": "يومي",
};

interface TimeframeCellProps {
  timeframe: string;
}

export const TimeframeCell = ({ timeframe }: TimeframeCellProps) => {
  return (
    <TableCell className="text-right">
      {timeframeLabels[timeframe] || timeframe}
    </TableCell>
  );
};