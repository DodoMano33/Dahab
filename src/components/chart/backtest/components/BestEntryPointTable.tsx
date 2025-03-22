
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { DirectionIndicator } from "../../history/DirectionIndicator";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useCurrentPrice } from "@/hooks/current-price";
import { useEffect, useState } from "react";

interface BestEntryPointTableProps {
  results: any[];
  selectedItems: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelect: (id: string) => void;
  currentTradingViewPrice?: number | null;
  totalProfitLoss?: number;
}

export const BestEntryPointTable = ({
  results,
  selectedItems,
  onSelectAll,
  onSelect,
  currentTradingViewPrice = null,
  totalProfitLoss = 0
}: BestEntryPointTableProps) => {
  const { currentPrice: realTimePrice } = useCurrentPrice();
  const [displayPrice, setDisplayPrice] = useState<number | null>(null);
  
  useEffect(() => {
    if (realTimePrice !== null) {
      setDisplayPrice(realTimePrice);
    } else if (currentTradingViewPrice !== null) {
      setDisplayPrice(currentTradingViewPrice);
    }
  }, [realTimePrice, currentTradingViewPrice]);
  
  const formatNumber = (value: number | string | null | undefined) => {
    if (value === null || value === undefined) return "-";
    const num = typeof value === "string" ? parseFloat(value) : value;
    return Number(num).toFixed(4);
  };
  
  // تنسيق الربح والخسارة مع عرض القيم كما هي (مع العلامات)
  const formatProfitLoss = (value: number | string | null | undefined, isSuccess: boolean) => {
    if (value === null || value === undefined) return "-";
    const num = typeof value === "string" ? parseFloat(value) : value;
    
    return num.toFixed(4);
  };

  // تنسيق القيمة الإجمالية للربح/الخسارة
  const formatTotalProfitLoss = (value: number) => {
    return value.toFixed(4);
  };
  
  const formatCreationDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return (
        <div className="flex flex-col items-center justify-center">
          <div>{format(date, 'yyyy/MM/dd', { locale: ar })}</div>
          <div className="font-medium">{format(date, 'HH:mm', { locale: ar })}</div>
        </div>
      );
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "-";
    }
  };

  const getClosePriceLabel = (result: any) => {
    if (result.is_success) {
      return "الهدف الأول";
    } else {
      return "وقف الخسارة";
    }
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <div className="flex p-4 bg-muted/50 text-right text-sm font-medium border-b sticky top-0 z-40">
        <div className="w-10 flex items-center justify-center">
          <Checkbox 
            checked={selectedItems.size === results.length && results.length > 0}
            onCheckedChange={onSelectAll}
          />
        </div>
        <div className="w-36 text-center">تاريخ التحليل</div>
        <div className="w-32 text-center">نوع التحليل</div>
        <div className="w-20 text-center">الرمز</div>
        <div className="w-24 text-center">الاطار الزمني</div>
        <div className="w-20 text-center">الاتجاه</div>
        <div className="w-24 text-center">النتيجة</div>
        <div className="w-32 text-center">مدة بقاء التحليل</div>
        <div className="w-28 text-center">الربح/الخسارة</div>
        <div className="w-28 text-center">السعر عند التحليل</div>
        <div className="w-28 text-center">أفضل نقطة دخول</div>
        <div className="w-28 text-center">سعر الإغلاق</div>
        <div className="w-36 text-center">تاريخ النتيجة</div>
        <div className="w-28 text-center">السعر الحالي</div>
      </div>
      <div className="divide-y">
        {results.map((result) => (
          <div
            key={result.id}
            className={`flex p-4 items-center hover:bg-muted/50 transition-colors ${
              result.is_success ? 'bg-success/10' : 'bg-destructive/10'
            }`}
          >
            <div className="w-10 flex justify-center">
              <Checkbox 
                checked={selectedItems.has(result.id)}
                onCheckedChange={() => onSelect(result.id)}
              />
            </div>
            <div className="w-36 text-center">{formatCreationDate(result.created_at)}</div>
            <div className="w-32 text-center truncate">{result.analysis_type}</div>
            <div className="w-20 text-center">{result.symbol}</div>
            <div className="w-24 text-center">{result.timeframe}</div>
            <div className="w-20 flex justify-center">
              {result.direction && (
                <DirectionIndicator direction={result.direction} />
              )}
            </div>
            <div className={`w-24 text-center font-medium ${result.is_success ? 'text-success' : 'text-destructive'}`}>
              {result.is_success ? 'ناجح' : 'فاشل'}
            </div>
            <div className="w-32 text-center">{result.analysis_duration || '0 ساعة'}</div>
            <div className={`w-28 text-center font-medium ${Number(result.profit_loss) >= 0 ? 'text-success' : 'text-destructive'}`}>
              {result.profit_loss !== null && result.profit_loss !== undefined 
                ? formatProfitLoss(result.profit_loss, result.is_success) 
                : 'N/A'}
            </div>
            <div className="w-28 text-center">{formatNumber(result.entry_point_price)}</div>
            <div className="w-28 text-center">{formatNumber(result.entry_point_price)}</div>
            <div className="w-28 text-center">
              <div className="flex flex-col items-center">
                <div>{formatNumber(result.is_success ? result.target_price : result.stop_loss)}</div>
                <div className={`text-xs ${result.is_success ? 'text-success' : 'text-destructive'}`}>
                  {getClosePriceLabel(result)}
                </div>
              </div>
            </div>
            <div className="w-36 text-center">
              {result.result_timestamp && (
                <div className="flex flex-col items-center justify-center">
                  <div>{format(new Date(result.result_timestamp), 'yyyy/MM/dd', { locale: ar })}</div>
                  <div className="font-medium">{format(new Date(result.result_timestamp), 'HH:mm', { locale: ar })}</div>
                </div>
              )}
            </div>
            <div className="w-28 text-center relative">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={displayPrice ? 'font-medium text-primary' : ''}>
                      {displayPrice ? formatNumber(displayPrice) : "-"}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>السعر الحقيقي المباشر</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ))}
      </div>
      <div className="flex p-4 justify-between bg-muted/20 border-t">
        <div className="font-bold">إجمالي النتائج: {results.length}</div>
        <div className={`font-bold py-1 px-3 rounded-md ${totalProfitLoss >= 0 ? 'bg-success/20 text-success border border-success/30' : 'bg-destructive/20 text-destructive border border-destructive/30'}`}>
          الربح/الخسارة الإجمالية: {formatTotalProfitLoss(totalProfitLoss)}
        </div>
      </div>
    </div>
  );
};
