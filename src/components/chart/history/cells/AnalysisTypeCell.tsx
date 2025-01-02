import { TableCell } from "@/components/ui/table";

interface AnalysisTypeCellProps {
  analysisType: string;
  pattern?: string;
}

export const AnalysisTypeCell = ({ analysisType, pattern }: AnalysisTypeCellProps) => {
  const formatAnalysisType = () => {
    if (analysisType === "ذكي" && pattern) {
      // إزالة الأقواس من النص وتقسيم الأنواع
      const types = pattern
        .replace(/[()]/g, "") // إزالة الأقواس
        .split(",") // تقسيم النصوص بناءً على الفاصلة
        .map(type => type.trim()) // تنظيف النصوص من المسافات الزائدة
        .join(" + "); // دمج النصوص باستخدام علامة "+"

      // صياغة النص النهائي
      return `Smart (${types})`;
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
