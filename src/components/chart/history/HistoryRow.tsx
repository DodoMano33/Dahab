
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
    <TableRow>
      {onSelect && (
        <TableCell className="w-12">
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={onSelect}
            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
        </TableCell>
      )}
      <TableCell className="font-medium">{symbol}</TableCell>
      <TableCell><DateCell date={date} /></TableCell>
      <TableCell><TimeframeCell timeframe={timeframe} /></TableCell>
      <TableCell>
        <AnalysisTypeCell 
          analysisType={analysisType} 
          pattern={analysis.pattern}
          activation_type={analysis.activation_type}
        />
      </TableCell>
      <TableCell>{currentPrice}</TableCell>
      <TableCell><DirectionIndicator direction={analysis.direction} /></TableCell>
      <TableCell>
        <StopLoss 
          value={analysis.stopLoss} 
          isHit={false}
        />
      </TableCell>
      <TableCell>
        <TargetsList 
          targets={analysis.targets || []} 
          isTargetHit={false}
        />
      </TableCell>
      <TableCell>
        <BestEntryPoint 
          price={analysis.bestEntryPoint?.price}
          reason={analysis.bestEntryPoint?.reason}
        />
      </TableCell>
      <TableCell>
        <ExpiryTimer 
          createdAt={date} 
          analysisId={id} 
          durationHours={analysis_duration_hours}
        />
      </TableCell>
      <TableCell>
        {last_checked_price ? (
          <div className="text-xs">
            <div>{last_checked_price}</div>
            {last_checked_at && (
              <div className="text-muted-foreground">
                {formatDistanceToNow(new Date(last_checked_at), { 
                  addSuffix: true,
                  locale: ar
                })}
              </div>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">لم يتم الفحص</span>
        )}
      </TableCell>
      <TableCell>
        <div className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${marketStatus.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {marketStatus.isOpen ? 'مفتوح' : 'مغلق'}
        </div>
      </TableCell>
    </TableRow>
  );
};
