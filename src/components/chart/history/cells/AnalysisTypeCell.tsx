
import { TableCell } from "@/components/ui/table";

interface AnalysisTypeCellProps {
  analysisType: string;
  pattern?: string;
  activation_type?: string;
}

export const AnalysisTypeCell = ({ 
  analysisType,
  pattern,
  activation_type
}: AnalysisTypeCellProps) => {
  // Determine the display text
  const displayText = analysisType || pattern || "غير محدد";
  
  // Determine if we need to show additional info
  const showAdditionalInfo = activation_type && activation_type !== "مباشر";
  
  return (
    <div className="text-right">
      <div className="text-xs font-medium">{displayText}</div>
      {showAdditionalInfo && (
        <div className="text-[10px] text-muted-foreground mt-0.5">
          {activation_type}
        </div>
      )}
    </div>
  );
};
