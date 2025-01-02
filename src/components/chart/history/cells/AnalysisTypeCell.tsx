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
        // Extract all text between parentheses
        const typesMatch = pattern.match(/\((.*?)\)/);
        if (typesMatch && typesMatch[1]) {
          // Split the text after "استراتيجيات" or "استراتيجية"
          const fullText = typesMatch[1];
          const strategiesText = fullText.split(/استراتيجيات|استراتيجية/).pop();
          
          if (strategiesText) {
            // Clean and format the types
            const types = strategiesText
              .split(',')
              .map(type => type.trim())
              .filter(type => type.length > 0)
              .join(' + ');
            
            return `(${types})`;
          }
        }
      } else {
        // For non-combined analysis, return the original type
        return analysisType;
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