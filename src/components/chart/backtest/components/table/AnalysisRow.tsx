
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
  onSelect
}: AnalysisRowProps) => {
  // تنسيق التواريخ باستخدام الدوال المخصصة
  const formattedCreatedDate = formatCreatedAtDate(created_at);
  const formattedResultDate = formatResultDate(result_timestamp);

  // Convert direction to an acceptable value if it's not already
  const safeDirection: "صاعد" | "هابط" | "محايد" = 
    (direction === "صاعد" || direction === "هابط" || direction === "محايد") 
      ? direction as "صاعد" | "هابط" | "محايد"
      : direction === "up" || direction === "bullish" 
        ? "صاعد" 
        : direction === "down" || direction === "bearish" 
          ? "هابط" 
          : "محايد";

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
      
      <TableCell className="font-medium text-center">
        {symbol}
      </TableCell>
      
      <TableCell className="text-center">
        <Badge variant={profit_loss > 0 ? "success" : "destructive"} className="justify-center w-full">
          {profit_loss.toFixed(2)}
        </Badge>
      </TableCell>
      
      <TableCell className="text-center">
        <DirectionIndicator direction={safeDirection} />
      </TableCell>
      
      <TableCell className="text-center">
        {entry_price.toFixed(2)}
      </TableCell>
      
      <TableCell className="text-center">
        {exit_price.toFixed(2)}
      </TableCell>
      
      <TableCell className="text-center">
        {target_price.toFixed(2)}
      </TableCell>
      
      <TableCell className="text-center">
        {stop_loss.toFixed(2)}
      </TableCell>
      
      <TableCell className="text-center">
        <Badge variant={is_success ? "success" : "destructive"}>
          {is_success ? "ناجح" : "غير ناجح"}
        </Badge>
      </TableCell>
      
      <TableCell className="text-center">
        {timeframe}
      </TableCell>
      
      <TableCell className="text-center">
        {analysisType}
      </TableCell>
      
      {/* عرض تاريخ إنشاء التحليل */}
      <TableCell className="text-center">
        {formattedCreatedDate}
      </TableCell>
      
      {/* عرض تاريخ نتيجة التحليل (مختلف عن تاريخ الإنشاء) */}
      <TableCell className="text-center">
        {formattedResultDate}
      </TableCell>
    </TableRow>
  );
};
