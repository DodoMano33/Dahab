import { TableCell } from "@/components/ui/table";

interface AnalysisTypeCellProps {
  analysisType: string;
  pattern?: string;
}

export const AnalysisTypeCell = ({ analysisType, pattern }: AnalysisTypeCellProps) => {
  const formatAnalysisType = () => {
    if (analysisType === "ذكي" && pattern) {
      // Extract strategies from the pattern
      const typesMatch = pattern.match(/\((.*?)\)/);
      if (typesMatch && typesMatch[1]) {
        const strategies = typesMatch[1]
          .split(',')
          .map(s => s.trim())
          .filter(s => s);

        const count = strategies.length;
        const strategyNames = strategies.join(' + ');
        
        // Return the formatted string with count and names
        return `ذكي (${strategyNames})`;
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