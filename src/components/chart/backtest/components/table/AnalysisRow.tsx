
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDateArabic } from "@/utils/technicalAnalysis/timeUtils";
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";
import { DirectionIndicator } from "@/components/chart/history/DirectionIndicator";

interface AnalysisRowProps {
  id: string;
  symbol: string;
  entry_price: number;
  target_price: number;
  stop_loss: number;
  direction: "صاعد" | "هابط" | "محايد";
  profit_loss: number;
  is_success: boolean;
  analysisType: string;
  timeframe: string;
  created_at: string;
  result_timestamp: string;
  selected?: boolean;
  onSelect?: () => void;
  exit_price?: number;
  current_price?: number;
}

export const AnalysisRow = ({
  id,
  symbol,
  entry_price,
  exit_price,
  target_price,
  stop_loss,
  direction,
  profit_loss,
  is_success,
  analysisType,
  timeframe,
  created_at,
  result_timestamp,
  selected,
  onSelect,
  current_price
}: AnalysisRowProps) => {
  // Format numbers for display with 2 decimal places
  const formatNumber = (num: number) => {
    return num !== undefined && num !== null ? Number(num).toFixed(2) : "-";
  };
  
  // Calculate profit/loss color
  const getProfitLossClass = () => {
    if (profit_loss === 0) return "text-gray-500";
    return profit_loss > 0 ? "text-success font-medium" : "text-destructive font-medium";
  };
  
  // Convert analysis type to readable format
  const displayedAnalysisType = getStrategyName(analysisType);
  
  return (
    <TableRow
      key={id}
      className={is_success ? "bg-success/10" : "bg-destructive/10"}
    >
      {onSelect && (
        <TableCell className="text-center w-[40px] p-2">
          <Checkbox
            checked={selected}
            onCheckedChange={onSelect}
            aria-label="Select row"
          />
        </TableCell>
      )}
      <TableCell className="text-center p-2">
        {formatDateArabic(created_at)}
      </TableCell>
      <TableCell className="text-center p-2">
        {displayedAnalysisType}
      </TableCell>
      <TableCell className="text-center p-2">{symbol}</TableCell>
      <TableCell className="text-center p-2">{timeframe}</TableCell>
      <TableCell className="text-center p-2">
        <DirectionIndicator direction={direction || "محايد"} />
      </TableCell>
      <TableCell className="text-center p-2">
        {is_success ? "ناجح" : "غير ناجح"}
      </TableCell>
      <TableCell className="text-center p-2">
        {result_timestamp ? formatDateArabic(result_timestamp) : "-"}
      </TableCell>
      <TableCell className={`text-center p-2 ${getProfitLossClass()}`}>
        {formatNumber(profit_loss)}
      </TableCell>
      <TableCell className="text-center p-2">{formatNumber(entry_price)}</TableCell>
      <TableCell className="text-center p-2">{formatNumber(target_price)}</TableCell>
      <TableCell className="text-center p-2">{formatNumber(stop_loss)}</TableCell>
      <TableCell className="text-center p-2">{formatNumber(target_price)}</TableCell>
      <TableCell className="text-center p-2">
        {result_timestamp ? formatDateArabic(result_timestamp) : "-"}
      </TableCell>
      <TableCell className="text-center p-2 font-bold text-primary">
        {current_price ? formatNumber(current_price) : "-"}
      </TableCell>
    </TableRow>
  );
};
