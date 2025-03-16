
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface AnalysisTableProps {
  analyses: any[];
  selectedItems: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelect: (id: string) => void;
  totalProfitLoss?: number;
}

export const AnalysisTable = ({
  analyses,
  selectedItems,
  onSelectAll,
  onSelect,
  totalProfitLoss = 0
}: AnalysisTableProps) => {
  // إضافة حالة لتخزين السعر الحالي
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  
  // الاستماع لتحديثات السعر
  useEffect(() => {
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        setCurrentPrice(event.detail.price);
      }
    };
    
    window.addEventListener('chart-price-update', handlePriceUpdate as EventListener);
    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    
    // طلب السعر الحالي عند تحميل المكون
    window.dispatchEvent(new Event('request-current-price'));
    
    return () => {
      window.removeEventListener('chart-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    };
  }, []);

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

  // دالة لتنسيق التاريخ بالشكل المطلوب
  const formatDate = (timestamp: string | null) => {
    if (!timestamp) return "-";
    
    const date = new Date(timestamp);
    return format(date, 'dd/M/yyyy HH:mm');
  };

  console.log("Rendering analysis table with analyses:", analyses.length);
  if (analyses.length > 0) {
    console.log("Sample analysis types from items:", analyses.slice(0, 5).map(a => 
      `${a.id}: ${a.analysis_type} -> ${getStrategyName(a.analysis_type)}`
    ));
    console.log("Unique analysis types in table:", 
      [...new Set(analyses.map(a => a.analysis_type))]);
  }

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <div className="grid grid-cols-12 gap-1 p-2 bg-muted/50 text-right text-xs font-medium border-b sticky top-0 z-40">
        <div className="text-center flex items-center justify-center">
          <Checkbox 
            checked={selectedItems.size === analyses.length && analyses.length > 0}
            onCheckedChange={onSelectAll}
          />
        </div>
        <div>وقف الخسارة</div>
        <div>الهدف الأول</div>
        <div>السعر عند التحليل</div>
        <div>أفضل نقطة دخول</div>
        <div className="flex items-center justify-end gap-2">
          <span>الربح/الخسارة</span>
          {analyses.length > 0 && (
            <Badge variant={totalProfitLoss >= 0 ? "success" : "destructive"} className="font-bold">
              {formatTotalProfitLoss(totalProfitLoss)}
            </Badge>
          )}
        </div>
        <div>النتيجة</div>
        <div>الاطار الزمني</div>
        <div>نوع التحليل</div>
        <div>الرمز</div>
        <div>تاريخ النتيجة</div>
        <div className="text-center font-semibold text-primary">السعر الحالي</div>
      </div>
      <div className="divide-y text-xs">
        {analyses.map((analysis) => {
          const displayedAnalysisType = getStrategyName(analysis.analysis_type);
          return (
            <div
              key={analysis.id}
              className={`grid grid-cols-12 gap-1 p-2 items-center text-right hover:bg-muted/50 transition-colors ${
                analysis.is_success ? 'bg-success/10' : 'bg-destructive/10'
              }`}
            >
              <div className="flex justify-center">
                <Checkbox 
                  checked={selectedItems.has(analysis.id)}
                  onCheckedChange={() => onSelect(analysis.id)}
                />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="truncate">{formatNumber(analysis.stop_loss)}</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>وقف الخسارة: {formatNumber(analysis.stop_loss)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="truncate">{formatNumber(analysis.target_price)}</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>الهدف الأول: {formatNumber(analysis.target_price)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="truncate">{formatNumber(analysis.entry_price)}</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>السعر عند التحليل: {formatNumber(analysis.entry_price)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="truncate">{formatNumber(analysis.best_entry_price || analysis.entry_price)}</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>أفضل نقطة دخول: {formatNumber(analysis.best_entry_price || analysis.entry_price)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`truncate ${analysis.is_success ? 'text-success' : 'text-destructive'}`}>
                      {formatProfitLoss(analysis.profit_loss, analysis.is_success)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>الربح/الخسارة: {formatProfitLoss(analysis.profit_loss, analysis.is_success)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className={`font-medium truncate ${analysis.is_success ? 'text-success' : 'text-destructive'}`}>
                {analysis.is_success ? 'ناجح' : 'فاشل'}
              </div>
              <div className="truncate">{analysis.timeframe}</div>
              <div className="truncate">{displayedAnalysisType}</div>
              <div className="truncate">{analysis.symbol}</div>
              <div className="truncate">
                {formatDate(analysis.result_timestamp)}
              </div>
              <div className="text-center font-bold text-primary">
                {currentPrice ? formatNumber(currentPrice) : "-"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
