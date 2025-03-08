
import { TableRow } from "@/components/ui/table";
import { AnalysisData } from "@/types/analysis";
import { useState, useEffect } from "react";
import { CheckboxCell } from "./cells/CheckboxCell";
import { MarketStatusCell } from "./cells/MarketStatusCell";
import { LastCheckedCell } from "./cells/LastCheckedCell";
import { ExpiryTimerCell } from "./cells/ExpiryTimerCell";
import { BestEntryPointCell } from "./cells/BestEntryPointCell";
import { TargetsListCell } from "./cells/TargetsListCell";
import { StopLossCell } from "./cells/StopLossCell";
import { DirectionCell } from "./cells/DirectionCell";
import { CurrentPriceCell } from "./cells/CurrentPriceCell";
import { AnalysisTypeCell } from "./cells/AnalysisTypeCell";
import { TimeframeCell } from "./cells/TimeframeCell";
import { DateCell } from "./cells/DateCell";
import { SymbolCell } from "./cells/SymbolCell";

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
  // تشخيص وقت آخر فحص
  console.log(`Last checked at for ${id}:`, last_checked_at, typeof last_checked_at);
  console.log(`Analysis data for ${id}:`, analysis);
  console.log(`Analysis type for ${id}:`, analysisType);
  
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
      <CheckboxCell isSelected={isSelected} onSelect={onSelect} />
      <MarketStatusCell itemId={id} />
      <LastCheckedCell 
        price={last_checked_price}
        timestamp={last_checked_at} 
        itemId={id}
      />
      <ExpiryTimerCell 
        createdAt={date} 
        analysisId={id} 
        durationHours={analysis_duration_hours}
      />
      <BestEntryPointCell 
        price={analysis.bestEntryPoint?.price}
        reason={analysis.bestEntryPoint?.reason}
      />
      <TargetsListCell 
        targets={analysis.targets || []} 
        isTargetHit={false}
      />
      <StopLossCell 
        value={analysis.stopLoss} 
        isHit={false}
      />
      <DirectionCell direction={analysis.direction} />
      <CurrentPriceCell price={currentPrice} />
      <AnalysisTypeCell 
        analysisType={analysisType} 
        pattern={analysis.pattern}
        activation_type={analysis.activation_type}
      />
      <TimeframeCell timeframe={timeframe} />
      <DateCell date={date} />
      <SymbolCell symbol={symbol} />
    </TableRow>
  );
};
