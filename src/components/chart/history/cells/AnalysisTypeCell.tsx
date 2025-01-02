import { TableCell } from "@/components/ui/table";
import { formatAnalysisType } from "../utils/analysisTypeFormatter";

interface AnalysisTypeCellProps {
  analysisType: string;
  pattern: string;
}

export const AnalysisTypeCell = ({ analysisType, pattern }: AnalysisTypeCellProps) => {
  return (
    <TableCell className="text-right">
      {formatAnalysisType(analysisType, pattern)}
    </TableCell>
  );
};