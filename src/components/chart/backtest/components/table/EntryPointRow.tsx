
import { Checkbox } from "@/components/ui/checkbox";
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";
import { formatDateArabic } from "@/utils/technicalAnalysis/timeUtils";
import { DirectionIndicator } from "@/components/chart/history/DirectionIndicator";

interface EntryPointRowProps {
  result: any;
  selected: boolean;
  onSelect: (id: string) => void;
  currentPrice: number | null;
}

export const EntryPointRow = ({ 
  result, 
  selected,
  onSelect,
  currentPrice
}: EntryPointRowProps) => {
  // دالة لتنسيق الأرقام لتظهر 3 أرقام فقط بعد الفاصلة
  const formatNumber = (value: number | string | null | undefined) => {
    if (value === null || value === undefined) return "-";
    const num = typeof value === "string" ? parseFloat(value) : value;
    return Number(num).toFixed(3);
  };

  // حساب الربح/الخسارة
  const calculateProfitLoss = () => {
    if (!result.entry_price || !result.exit_price) return "-";
    
    const entryPrice = parseFloat(result.entry_price);
    const exitPrice = parseFloat(result.exit_price);
    let profitLoss = 0;
    
    if (result.direction === 'صاعد') {
      // للاتجاه الصاعد: الربح عند ارتفاع السعر
      profitLoss = exitPrice - entryPrice;
    } else {
      // للاتجاه الهابط: الربح عند انخفاض السعر
      profitLoss = entryPrice - exitPrice;
    }
    
    // تنسيق القيمة
    const formattedValue = Math.abs(profitLoss).toFixed(3);
    
    // إضافة إشارة سالب للخسائر
    return profitLoss < 0 ? `-${formattedValue}` : formattedValue;
  };

  // حساب الربح/الخسارة
  const profitLossValue = calculateProfitLoss();
  
  // تحديد لون النص بناءً على نجاح/فشل التحليل
  const profitLossClass = result.is_success ? 'text-success' : 'text-destructive';
  
  // الحصول على اسم نوع التحليل
  const displayedAnalysisType = getStrategyName(result.analysis_type);

  return (
    <div
      className={`grid grid-cols-12 gap-4 p-4 items-center text-right hover:bg-muted/50 transition-colors ${
        result.is_success ? 'bg-success/10' : 'bg-destructive/10'
      }`}
    >
      <div className="flex justify-center">
        <Checkbox 
          checked={selected}
          onCheckedChange={() => onSelect(result.id)}
        />
      </div>
      <div className="truncate">{displayedAnalysisType}</div>
      <div className="truncate">{result.symbol}</div>
      <div className="truncate">{result.timeframe}</div>
      <div className="flex justify-center">
        <DirectionIndicator direction={result.direction || "محايد"} />
      </div>
      <div className={`truncate ${profitLossClass}`}>{profitLossValue}</div>
      <div className="truncate">{formatNumber(result.exit_price)}</div>
      <div className="truncate">{formatNumber(result.entry_price)}</div>
      <div className="truncate">{formatNumber(result.target_price)}</div>
      <div className="truncate">{formatNumber(result.stop_loss)}</div>
      <div className="truncate">{formatDateArabic(result.result_timestamp)}</div>
      <div className="text-center font-bold text-primary">
        {currentPrice ? formatNumber(currentPrice) : "-"}
      </div>
    </div>
  );
};
