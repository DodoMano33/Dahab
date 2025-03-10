
import { TableCell } from "@/components/ui/table";
import { ExpiryTimer } from "../ExpiryTimer";

interface ExpiryTimerCellProps {
  createdAt: Date;
  analysisId: string;
  durationHours?: number;
}

export const ExpiryTimerCell = ({ createdAt, analysisId, durationHours }: ExpiryTimerCellProps) => (
  <TableCell className="w-20 p-2">
    <ExpiryTimer 
      createdAt={createdAt} 
      analysisId={analysisId} 
      durationHours={durationHours}
    />
  </TableCell>
);
