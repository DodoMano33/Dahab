import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DateCell } from "./cells/DateCell";
import { TimeframeCell } from "./cells/TimeframeCell";
import { AnalysisTypeCell } from "./cells/AnalysisTypeCell";
import { DirectionIndicator } from "./DirectionIndicator";
import { StopLoss } from "./StopLoss";
import { TargetsList } from "./TargetsList";
import { BestEntryPoint } from "./BestEntryPoint";
import { ExpiryTimer } from "./ExpiryTimer";
import { AnalysisData } from "@/types/analysis";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HistoryRowProps {
  id: string;
  date: Date;
  symbol: string;
  currentPrice: number;
  analysis: AnalysisData;
  analysisType: string;
  timeframe: string;
  isSelected?: boolean;
  onSelect?: () => void;
  analysis_duration_hours?: number;
  last_checked_price?: number;
  last_checked_at?: Date;
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
  analysis_duration_hours,
  last_checked_price,
  last_checked_at,
}: HistoryRowProps) => {
  const [marketStatus, setMarketStatus] = useState<{isOpen: boolean, serverTime?: string}>({ isOpen: false });
  
  // طباعة نوع التحليل للتشخيص
  console.log(`HistoryRow for ${id}: analysisType=${analysisType}, pattern=${analysis.pattern}, activation_type=${analysis.activation_type}`);
  
  // Use the pattern from the analysis data to display the real analysis type
  // This helps when the database type is mapped but we want to show the original
  const displayAnalysisType = analysis.pattern === "فيبوناتشي ريتريسمينت وإكستينشين" 
    ? "فيبوناتشي" 
    : analysis.pattern === "تحليل فيبوناتشي متقدم" 
      ? "تحليل فيبوناتشي متقدم" 
      : analysisType;
  
  useEffect(() => {
    const checkMarketStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-market-status');
        if (error) {
          console.error("Error checking market status:", error);
          return;
        }
        setMarketStatus(data);
      } catch (err) {
        console.error("Failed to check market status:", err);
      }
    };
    
    checkMarketStatus();
    
    // Check market status every 5 minutes
    const interval = setInterval(checkMarketStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TableRow className="text-xs">
      {onSelect && (
        <TableCell className="w-10 p-2">
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={onSelect}
            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
        </TableCell>
      )}
      <TableCell className="font-medium w-16 p-2">{symbol}</TableCell>
      <DateCell date={date} />
      <TimeframeCell timeframe={timeframe} />
      <AnalysisTypeCell 
        analysisType={displayAnalysisType} 
        pattern={analysis.pattern}
        activation_type={analysis.activation_type}
      />
      <TableCell className="w-16 p-2 text-center">{currentPrice}</TableCell>
      <TableCell className="w-16 p-2"><DirectionIndicator direction={analysis.direction} /></TableCell>
      <TableCell className="w-20 p-2">
        <StopLoss 
          value={analysis.stopLoss} 
          isHit={false}
        />
      </TableCell>
      <TableCell className="w-24 p-2">
        <TargetsList 
          targets={analysis.targets || []} 
          isTargetHit={false}
        />
      </TableCell>
      <TableCell className="w-24 p-2">
        <BestEntryPoint 
          price={analysis.bestEntryPoint?.price}
          reason={analysis.bestEntryPoint?.reason}
        />
      </TableCell>
      <TableCell className="w-20 p-2">
        <ExpiryTimer 
          createdAt={date} 
          analysisId={id} 
          durationHours={analysis_duration_hours}
        />
      </TableCell>
      <TableCell className="w-24 p-2">
        {last_checked_price ? (
          <div className="text-xs">
            <div>{last_checked_price}</div>
            {last_checked_at && (
              <div className="text-muted-foreground text-[10px]">
                {formatDistanceToNow(new Date(last_checked_at), { 
                  addSuffix: true,
                  locale: ar
                })}
              </div>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground text-[10px]">لم يتم الفحص</span>
        )}
      </TableCell>
      <TableCell className="w-16 p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`px-1.5 py-0.5 rounded-full text-[10px] inline-flex items-center justify-center w-14 ${marketStatus.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {marketStatus.isOpen ? 'مفتوح' : 'مغلق'}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{marketStatus.isOpen ? 'السوق مفتوح حالياً' : 'السوق مغلق حالياً'}</p>
              {marketStatus.serverTime && <p className="text-xs mt-1">وقت الخادم: {marketStatus.serverTime}</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
    </TableRow>
  );
};
