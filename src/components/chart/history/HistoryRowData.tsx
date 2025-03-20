
import { useState, useEffect } from "react";
import { AnalysisData } from "@/types/analysis";
import { useBestEntryPoint } from "./hooks/useBestEntryPoint";
import { processTargets } from "./utils/targetUtils";
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";

interface HistoryRowDataProps {
  id: string;
  date: Date;
  analysis: AnalysisData;
  analysisType: string;
  last_checked_price?: number;
  last_checked_at?: Date | string | null;
}

export const useHistoryRowData = ({
  id,
  date,
  analysis,
  analysisType,
  last_checked_price,
  last_checked_at,
}: HistoryRowDataProps) => {
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
  
  // الحصول على معلومات أفضل نقطة دخول
  const bestEntryPoint = useBestEntryPoint(analysis, id);
  
  // معالجة بيانات الأهداف
  const fixedTargets = processTargets(analysis, id, date);

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

  return {
    displayAnalysisType,
    bestEntryPoint,
    fixedTargets
  };
};
