
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface BestEntryPointTableProps {
  results: any[];
  selectedItems: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelect: (id: string) => void;
}

export const BestEntryPointTable = ({
  results,
  selectedItems,
  onSelectAll,
  onSelect,
}: BestEntryPointTableProps) => {
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
  
  // دالة لتنسيق الأرقام
  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "-";
    return Number(value).toFixed(3);
  };
  
  // دالة لتنسيق التاريخ بالشكل المطلوب
  const formatDate = (timestamp: string | null) => {
    if (!timestamp) return "-";
    
    const date = new Date(timestamp);
    return format(date, 'dd/M/yyyy HH:mm');
  };
  
  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <div className="grid grid-cols-11 gap-4 p-4 bg-muted/50 text-right text-sm font-medium border-b sticky top-0 z-40">
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
        <div>الاطار الزمني</div>
        <div>نوع التحليل</div>
        <div>الرمز</div>
        <div>تاريخ النتيجة</div>
        <div className="text-center font-semibold text-primary">السعر الحالي</div>
      </div>
      <div className="divide-y">
        {results.map((result) => (
          <div
            key={result.id}
            className={`grid grid-cols-11 gap-4 p-4 items-center text-right hover:bg-muted/50 transition-colors bg-success/10`}
          >
            <div className="flex justify-center">
              <Checkbox 
                checked={selectedItems.has(result.id)}
                onCheckedChange={() => onSelect(result.id)}
              />
            </div>
            <div>{result.stop_loss}</div>
            <div>{result.target_price}</div>
            <div>{result.entry_point_price}</div>
            <div>{result.exit_price}</div>
            <div className="font-medium text-success">
              {result.profit_loss !== null ? result.profit_loss.toFixed(4) : 'N/A'}
            </div>
            <div>{result.timeframe}</div>
            <div>{result.analysis_type}</div>
            <div>{result.symbol}</div>
            <div>
              {formatDate(result.result_timestamp)}
            </div>
            <div className="text-center font-bold text-primary">
              {currentPrice ? formatNumber(currentPrice) : "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
