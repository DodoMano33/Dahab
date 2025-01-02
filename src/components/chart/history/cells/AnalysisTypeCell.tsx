import { TableCell } from "@/components/ui/table";

interface AnalysisTypeCellProps {
  analysisType: string;
  pattern?: string;
}

export const AnalysisTypeCell = ({ analysisType, pattern }: AnalysisTypeCellProps) => {
  const formatAnalysisType = () => {
    if (analysisType === "ذكي" && pattern) {
      const typesMatch = pattern.match(/\((.*?)\)/); // البحث عن النصوص داخل الأقواس
      if (typesMatch && typesMatch[1]) {
        const types = typesMatch[1]
          .split(',')
          .map(type => type.trim())
          .join(' + '); // دمج الأنواع مع "+" للفصل
        return `Smart (${types})`;
      }
    }
    return analysisType; // النص الافتراضي في حالة عدم تساوي النوع بـ "ذكي"
  };

  return (
    <TableCell className="text-right">
      {formatAnalysisType()}
    </TableCell>
  );
};
