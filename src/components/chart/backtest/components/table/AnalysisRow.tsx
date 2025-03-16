
import { Checkbox } from "@/components/ui/checkbox";
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";
import { formatDateArabic } from "@/utils/technicalAnalysis/timeUtils";
import { TableCell } from "./TableCell";
import { DirectionIndicator } from "../../../history/DirectionIndicator";

interface AnalysisRowProps {
  analysis: any;
  selected: boolean;
  onSelect: (id: string) => void;
  currentPrice: number | null;
}

export const AnalysisRow = ({ 
  analysis, 
  selected, 
  onSelect,
  currentPrice
}: AnalysisRowProps) => {
  // دالة لتنسيق الأرقام لتظهر 3 أرقام فقط بعد الفاصلة
  const formatNumber = (value: number | string | null | undefined) => {
    if (value === null || value === undefined) return "-";
    const num = typeof value === "string" ? parseFloat(value) : value;
    return Number(num).toFixed(3);
  };

  // دالة محسنة لحساب وتنسيق الربح/الخسارة
  const calculateProfitLoss = () => {
    if (!analysis.entry_price || !analysis.exit_price) return "-";
    
    // حساب الربح/الخسارة بناءً على الاتجاه والأسعار الفعلية
    const entryPrice = parseFloat(analysis.entry_price);
    const exitPrice = parseFloat(analysis.exit_price);
    let profitLoss = 0;
    
    if (analysis.direction === 'صاعد') {
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

  const displayedAnalysisType = getStrategyName(analysis.analysis_type);

  // حساب الربح/الخسارة
  const profitLossValue = calculateProfitLoss();
  
  // تحديد لون النص بناءً على نجاح/فشل التحليل
  const profitLossClass = analysis.is_success ? 'text-success' : 'text-destructive';

  return (
    <div
      className={`grid grid-cols-13 gap-1 p-2 items-center text-right hover:bg-muted/50 transition-colors ${
        analysis.is_success ? 'bg-success/10' : 'bg-destructive/10'
      }`}
    >
      <div className="flex justify-center">
        <Checkbox 
          checked={selected}
          onCheckedChange={() => onSelect(analysis.id)}
        />
      </div>
      <TableCell 
        label="نوع التحليل" 
        value={displayedAnalysisType} 
      />
      <TableCell 
        label="الرمز" 
        value={analysis.symbol} 
      />
      <TableCell 
        label="الاطار الزمني" 
        value={analysis.timeframe} 
      />
      <div className="flex justify-center items-center">
        <DirectionIndicator direction={analysis.direction || "محايد"} />
      </div>
      <div className={`font-medium truncate ${analysis.is_success ? 'text-success' : 'text-destructive'}`}>
        {analysis.is_success ? 'ناجح' : 'فاشل'}
      </div>
      <TableCell 
        label="الربح/الخسارة" 
        value={profitLossValue} 
        className={`truncate ${profitLossClass}`}
      />
      <TableCell 
        label="السعر عند التحليل" 
        value={formatNumber(analysis.entry_price)} 
      />
      <TableCell 
        label="الهدف الأول" 
        value={formatNumber(analysis.target_price)} 
      />
      <TableCell 
        label="وقف الخسارة" 
        value={formatNumber(analysis.stop_loss)} 
      />
      <TableCell 
        label="أفضل نقطة دخول" 
        value={formatNumber(analysis.best_entry_price || analysis.entry_price)} 
      />
      <TableCell 
        label="تاريخ النتيجة" 
        value={formatDateArabic(analysis.result_timestamp)} 
      />
      <div className="text-center font-bold text-primary">
        {currentPrice ? formatNumber(currentPrice) : "-"}
      </div>
    </div>
  );
};
