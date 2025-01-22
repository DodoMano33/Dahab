import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export interface AnalysisTypeCellProps {
  analysisType: string;
  pattern?: string;
  activation_type?: 'تلقائي' | 'يدوي';
}

export const AnalysisTypeCell = ({ 
  analysisType, 
  pattern, 
  activation_type = 'يدوي' 
}: AnalysisTypeCellProps) => {
  return (
    <TableCell className="w-[140px] text-center p-2">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <span>{analysisType}</span>
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