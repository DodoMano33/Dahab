
import { Checkbox } from "@/components/ui/checkbox";
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";
import { formatDateArabic } from "@/utils/technicalAnalysis/timeUtils";
import { TableCell } from "./TableCell";

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

  // دالة لتنسيق الربح/الخسارة بحيث تظهر إشارة سالب للخسارة فقط
  const formatProfitLoss = (value: number | null | undefined, isSuccess: boolean) => {
    if (value === null || value === undefined) return "-";
    
    // إظهار القيمة المطلقة للتحليلات الناجحة وإضافة إشارة سالب للفاشلة
    const formattedValue = Number(Math.abs(value)).toFixed(3);
    return isSuccess ? formattedValue : `-${formattedValue}`;
  };

  const displayedAnalysisType = getStrategyName(analysis.analysis_type);

  return (
    <div
      className={`grid grid-cols-12 gap-1 p-2 items-center text-right hover:bg-muted/50 transition-colors ${
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
      <div className={`font-medium truncate ${analysis.is_success ? 'text-success' : 'text-destructive'}`}>
        {analysis.is_success ? 'ناجح' : 'فاشل'}
      </div>
      <TableCell 
        label="الربح/الخسارة" 
        value={formatProfitLoss(analysis.profit_loss, analysis.is_success)} 
        className={`truncate ${analysis.is_success ? 'text-success' : 'text-destructive'}`}
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
