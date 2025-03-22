
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { DirectionIndicator } from "../../history/DirectionIndicator";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface BestEntryPointTableProps {
  results: any[];
  selectedItems: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelect: (id: string) => void;
  currentTradingViewPrice?: number | null;
}

export const BestEntryPointTable = ({
  results,
  selectedItems,
  onSelectAll,
  onSelect,
  currentTradingViewPrice = null
}: BestEntryPointTableProps) => {
  // دالة لتنسيق الأرقام
  const formatNumber = (value: number | string | null | undefined) => {
    if (value === null || value === undefined) return "-";
    const num = typeof value === "string" ? parseFloat(value) : value;
    return Number(num).toFixed(4);
  };
  
  // دالة لتنسيق تاريخ الإنشاء
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
        <div className="w-28 text-center">الهدف الأول</div>
        <div className="w-28 text-center">وقف الخسارة</div>
        <div className="w-28 text-center">أفضل نقطة دخول</div>
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
            <div className="w-36 text-center truncate">{formatCreationDate(result.created_at)}</div>
            <div className="w-32 text-center truncate">{result.analysis_type}</div>
            <div className="w-20 text-center">{result.symbol}</div>
            <div className="w-24 text-center">{result.timeframe}</div>
            <div className="w-20 flex justify-center">
              {result.direction && (
                <DirectionIndicator direction={result.direction === "up" ? "صاعد" : result.direction === "down" ? "هابط" : "محايد"} />
              )}
            </div>
            <div className={`w-24 text-center font-medium ${result.is_success ? 'text-success' : 'text-destructive'}`}>
              {result.is_success ? 'ناجح' : 'فاشل'}
            </div>
            <div className="w-32 text-center">{result.analysis_duration || '0 ساعة'}</div>
            <div className={`w-28 text-center font-medium ${result.is_success ? 'text-success' : 'text-destructive'}`}>
              {result.profit_loss !== null ? formatNumber(result.profit_loss) : 'N/A'}
            </div>
            <div className="w-28 text-center">{formatNumber(result.entry_point_price)}</div>
            <div className="w-28 text-center">{formatNumber(result.target_price)}</div>
            <div className="w-28 text-center">{formatNumber(result.stop_loss)}</div>
            <div className="w-28 text-center">{formatNumber(result.entry_point_price)}</div>
            <div className="w-36 text-center">
              {result.result_timestamp && 
                format(new Date(result.result_timestamp), 'yyyy/MM/dd HH:mm', { locale: ar })}
            </div>
            <div className="w-28 text-center">
              {currentTradingViewPrice ? formatNumber(currentTradingViewPrice) : "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
