
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
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LastCheckedCell } from "./cells/LastCheckedCell";

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
  last_checked_at?: Date | string | null;
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
  
  // تشخيص وقت آخر فحص
  console.log(`Last checked at for ${id}:`, last_checked_at, typeof last_checked_at);
  
  // Use the pattern from the analysis data to display the real analysis type
  // This helps when the database type is mapped but we want to show the original
  const displayAnalysisType = analysis.pattern === "فيبوناتشي ريتريسمينت وإكستينشين" 
    ? "فيبوناتشي" 
    : analysis.pattern === "تحليل فيبوناتشي متقدم" 
      ? "تحليل فيبوناتشي متقدم" 
      : analysisType;
  
  // تحديث حالة السوق كل 5 دقائق
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
    
    const interval = setInterval(checkMarketStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // الاستماع للتحديثات في الوقت الحقيقي
  useEffect(() => {
    const handleHistoryUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log(`[${id}] HistoryRow detected update event:`, customEvent.detail?.timestamp || "No timestamp");
    };
    
    window.addEventListener('historyUpdated', handleHistoryUpdate);
    return () => {
      window.removeEventListener('historyUpdated', handleHistoryUpdate);
    };
  }, [id]);

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
      <TableCell className="w-24 p-2">
        <LastCheckedCell 
          price={last_checked_price}
          timestamp={last_checked_at} 
          itemId={id}
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
        <BestEntryPoint 
          price={analysis.bestEntryPoint?.price}
          reason={analysis.bestEntryPoint?.reason}
        />
      </TableCell>
      <TableCell className="w-24 p-2">
        <TargetsList 
          targets={analysis.targets || []} 
          isTargetHit={false}
        />
      </TableCell>
      <TableCell className="w-20 p-2">
        <StopLoss 
          value={analysis.stopLoss} 
          isHit={false}
        />
      </TableCell>
      <TableCell className="w-16 p-2"><DirectionIndicator direction={analysis.direction} /></TableCell>
      <TableCell className="w-16 p-2 text-center">{currentPrice}</TableCell>
      <TableCell className="w-28 p-2">
        <AnalysisTypeCell 
          analysisType={displayAnalysisType} 
          pattern={analysis.pattern}
          activation_type={analysis.activation_type}
        />
      </TableCell>
      <TimeframeCell timeframe={timeframe} />
      <DateCell date={date} />
      <TableCell className="font-medium w-16 p-2">{symbol}</TableCell>
    </TableRow>
  );
};
