
import { Checkbox } from "@/components/ui/checkbox";
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";
import { formatDateArabic } from "@/utils/technicalAnalysis/timeUtils";
import { DirectionIndicator } from "@/components/chart/history/DirectionIndicator";
import { TableCell } from "./TableCell";

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
    if (!result.entry_point_price || !result.exit_price) return "-";
    
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

  // حساب الربح/الخسارة
  const profitLossValue = calculateProfitLoss();
  
  // تحديد لون النص بناءً على نجاح/فشل التحليل
  const profitLossClass = result.is_success ? 'text-success' : 'text-destructive';
  
  // الحصول على اسم نوع التحليل
  const displayedAnalysisType = getStrategyName(result.analysis_type);

  return (
    <div
      className={`grid grid-cols-13 gap-1 p-2 items-center text-right hover:bg-muted/50 transition-colors ${
        result.is_success ? 'bg-success/10' : 'bg-destructive/10'
      }`}
    >
      <div className="flex justify-center">
        <Checkbox 
          checked={selected}
          onCheckedChange={() => onSelect(result.id)}
        />
      </div>
      <TableCell label="نوع التحليل" value={displayedAnalysisType} />
      <TableCell label="الرمز" value={result.symbol} />
      <TableCell label="الاطار الزمني" value={result.timeframe} />
      <div className="flex justify-center">
        <DirectionIndicator direction={result.direction || "محايد"} />
      </div>
      <TableCell 
        label="الربح/الخسارة" 
        value={profitLossValue} 
        className={`truncate ${profitLossClass}`}
      />
      <TableCell label="سعر الخروج" value={formatNumber(result.exit_price)} />
      <TableCell label="نقطة الدخول" value={formatNumber(result.entry_point_price)} />
      <TableCell label="الهدف الأول" value={formatNumber(result.target_price)} />
      <TableCell label="وقف الخسارة" value={formatNumber(result.stop_loss)} />
      <TableCell label="تاريخ النتيجة" value={formatDateArabic(result.result_timestamp)} />
      <TableCell label="تاريخ إنشاء التحليل" value={formatDateArabic(result.created_at)} />
      <div className="text-center font-bold text-primary">
        {currentPrice ? formatNumber(currentPrice) : "-"}
      </div>
    </div>
  );
};
