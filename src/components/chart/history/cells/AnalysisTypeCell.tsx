
import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";
import { getAnalysisTypeBackgroundColor, getActivationTypeClassName } from "../utils/analysisTypeStyles";

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
  // Get display name using helper function
  const displayName = getStrategyName(analysisType);
  
  // Get background color class from utility
  const bgColorClass = getAnalysisTypeBackgroundColor(analysisType);
  
  // Get activation type class from utility
  const activationTypeClass = getActivationTypeClassName(activation_type);

  return (
    <TableCell className="w-[120px] text-center p-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center">
              <Badge variant="outline" className={`px-1.5 py-0.5 text-xs ${bgColorClass} border-0 shadow-sm`}>
                {displayName || 'غير محدد'}
              </Badge>
              {pattern && (
                <Badge variant="outline" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-[10px] px-1 py-0 mt-1">
                  {pattern}
                </Badge>
              )}
              <Badge className={`text-[10px] px-1.5 py-0 mt-1 ${activationTypeClass}`}>
                {activation_type === 'تلقائي' ? 'اوتوماتيكي' : 'يدوي'}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{activation_type === 'تلقائي' ? 'تم التحليل بشكل تلقائي' : 'تم التحليل بشكل يدوي'}</p>
            {pattern && <p className="text-xs mt-1">{pattern}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  );
};
