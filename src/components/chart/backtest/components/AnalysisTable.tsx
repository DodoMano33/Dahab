
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";
import { Badge } from "@/components/ui/badge";
import { DirectionIndicator } from "../../history/DirectionIndicator";

interface AnalysisTableProps {
  analyses: any[];
  selectedItems: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelect: (id: string) => void;
  totalProfitLoss?: number;
  currentTradingViewPrice?: number | null;
}

export const AnalysisTable = ({
  analyses,
  selectedItems,
  onSelectAll,
  onSelect,
  totalProfitLoss = 0,
  currentTradingViewPrice = null
}: AnalysisTableProps) => {
  // دالة لتنسيق الأرقام لتظهر 3 أرقام فقط بعد الفاصلة
  const formatNumber = (value: number | string | null | undefined) => {
    if (value === null || value === undefined) return "-";
    const num = typeof value === "string" ? parseFloat(value) : value;
    return Number(num).toFixed(3);
  };

  // دالة لتنسيق الربح/الخسارة بحيث تظهر إشارة سالب للخسارة فقط
  const formatProfitLoss = (value: number | null | undefined, isSuccess: boolean) => {
    if (value === null || value === undefined) return "-";
    
    // إظهار القيمة المطلقة للتحليلات الناجحة وإضافة إشارة سالب للفاشلة
    const formattedValue = Number(Math.abs(value)).toFixed(3);
    return isSuccess ? formattedValue : `-${formattedValue}`;
  };

  // دالة لتنسيق إجمالي الربح/الخسارة
  const formatTotalProfitLoss = (total: number) => {
    return total >= 0 ? `+${total.toFixed(3)}` : `${total.toFixed(3)}`;
  };

  // دالة لتنسيق تاريخ إنشاء التحليل (تاريخ/شهر/سنة ساعة:دقيقة)
  const formatCreationDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return format(date, 'yyyy/MM/dd HH:mm', { locale: ar });
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "-";
    }
  };

  console.log("Rendering analysis table with analyses:", analyses.length);

  return (
    <div className="border rounded-lg bg-white shadow-sm overflow-x-auto">
      <div className="flex p-4 bg-muted/50 text-right text-xs font-medium border-b sticky top-0 z-40">
        <div className="w-10 flex items-center justify-center">
          <Checkbox 
            checked={selectedItems.size === analyses.length && analyses.length > 0}
            onCheckedChange={onSelectAll}
          />
        </div>
        <div className="w-36 text-center">تاريخ التحليل</div>
        <div className="w-32 text-center">نوع التحليل</div>
        <div className="w-20 text-center">الرمز</div>
        <div className="w-24 text-center">الاطار الزمني</div>
        <div className="w-20 text-center">الاتجاه</div>
        <div className="w-24 text-center">النتيجة</div>
        <div className="w-28 text-center flex items-center justify-center gap-2">
          <span>الربح/الخسارة</span>
          {analyses.length > 0 && (
            <Badge variant={totalProfitLoss >= 0 ? "success" : "destructive"} className="font-bold">
              {formatTotalProfitLoss(totalProfitLoss)}
            </Badge>
          )}
        </div>
        <div className="w-28 text-center">السعر عند التحليل</div>
        <div className="w-28 text-center">أفضل نقطة دخول</div>
        <div className="w-28 text-center">الهدف الأول</div>
        <div className="w-28 text-center">وقف الخسارة</div>
        <div className="w-36 text-center">تاريخ النتيجة</div>
        <div className="w-28 text-center">السعر الحالي</div>
      </div>
      <div className="divide-y text-xs">
        {analyses.map((analysis) => {
          const displayedAnalysisType = getStrategyName(analysis.analysis_type);
          return (
            <div
              key={analysis.id}
              className={`flex p-2 items-center hover:bg-muted/50 transition-colors ${
                analysis.is_success ? 'bg-success/10' : 'bg-destructive/10'
              }`}
            >
              <div className="w-10 flex justify-center">
                <Checkbox 
                  checked={selectedItems.has(analysis.id)}
                  onCheckedChange={() => onSelect(analysis.id)}
                />
              </div>
              <div className="w-36 text-center truncate">
                {formatCreationDate(analysis.created_at)}
              </div>
              <div className="w-32 text-center truncate">{displayedAnalysisType}</div>
              <div className="w-20 text-center truncate">{analysis.symbol}</div>
              <div className="w-24 text-center truncate">{analysis.timeframe}</div>
              <div className="w-20 flex justify-center">
                {analysis.direction && (
                  <DirectionIndicator direction={analysis.direction === "up" ? "صاعد" : analysis.direction === "down" ? "هابط" : "محايد"} />
                )}
              </div>
              <div className={`w-24 text-center font-medium truncate ${analysis.is_success ? 'text-success' : 'text-destructive'}`}>
                {analysis.is_success ? 'ناجح' : 'فاشل'}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`w-28 text-center truncate ${analysis.is_success ? 'text-success' : 'text-destructive'}`}>
                      {formatProfitLoss(analysis.profit_loss, analysis.is_success)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>الربح/الخسارة: {formatProfitLoss(analysis.profit_loss, analysis.is_success)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-28 text-center truncate">{formatNumber(analysis.entry_price)}</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>السعر عند التحليل: {formatNumber(analysis.entry_price)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-28 text-center truncate">{formatNumber(analysis.best_entry_price || analysis.entry_price)}</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>أفضل نقطة دخول: {formatNumber(analysis.best_entry_price || analysis.entry_price)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-28 text-center truncate">{formatNumber(analysis.target_price)}</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>الهدف الأول: {formatNumber(analysis.target_price)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-28 text-center truncate">{formatNumber(analysis.stop_loss)}</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>وقف الخسارة: {formatNumber(analysis.stop_loss)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="w-36 text-center truncate">
                {analysis.result_timestamp && 
                  format(new Date(analysis.result_timestamp), 'yyyy/MM/dd HH:mm', { locale: ar })}
              </div>
              <div className="w-28 text-center truncate">
                {currentTradingViewPrice ? formatNumber(currentTradingViewPrice) : "-"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
