
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatResultDate, formatCreatedAtDate } from "@/utils/technicalAnalysis/timeUtils";
import { DirectionIndicator } from "@/components/chart/history/DirectionIndicator";

// تعريف الواجهة مع الفصل الواضح بين حقلي تاريخ الإنشاء وتاريخ النتيجة
interface AnalysisRowProps {
  id: string;
  symbol: string;
  entry_price?: number;
  exit_price?: number;
  target_price?: number;
  stop_loss?: number;
  direction?: string;
  profit_loss?: number;
  is_success?: boolean;
  analysisType?: string;
  timeframe?: string;
  // تاريخ إنشاء التحليل
  created_at?: string;
  // تاريخ نتيجة التحليل (مختلف عن تاريخ الإنشاء)
  result_timestamp?: string;
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
  result_timestamp
}: AnalysisRowProps) => {
  // طباعة سجلات تشخيصية لفهم المزيد عن البيانات المستلمة
  console.log(`AnalysisRow - ID: ${id}, DateInfo:`, {
    created_at,
    result_timestamp,
    created_at_type: typeof created_at,
    result_timestamp_type: typeof result_timestamp
  });

  // تنسيق التواريخ باستخدام الدوال المخصصة
  const formattedCreatedDate = formatCreatedAtDate(created_at);
  const formattedResultDate = formatResultDate(result_timestamp);

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium text-center">
        {symbol}
      </TableCell>
      
      <TableCell className="text-center">
        <Badge variant={profit_loss > 0 ? "success" : "destructive"} className="justify-center w-full">
          {profit_loss.toFixed(2)}
        </Badge>
      </TableCell>
      
      <TableCell className="text-center">
        <DirectionIndicator direction={direction} />
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
      <TableCell className="text-center text-xs">
        {formattedCreatedDate}
      </TableCell>
      
      {/* عرض تاريخ نتيجة التحليل (مختلف عن تاريخ الإنشاء) */}
      <TableCell className="text-center text-xs">
        {formattedResultDate}
      </TableCell>
    </TableRow>
  );
};
