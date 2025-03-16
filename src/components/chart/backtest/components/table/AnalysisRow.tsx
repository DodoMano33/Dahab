
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatResultDate, formatCreatedAtDate } from "@/utils/technicalAnalysis/timeUtils";
import { DirectionIndicator } from "@/components/chart/history/DirectionIndicator";
import { Checkbox } from "@/components/ui/checkbox";

// تعريف الواجهة مع الفصل الواضح بين حقلي تاريخ الإنشاء وتاريخ النتيجة
interface AnalysisRowProps {
  id: string;
  symbol: string;
  entry_price?: number;
  exit_price?: number;
  target_price?: number;
  stop_loss?: number;
  direction?: "صاعد" | "هابط" | "محايد" | string;
  profit_loss?: number;
  is_success?: boolean;
  analysisType?: string;
  timeframe?: string;
  // تاريخ إنشاء التحليل
  created_at?: string;
  // تاريخ نتيجة التحليل (مختلف عن تاريخ الإنشاء)
  result_timestamp?: string;
  // For selection in backtest results
  selected?: boolean;
  onSelect?: () => void;
  current_price?: number;
}

export const AnalysisRow = ({
  id,
  symbol,
  entry_price = 0,
  exit_price = 0,
  target_price = 0,
  stop_loss = 0,
  direction = "",
  profit_loss = 0,
  is_success = false,
  analysisType = "",
  timeframe = "",
  created_at,
  result_timestamp,
  selected = false,
  onSelect,
  current_price = 0
}: AnalysisRowProps) => {
  // تنسيق التواريخ باستخدام الدوال المخصصة
  const formattedCreatedDate = formatCreatedAtDate(created_at);
  const formattedResultDate = formatResultDate(result_timestamp);

  // تحويل الاتجاه إلى قيمة عربية إذا لم تكن كذلك بالفعل
  const safeDirection: "صاعد" | "هابط" | "محايد" = 
    (direction === "صاعد" || direction === "هابط" || direction === "محايد") 
      ? direction as "صاعد" | "هابط" | "محايد"
      : direction === "up" || direction === "bullish" 
        ? "صاعد" 
        : direction === "down" || direction === "bearish" 
          ? "هابط" 
          : "محايد";

  // طباعة قيم تواريخ النتيجة للتأكد من صحتها
  console.log(`Row ${id} timestamps:`, { created_at, result_timestamp, formattedResultDate });

  return (
    <TableRow className="text-center hover:bg-muted/50">
      {onSelect && (
        <TableCell className="text-center">
          <Checkbox 
            checked={selected} 
            onCheckedChange={onSelect}
            aria-label="Select row"
          />
        </TableCell>
      )}
      
      {/* تاريخ التحليل */}
      <TableCell className="text-center">
        {formattedCreatedDate}
      </TableCell>
      
      {/* نوع التحليل */}
      <TableCell className="text-center">
        {analysisType}
      </TableCell>
      
      {/* الرمز */}
      <TableCell className="font-medium text-center">
        {symbol}
      </TableCell>
      
      {/* الإطار الزمني */}
      <TableCell className="text-center">
        {timeframe}
      </TableCell>
      
      {/* النتيجة */}
      <TableCell className="text-center">
        <Badge variant={is_success ? "success" : "destructive"}>
          {is_success ? "ناجح" : "غير ناجح"}
        </Badge>
      </TableCell>
      
      {/* وقف الخسارة */}
      <TableCell className="text-center">
        {stop_loss.toFixed(2)}
      </TableCell>
      
      {/* الهدف */}
      <TableCell className="text-center">
        {target_price.toFixed(2)}
      </TableCell>
      
      {/* سعر الدخول */}
      <TableCell className="text-center">
        {entry_price.toFixed(2)}
      </TableCell>
      
      {/* الاتجاه */}
      <TableCell className="text-center">
        <DirectionIndicator direction={safeDirection} />
      </TableCell>
      
      {/* الربح/الخسارة */}
      <TableCell className="text-center">
        <Badge variant={profit_loss > 0 ? "success" : "destructive"} className="justify-center w-full">
          {profit_loss.toFixed(2)}
        </Badge>
      </TableCell>
      
      {/* تاريخ النتيجة */}
      <TableCell className="text-center">
        {formattedResultDate}
      </TableCell>
      
      {/* السعر الحالي (إضافة عمود جديد) */}
      <TableCell className="text-center">
        {exit_price > 0 ? exit_price.toFixed(2) : (current_price > 0 ? current_price.toFixed(2) : "—")}
      </TableCell>
    </TableRow>
  );
};
