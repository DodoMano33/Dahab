import { TableCell } from "@/components/ui/table";

interface AnalysisTypeCellProps {
  analysisType: string;
  pattern?: string;
}

export const AnalysisTypeCell = ({ analysisType, pattern }: AnalysisTypeCellProps) => {
  const formatAnalysisType = () => {
    console.log('Formatting analysis type:', analysisType, 'pattern:', pattern);
    
    if (analysisType === "ذكي" && pattern) {
      const typesMatch = pattern.match(/\((.*?)\)/);
      if (typesMatch && typesMatch[1]) {
        const types = typesMatch[1]
          .split(',')
          .map(type => type.trim())
          .join(' + ');
        return `(${types})`;
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