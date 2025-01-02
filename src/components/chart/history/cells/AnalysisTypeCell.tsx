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
      return "Smart"; // إذا لم تكن هناك أنماط، فقط اكتب "Smart".
    }
    return analysisType; // إذا لم يكن النوع "ذكي"، أرجع النص كما هو.
  };

  return (
    <TableCell className="text-right">
      {formatAnalysisType()}
    </TableCell>
  );
};
