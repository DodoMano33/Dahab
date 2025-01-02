import { TableCell } from "@/components/ui/table";

interface AnalysisTypeCellProps {
  analysisType: string;
  pattern?: string;
}

export const AnalysisTypeCell = ({ analysisType, pattern }: AnalysisTypeCellProps) => {
  const formatAnalysisType = () => {
    // التحقق إذا كان النوع "ذكي"
    if (analysisType === "ذكي") {
      // التأكد من وجود النص في pattern
      if (pattern) {
        const cleanedPattern = pattern
          .replace(/[()]/g, '') // إزالة الأقواس
          .split(',')
          .map(type => type.trim()) // تنظيف النصوص
          .join(' + '); // دمج الأنواع بعلامة "+"
        return `Smart (${cleanedPattern})`; // النتيجة المطلوبة
      }
      return "Smart"; // في حالة عدم وجود pattern
    }
    return analysisType; // النوع كما هو للحالات الأخرى
  };

  return (
    <TableCell className="text-right">
      {formatAnalysisType()}
    </TableCell>
  );
};
