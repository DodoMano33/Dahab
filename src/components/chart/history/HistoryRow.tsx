
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
  
  // معالجة بيانات أفضل نقطة دخول
  const bestEntryPoint = (() => {
    // التحقق من وجود كائن أفضل نقطة دخول
    if (!analysis.bestEntryPoint) {
      console.log(`No bestEntryPoint object for analysis ${id}`);
      return { price: undefined, reason: undefined };
    }
    
    // التحقق من وجود السعر والسبب
    let price = undefined;
    let reason = undefined;
    
    // إذا كان الكائن موجود، افحص إذا كان السعر والسبب موجودين
    if (typeof analysis.bestEntryPoint === 'object') {
      // التحقق من السعر وتحويله إلى رقم إذا كان موجود
      if ('price' in analysis.bestEntryPoint && analysis.bestEntryPoint.price !== undefined) {
        const priceValue = analysis.bestEntryPoint.price;
        price = typeof priceValue === 'string' ? parseFloat(priceValue) : priceValue;
        
        // التحقق من صحة الرقم
        if (isNaN(Number(price))) {
          price = undefined;
        }
      }
      
      // التحقق من وجود السبب
      if ('reason' in analysis.bestEntryPoint) {
        reason = analysis.bestEntryPoint.reason;
      }
    } else if (typeof analysis.bestEntryPoint === 'number') {
      // إذا كان السعر رقم مباشر
      price = analysis.bestEntryPoint;
    }
    
    console.log(`Fixed best entry point for analysis ${id}:`, { price, reason });
    
    return { price, reason };
  })();
  
  // التحقق من صحة بيانات الأهداف وإصلاحها إذا لزم الأمر
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
