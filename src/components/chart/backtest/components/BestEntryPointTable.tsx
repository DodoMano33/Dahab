
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
      <div className="grid grid-cols-13 gap-4 p-4 bg-muted/50 text-right text-sm font-medium border-b sticky top-0 z-40">
        <div className="text-center flex items-center justify-center">
          <Checkbox 
            checked={selectedItems.size === results.length && results.length > 0}
            onCheckedChange={onSelectAll}
          />
        </div>
        <div>وقف الخسارة</div>
        <div>الهدف الأول</div>
        <div>نقطة الدخول</div>
        <div>سعر الخروج</div>
        <div>الربح/الخسارة</div>
        <div>السعر الحالي</div>
        <div>الاتجاه</div>
        <div>تاريخ الإنشاء</div>
        <div>الاطار الزمني</div>
        <div>نوع التحليل</div>
        <div>الرمز</div>
        <div>تاريخ النتيجة</div>
      </div>
      <div className="divide-y">
        {results.map((result) => (
          <div
            key={result.id}
            className={`grid grid-cols-13 gap-4 p-4 items-center text-right hover:bg-muted/50 transition-colors ${
              result.is_success ? 'bg-success/10' : 'bg-destructive/10'
            }`}
          >
            <div className="flex justify-center">
              <Checkbox 
                checked={selectedItems.has(result.id)}
                onCheckedChange={() => onSelect(result.id)}
              />
            </div>
            <div>{formatNumber(result.stop_loss)}</div>
            <div>{formatNumber(result.target_price)}</div>
            <div>{formatNumber(result.entry_point_price)}</div>
            <div>{formatNumber(result.exit_price)}</div>
            <div className={`font-medium ${result.is_success ? 'text-success' : 'text-destructive'}`}>
              {result.profit_loss !== null ? formatNumber(result.profit_loss) : 'N/A'}
            </div>
            <div className="truncate">
              {currentTradingViewPrice ? formatNumber(currentTradingViewPrice) : "-"}
            </div>
            <div className="flex justify-center">
              {result.direction && (
                <DirectionIndicator direction={result.direction === "up" ? "صاعد" : result.direction === "down" ? "هابط" : "محايد"} />
              )}
            </div>
            <div className="truncate">
              {formatCreationDate(result.created_at)}
            </div>
            <div>{result.timeframe}</div>
            <div>{result.analysis_type}</div>
            <div>{result.symbol}</div>
            <div>
              {result.result_timestamp && 
                format(new Date(result.result_timestamp), 'PPpp', { locale: ar })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
