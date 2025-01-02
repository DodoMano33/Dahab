import { TableCell } from "@/components/ui/table";

interface AnalysisTypeCellProps {
  analysisType: string;
  pattern?: string;
}

export const AnalysisTypeCell = ({ analysisType, pattern }: AnalysisTypeCellProps) => {
  const formatAnalysisType = () => {
    if (analysisType === "ذكي" && pattern) {
      // استخراج الأنواع فقط من الـ pattern
      const types = pattern
        .replace(/[()]/g, "") // إزالة الأقواس
        .split(",") // تقسيم النصوص بناءً على الفاصلة
        .map(type => type.trim()) // تنظيف النصوص من المسافات الزائدة
        .join(" + "); // دمج الأنواع باستخدام علامة "+"

      return types; // إرجاع الأنواع فقط
    }

    // إذا لم يكن النوع "ذكي" أو لم يكن هناك pattern
    return analysisType;
  };

  return (
    <TableCell className="text-right">
      {formatAnalysisType()}
    </TableCell>
  );
};
