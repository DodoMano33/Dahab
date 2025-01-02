import { TableCell } from "@/components/ui/table";

interface AnalysisTypeCellProps {
  analysisType: string;
  pattern?: string;
}

export const AnalysisTypeCell = ({ analysisType, pattern }: AnalysisTypeCellProps) => {
  const formatAnalysisType = () => {
    if (analysisType === "ذكي" && pattern) {
      const typesMatch = pattern.match(/\((.*?)\)/);
      if (typesMatch && typesMatch[1]) {
        const types = typesMatch[1]
          .split(',')
          .map(type => type.trim())
          .join(' + ');
        return `Smart (${types})`;
      }
    }
    return analysisType;
  };

  return (
    <TableCell className="text-right">
      {formatAnalysisType()}
    </TableCell>
  );
};