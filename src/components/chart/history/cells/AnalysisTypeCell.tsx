import { TableCell } from "@/components/ui/table";

interface AnalysisTypeCellProps {
  analysisType: string;
  pattern?: string;
}

export const AnalysisTypeCell = ({ analysisType, pattern }: AnalysisTypeCellProps) => {
  const formatAnalysisType = () => {
    console.log('Formatting analysis type:', analysisType, 'pattern:', pattern);
    
    if (pattern) {
      // Check if pattern contains "تحليل مدمج"
      if (pattern.includes('تحليل مدمج')) {
        const typesMatch = pattern.match(/\((.*?)\)/);
        if (typesMatch && typesMatch[1]) {
          // Extract the number and types
          const types = typesMatch[1]
            .replace(/\d+\s*استراتيجيات?/, '') // Remove the number of strategies text
            .split(',')
            .map(type => type.trim())
            .filter(type => type) // Remove empty strings
            .join(' + ');
          return `(${types})`;
        }
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