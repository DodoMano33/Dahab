import { TableCell } from "@/components/ui/table";

interface AnalysisTypeCellProps {
  analysisType: string;
  pattern?: string;
}

export const AnalysisTypeCell = ({ analysisType, pattern }: AnalysisTypeCellProps) => (
  <TableCell className="w-[140px] text-center whitespace-normal">
    {analysisType}
    {pattern && <div className="text-xs text-muted-foreground">{pattern}</div>}
  </TableCell>
);