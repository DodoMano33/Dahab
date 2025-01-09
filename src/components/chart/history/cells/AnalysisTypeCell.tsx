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
];

export const AnalysisTypeCell = ({ analysisType, pattern, activation_type = 'يدوي' }: AnalysisTypeCellProps) => {
  // تحويل نوع التحليل إلى النص المناسب من القائمة المسموح بها
  const getDisplayText = () => {
    // التحقق مما إذا كان نوع التحليل موجود في القائمة المسموح بها
    const validType = VALID_ANALYSIS_TYPES.find(
      type => type.toLowerCase() === analysisType.toLowerCase()
    );
    
    // إذا كان النوع صالحًا، نعرضه كما هو
    if (validType) {
      return validType;
    }
    
    // إذا لم يكن النوع في القائمة، نعرض 'Patterns' كقيمة افتراضية
    return 'Patterns';
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