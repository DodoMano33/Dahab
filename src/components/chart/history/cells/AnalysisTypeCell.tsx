
import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface AnalysisTypeCellProps {
  analysisType: string;
  pattern?: string;
  activation_type?: 'auto' | 'manual';
}

export const AnalysisTypeCell = ({ 
  analysisType, 
  pattern, 
  activation_type = 'manual' 
}: AnalysisTypeCellProps) => {
  // Log analysis type for debugging
  console.log(`AnalysisTypeCell: type=${analysisType}, pattern=${pattern}, activation=${activation_type}`);
  
  // Determine background color based on analysis type
  const getBgColor = () => {
    const type = analysisType?.toLowerCase() || '';
    const normalizedType = type.replace(/_/g, '').trim();
    
    // Analysis types with specific colors
    if (normalizedType.includes('smc')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
    if (normalizedType.includes('ict')) return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
    if (normalizedType.includes('turtle')) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    if (normalizedType.includes('gann')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    if (normalizedType.includes('waves')) return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300';
    if (normalizedType.includes('pattern')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
    if (normalizedType.includes('priceaction')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    if (normalizedType.includes('smart')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300';
    if (normalizedType.includes('scalping')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
    
    // New analysis types
    if (normalizedType.includes('fibonacci')) {
      // Check for advanced fibonacci first
      if (normalizedType.includes('advanced')) {
        return 'bg-yellow-200 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200';
      }
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
    }
    if (normalizedType.includes('neural')) {
      // Check for RNN first
      if (normalizedType.includes('rnn')) {
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300';
      }
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    }
    if (normalizedType.includes('timecluster')) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
    if (normalizedType.includes('multivariance')) return 'bg-lime-100 text-lime-800 dark:bg-lime-900/20 dark:text-lime-300';
    if (normalizedType.includes('composite')) return 'bg-violet-100 text-violet-800 dark:bg-violet-900/20 dark:text-violet-300';
    if (normalizedType.includes('behavioral')) return 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/20 dark:text-fuchsia-300';
    
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300';
  };

  return (
    <TableCell className="w-[120px] text-center p-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center">
              <Badge variant="outline" className={`px-1.5 py-0.5 text-xs ${getBgColor()} border-0 shadow-sm`}>
                {analysisType || 'Unknown'}
              </Badge>
              {pattern && (
                <Badge variant="outline" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-[10px] px-1 py-0 mt-1">
                  {pattern}
                </Badge>
              )}
              <Badge className={`text-[10px] px-1.5 py-0 mt-1 ${
                activation_type === 'auto' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300' 
                  : 'bg-orange-100 text-orange-800 dark:bg-orange-800/30 dark:text-orange-300'
              }`}>
                {activation_type === 'auto' ? 'Automatic' : 'Manual'}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{activation_type === 'auto' ? 'Automatically analyzed' : 'Manually analyzed'}</p>
            {pattern && <p className="text-xs mt-1">{pattern}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  );
};
