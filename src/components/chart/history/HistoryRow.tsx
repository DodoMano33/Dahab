
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
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";

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
  // استخدام وظيفة getStrategyName لعرض نوع التحليل بشكل صحيح
  const displayAnalysisType = analysis.pattern === "فيبوناتشي ريتريسمينت وإكستينشين" 
    ? "فيبوناتشي" 
    : analysis.pattern === "تحليل فيبوناتشي متقدم" 
      ? "تحليل فيبوناتشي متقدم" 
      : getStrategyName(analysisType);
  
  // تشخيص وقت آخر فحص
  console.log(`Last checked at for ${id}:`, last_checked_at, typeof last_checked_at);
  
  // تشخيص بيانات الأهداف
  console.log(`Targets for analysis ${id}:`, analysis.targets);
  
  // تشخيص بيانات أفضل نقطة دخول
  console.log(`Best entry point for analysis ${id}:`, analysis.bestEntryPoint);
  
  // التحقق من صحة نوع بيانات الأهداف وإصلاحها إذا لزم الأمر
  const fixedTargets = (() => {
    if (!analysis.targets) {
      console.log(`No targets found for analysis ${id}, creating default empty array`);
      return [];
    }
    
    if (!Array.isArray(analysis.targets)) {
      console.log(`Targets is not an array for analysis ${id}, converting to array`);
      return [];
    }
    
    console.log(`Found ${analysis.targets.length} targets for analysis ${id}`);
    
    return analysis.targets.map(target => {
      if (typeof target === 'number') {
        // تحويل الرقم إلى كائن هدف
        return {
          price: target,
          expectedTime: new Date(date.getTime() + 24 * 60 * 60 * 1000) // افتراضيًا بعد 24 ساعة
        };
      }
      
      if (!target || typeof target !== 'object') {
        return null;
      }
      
      // التأكد من وجود سعر
      if (target.price === undefined || target.price === null) {
        return null;
      }
      
      // التأكد من وجود تاريخ متوقع
      if (!target.expectedTime) {
        return {
          ...target,
          expectedTime: new Date(date.getTime() + 24 * 60 * 60 * 1000)
        };
      }
      
      return target;
    }).filter(Boolean);
  })();
  
  // التحقق من صحة بيانات أفضل نقطة دخول وإصلاحها إذا لزم الأمر
  const bestEntryPoint = (() => {
    if (!analysis.bestEntryPoint) {
      console.log(`No best entry point found for analysis ${id}`);
      return { price: undefined, reason: undefined };
    }
    
    // تحقق من أن السعر موجود
    const price = analysis.bestEntryPoint.price;
    const reason = analysis.bestEntryPoint.reason;
    
    if (price === undefined || price === null || isNaN(price)) {
      console.log(`Invalid best entry point price for analysis ${id}`);
      return { price: undefined, reason };
    }
    
    console.log(`Valid best entry point found for analysis ${id}: ${price}`);
    return { price, reason };
  })();
  
  console.log(`Fixed targets for analysis ${id}:`, fixedTargets);
  console.log(`Fixed best entry point for analysis ${id}:`, bestEntryPoint);

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
        price={bestEntryPoint.price}
        reason={bestEntryPoint.reason}
      />
      <TargetsListCell 
        targets={fixedTargets} 
        isTargetHit={false}
      />
      <StopLossCell 
        value={analysis.stopLoss} 
        isHit={false}
      />
      <DirectionCell direction={analysis.direction} />
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
