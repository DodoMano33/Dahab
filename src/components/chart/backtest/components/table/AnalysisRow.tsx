
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDateArabic, formatTimeDuration } from "@/utils/technicalAnalysis/timeUtils";
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";
import { DirectionIndicator } from "@/components/chart/history/DirectionIndicator";
import { useEffect, useState } from "react";

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
  const [livePrice, setLivePrice] = useState<number | undefined>(current_price);

  // الاستماع لتحديثات سعر Alpha Vantage
  useEffect(() => {
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        setLivePrice(event.detail.price);
      }
    };

    window.addEventListener('alpha-vantage-price-update', handlePriceUpdate as EventListener);
    
    return () => {
      window.removeEventListener('alpha-vantage-price-update', handlePriceUpdate as EventListener);
    };
  }, []);

  // تحديث السعر عند تغير الـ prop
  useEffect(() => {
    if (current_price !== undefined) {
      setLivePrice(current_price);
    }
  }, [current_price]);

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
  
  // حساب مدة بقاء التحليل بتنسيق ساعات:دقائق
  const getAnalysisDuration = () => {
    if (!created_at || !result_timestamp) return "-";
    
    return formatTimeDuration(created_at, result_timestamp);
  };
  
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
        {is_success ? <span className="text-success font-medium">ناجح</span> : <span className="text-destructive font-medium">فاشل</span>}
      </TableCell>
      <TableCell className="text-center p-2">
        {getAnalysisDuration()}
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
        {livePrice ? formatNumber(livePrice) : "-"}
      </TableCell>
    </TableRow>
  );
};
