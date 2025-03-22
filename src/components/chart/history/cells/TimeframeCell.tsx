
interface TimeframeCellProps {
  timeframe: string;
}

export const TimeframeCell = ({ timeframe }: TimeframeCellProps) => (
  <div className="whitespace-nowrap">
    {timeframe}
  </div>
);
