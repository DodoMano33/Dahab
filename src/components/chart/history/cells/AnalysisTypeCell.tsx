import { TableCell } from "@/components/ui/table";

interface AnalysisTypeCellProps {
  analysisType: string;
  pattern?: string;
}

export const AnalysisTypeCell = ({ analysisType, pattern }: AnalysisTypeCellProps) => {
  const formatAnalysisType = () => {
    if (analysisType === "ذكي" || analysisType === "Smart") {
      // Extract strategies from the pattern if available
      const typesMatch = pattern?.match(/\((.*?)\)/);
      if (typesMatch && typesMatch[1]) {
        const strategies = typesMatch[1]
          .split(',')
          .map(s => s.trim())
          .filter(s => s);
        
        return `Smart (${strategies.join(' + ')})`;
      }
      return "Smart";
    }
    return analysisType;
  };

  return (
    <TableCell className="text-right">
      {formatAnalysisType()}
    </TableCell>
  );
};