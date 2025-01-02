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
          // Extract just the number from the text
          const numberMatch = typesMatch[1].match(/(\d+)/);
          const number = numberMatch ? parseInt(numberMatch[0]) : 0;
          
          // Get the strategy types after the number
          const strategiesText = typesMatch[1].split('استراتيجيات')[1] || 
                                typesMatch[1].split('استراتيجية')[1];
          
          if (strategiesText) {
            const types = strategiesText
              .split(',')
              .map(type => type.trim())
              .filter(type => type.length > 0)
              .join(' + ');
            
            return `(${types})`;
          }
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