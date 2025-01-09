import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AnalysisTypeCellProps {
  analysisType: string;
  pattern?: string;
  activation_type?: 'تلقائي' | 'يدوي';
}

const VALID_ANALYSIS_TYPES = [
  'ICT',
  'Patterns',
  'Turtle Soup',
  'Price Action',
  'Scalping',
  'Gann',
  'SMC',
  'Waves'
] as const;

export const AnalysisTypeCell = ({ analysisType, pattern, activation_type = 'يدوي' }: AnalysisTypeCellProps) => {
  // التحقق من نوع التحليل وعرضه كما هو إذا كان صحيحاً
  const getDisplayText = () => {
    // تحويل نوع التحليل إلى الحالة الصحيحة للمقارنة
    const normalizedType = VALID_ANALYSIS_TYPES.find(
      type => type.toLowerCase() === analysisType.toLowerCase()
    );
    
    // إذا كان النوع صالحاً، نعرضه كما هو بالضبط
    if (normalizedType) {
      return normalizedType;
    }
    
    // إذا كان النوع غير صالح، نعرض تحذيراً في وحدة التحكم
    console.warn(`نوع تحليل غير صالح: ${analysisType}. يجب أن يكون أحد الأنواع التالية:`, VALID_ANALYSIS_TYPES);
    return analysisType;
  };

  return (
    <TableCell className="w-[140px] text-center p-2">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <span>{getDisplayText()}</span>
          {pattern && <Badge variant="outline">{pattern}</Badge>}
        </div>
        <div className={`h-1 w-16 mt-1 rounded-full ${
          activation_type === 'يدوي' 
            ? 'bg-orange-500' 
            : 'bg-transparent'
        }`} />
      </div>
    </TableCell>
  );
};