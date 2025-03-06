
import { TableRow } from "@/components/ui/table";
import { DateCell } from "./cells/DateCell";
import { TimeframeCell } from "./cells/TimeframeCell";
import { AnalysisTypeCell } from "./cells/AnalysisTypeCell";
import { DirectionIndicator } from "./DirectionIndicator";
import { StopLoss } from "./StopLoss";
import { TargetsList } from "./TargetsList";
import { BestEntryPoint } from "./BestEntryPoint";
import { ExpiryTimer } from "./ExpiryTimer";
import { AnalysisData } from "@/types/analysis";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { RowCheckbox } from "./row/RowCheckbox";
import { MarketStatusCell } from "./row/MarketStatusCell";
import { LastCheckedCell } from "./row/LastCheckedCell";
import { CurrentPriceCell } from "./row/CurrentPriceCell";
import { SymbolCell } from "./row/SymbolCell";

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
  
  // Debug logging
  console.log(`HistoryRow for ${id}: analysisType=${analysisType}, pattern=${analysis.pattern}, activation_type=${analysis.activation_type}`);
  console.log(`Last checked at for ${id}:`, last_checked_at, typeof last_checked_at);
  
  // Use the pattern from the analysis data to display the real analysis type
  const displayAnalysisType = analysis.pattern === "فيبوناتشي ريتريسمينت وإكستينشين" 
    ? "فيبوناتشي" 
    : analysis.pattern === "تحليل فيبوناتشي متقدم" 
      ? "تحليل فيبوناتشي متقدم" 
      : analysisType;
  
  // Listen for real-time updates from the database
  useEffect(() => {
    const channel = supabase
      .channel(`search_history_row_${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'search_history',
          filter: `id=eq.${id}`
        },
        (payload) => {
          console.log(`[${id}] Realtime update received for row:`, payload);
          
          // The parent component (HistoryContent) will handle the actual update
          const event = new CustomEvent('historyUpdated');
          window.dispatchEvent(event);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  return (
    <TableRow className="text-xs">
      <RowCheckbox isSelected={isSelected} onSelect={onSelect} />
      <MarketStatusCell />
      <LastCheckedCell 
        id={id}
        last_checked_price={last_checked_price}
        last_checked_at={last_checked_at}
      />
      <ExpiryTimer 
        createdAt={date} 
        analysisId={id} 
        durationHours={analysis_duration_hours}
      />
      <BestEntryPoint 
        price={analysis.bestEntryPoint?.price}
        reason={analysis.bestEntryPoint?.reason}
      />
      <TargetsList 
        targets={analysis.targets || []} 
        isTargetHit={false}
      />
      <StopLoss 
        value={analysis.stopLoss} 
        isHit={false}
      />
      <DirectionIndicator direction={analysis.direction} />
      <CurrentPriceCell price={currentPrice} />
      <AnalysisTypeCell 
        analysisType={displayAnalysisType} 
        pattern={analysis.pattern}
        activation_type={analysis.activation_type}
      />
      <TimeframeCell timeframe={timeframe} />
      <DateCell date={date} />
      <SymbolCell symbol={symbol} />
    </TableRow>
  );
};
