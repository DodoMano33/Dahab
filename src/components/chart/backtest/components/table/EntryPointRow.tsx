
import { Checkbox } from "@/components/ui/checkbox";
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";
import { formatDateArabic, formatTimeDuration } from "@/utils/technicalAnalysis/timeUtils";
import { TableCell } from "./TableCell";
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

  // دالة محسنة لحساب وتنسيق الربح/الخسارة
  const calculateProfitLoss = () => {
    if (!result.entry_point_price || !result.exit_price) return "-";
    
    // حساب الربح/الخسارة بناءً على الاتجاه والأسعار الفعلية
    const entryPrice = parseFloat(result.entry_point_price);
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

  // حساب مدة بقاء التحليل بتنسيق ساعات:دقائق
  const calculateAnalysisDuration = () => {
    if (!result.created_at || !result.result_timestamp) return "-";
    
    try {
      return formatTimeDuration(result.created_at, result.result_timestamp);
    } catch (error) {
      console.error("Error calculating analysis duration:", error);
      return "-";
    }
  };

  const displayedAnalysisType = getStrategyName(result.analysis_type);

  // حساب الربح/الخسارة
  const profitLossValue = calculateProfitLoss();
  
  // تحديد لون النص بناءً على نجاح/فشل التحليل
  const profitLossClass = result.is_success ? 'text-success' : 'text-destructive';

  return (
    <div
      className={`grid grid-cols-14 gap-1 p-2 items-center text-right hover:bg-muted/50 transition-colors ${
        result.is_success ? 'bg-success/10' : 'bg-destructive/10'
      }`}
    >
      <div className="flex justify-center">
        <Checkbox 
          checked={selected}
          onCheckedChange={() => onSelect(result.id)}
        />
      </div>
      <TableCell 
        label="تاريخ التحليل" 
        value={formatDateArabic(result.created_at)} 
      />
      <TableCell 
        label="نوع التحليل" 
        value={displayedAnalysisType} 
      />
      <TableCell 
        label="الرمز" 
        value={result.symbol} 
      />
      <TableCell 
        label="الاطار الزمني" 
        value={result.timeframe} 
      />
      <div className="flex justify-center items-center">
        <DirectionIndicator direction={result.direction || "محايد"} />
      </div>
      <TableCell 
        label="النتيجة"
        value={result.is_success ? "ناجح" : "فاشل"}
        className={result.is_success ? "text-success font-medium" : "text-destructive font-medium"}
      />
      <TableCell 
        label="مدة بقاء التحليل" 
        value={calculateAnalysisDuration()} 
      />
      <TableCell 
        label="الربح/الخسارة" 
        value={profitLossValue} 
        className={`truncate ${profitLossClass}`}
      />
      <TableCell 
        label="سعر الدخول" 
        value={formatNumber(result.entry_point_price)} 
      />
      <TableCell 
        label="الهدف" 
        value={formatNumber(result.target_price)} 
      />
      <TableCell 
        label="وقف الخسارة" 
        value={formatNumber(result.stop_loss)} 
      />
      <TableCell 
        label="أفضل نقطة دخول" 
        value={formatNumber(result.entry_point_price)} 
      />
      <TableCell 
        label="تاريخ النتيجة" 
        value={formatDateArabic(result.result_timestamp)} 
      />
      <div className="text-center">
        {currentPrice ? formatNumber(currentPrice) : "-"}
      </div>
    </div>
  );
};
