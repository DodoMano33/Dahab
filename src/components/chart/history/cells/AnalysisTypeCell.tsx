
import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  // تحديد لون الخلفية بناءً على نوع التحليل
  const getBgColor = () => {
    const type = analysisType.toLowerCase();
    
    // Old analysis types
    if (type.includes('smc') || type.includes('نظرية هيكل السوق')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
    if (type.includes('ict') || type.includes('نظرية السوق')) return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
    if (type.includes('turtle') || type.includes('الحساء السلحفائي')) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    if (type.includes('gann') || type.includes('جان')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    if (type.includes('waves') || type.includes('تقلبات')) return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300';
    if (type.includes('pattern') || type.includes('نمطي')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
    if (type.includes('price action') || type.includes('حركة السعر')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    if (type.includes('ذكي') || type.includes('smart')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300';
    if (type.includes('scalping') || type.includes('مضاربة') || type.includes('سكالبينج')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
    if (type.includes('فيبوناتشي متقدم') || type.includes('fibonacci advanced') || type.includes('تحليل فيبوناتشي متقدم')) return 'bg-yellow-200 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200';
    if (type.includes('فيبوناتشي') || type.includes('fibonacci')) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
    
    // New analysis types
    if (type.includes('شبكات عصبية متكررة') || type.includes('rnn')) return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300';
    if (type.includes('شبكات عصبية') || type.includes('neural')) return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    if (type.includes('تصفيق زمني') || type.includes('time clustering')) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
    if (type.includes('تباين متعدد العوامل') || type.includes('multi variance')) return 'bg-lime-100 text-lime-800 dark:bg-lime-900/20 dark:text-lime-300';
    if (type.includes('شمعات مركبة') || type.includes('composite')) return 'bg-violet-100 text-violet-800 dark:bg-violet-900/20 dark:text-violet-300';
    if (type.includes('تحليل سلوكي') || type.includes('behavioral')) return 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/20 dark:text-fuchsia-300';
    
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300';
  };

  return (
    <TableCell className="w-[140px] text-center p-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`px-2 py-1 ${getBgColor()} border-0 shadow-sm`}>
                  {analysisType}
                </Badge>
                {pattern && <Badge variant="outline" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">{pattern}</Badge>}
              </div>
              <div className={`h-1 w-16 mt-1.5 rounded-full ${
                activation_type === 'تلقائي' 
                  ? 'bg-gradient-to-r from-green-400 to-green-500 animate-pulse' 
                  : 'bg-gradient-to-r from-orange-400 to-orange-500'
              }`} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{activation_type === 'تلقائي' ? 'تم التحليل بشكل تلقائي' : 'تم التحليل بشكل يدوي'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  );
};
