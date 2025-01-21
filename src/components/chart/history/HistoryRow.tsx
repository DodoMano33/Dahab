import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DirectionIndicator } from "./DirectionIndicator";
import { BestEntryPoint } from "./BestEntryPoint";
import { TargetsList } from "./TargetsList";
import { StopLoss } from "./StopLoss";
import { AnalysisData } from "@/types/analysis";
import { DateCell } from "./cells/DateCell";
import { AnalysisTypeCell } from "./cells/AnalysisTypeCell";
import { TimeframeCell } from "./cells/TimeframeCell";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { differenceInHours, differenceInMinutes, addHours } from "date-fns";
import { supabase } from "@/lib/supabase";

interface HistoryRowProps {
  id: string;
  date: Date;
  symbol: string;
  currentPrice: number;
  analysis: AnalysisData;
  analysisType: "عادي" | "سكالبينج" | "ذكي" | "SMC" | "ICT" | "Turtle Soup" | "Gann" | "Waves" | "Patterns" | "Price Action";
  timeframe: string;
  isSelected?: boolean;
  onSelect?: () => void;
  target_hit?: boolean;
  stop_loss_hit?: boolean;
  analysis_expiry_date?: Date;
}

export const HistoryRow = ({ 
  id,
  date, 
  symbol, 
  currentPrice, 
  analysis,
  analysisType,
  timeframe,
  isSelected,
  onSelect,
  target_hit = false,
  stop_loss_hit = false,
  analysis_expiry_date
}: HistoryRowProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      if (!analysis_expiry_date) {
        // If no expiry date is set, set it to 72 hours from creation
        const expiryDate = addHours(new Date(date), 72);
        analysis_expiry_date = expiryDate;
      }

      const now = new Date();
      const expiryDate = new Date(analysis_expiry_date);
      
      if (now >= expiryDate) {
        setIsExpired(true);
        // Delete the expired analysis
        const deleteExpiredAnalysis = async () => {
          try {
            const { error } = await supabase
              .from('search_history')
              .delete()
              .eq('id', id);

            if (error) {
              console.error("Error deleting expired analysis:", error);
            }
          } catch (error) {
            console.error("Error in deleteExpiredAnalysis:", error);
          }
        };
        deleteExpiredAnalysis();
        return;
      }

      const hoursLeft = differenceInHours(expiryDate, now);
      const minutesLeft = differenceInMinutes(expiryDate, now) % 60;

      // Format as digital clock: HH:MM
      const formattedHours = String(hoursLeft).padStart(2, '0');
      const formattedMinutes = String(minutesLeft).padStart(2, '0');
      setTimeLeft(`${formattedHours}:${formattedMinutes}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [analysis_expiry_date, date, id]);

  if (isExpired) {
    return null; // Don't render expired analyses
  }

  const rowBackgroundColor = cn(
    "transition-colors duration-200",
    target_hit && "bg-green-50 hover:bg-green-100",
    stop_loss_hit && "bg-red-50 hover:bg-red-100"
  );

  const statusIndicator = cn(
    "h-1 w-full mt-1 rounded-full",
    target_hit && "bg-green-500",
    stop_loss_hit && "bg-red-500"
  );

  return (
    <TableRow className={rowBackgroundColor}>
      {onSelect !== undefined && (
        <TableCell className="w-[60px] text-center p-2">
          <Checkbox checked={isSelected} onCheckedChange={onSelect} />
        </TableCell>
      )}
      <DateCell date={date} />
      <TableCell className="w-[100px] text-center p-2 font-medium">
        <div className="flex flex-col items-center">
          <span>{symbol.toUpperCase()}</span>
          <div className={statusIndicator} />
        </div>
      </TableCell>
      <AnalysisTypeCell 
        analysisType={analysisType} 
        pattern={analysis.pattern}
        activation_type={analysis.activation_type}
      />
      <TimeframeCell timeframe={timeframe} />
      <TableCell className="w-[120px] text-center p-2">{currentPrice}</TableCell>
      <TableCell className="w-[80px] text-center p-2">
        <DirectionIndicator direction={analysis.direction} />
      </TableCell>
      <TableCell className="w-[160px] text-center p-2 whitespace-normal">
        <div className="flex justify-center">
          <BestEntryPoint 
            price={analysis.bestEntryPoint?.price} 
            reason={analysis.bestEntryPoint?.reason}
          />
        </div>
      </TableCell>
      <TableCell className="w-[140px] text-center p-2 whitespace-normal">
        <div className="flex justify-center">
          <TargetsList 
            targets={analysis.targets?.slice(0, 3) || []} 
            isTargetHit={target_hit}
          />
        </div>
      </TableCell>
      <TableCell className="w-[120px] text-center p-2 whitespace-normal">
        <StopLoss 
          value={analysis.stopLoss} 
          isHit={stop_loss_hit}
        />
      </TableCell>
      <TableCell className="w-[100px] text-center p-2">
        <Badge variant="secondary" className="font-mono text-base bg-black text-white">
          {timeLeft}
        </Badge>
      </TableCell>
    </TableRow>
  );
};