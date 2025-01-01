import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { AnalysisData, SearchHistoryItem } from "@/types/analysis";

export const formatAnalysisData = (analysis: AnalysisData) => {
  const targets = analysis.targets?.map((target, idx) => 
    `الهدف ${idx + 1}: ${target.price} (${format(target.expectedTime, 'PPpp', { locale: ar })})`
  ).join('\n') || 'لا توجد أهداف';

  return `الاتجاه: ${analysis.direction}
نقطة الدخول: ${analysis.bestEntryPoint?.price || 'غير محدد'}
سبب الدخول: ${analysis.bestEntryPoint?.reason || 'غير محدد'}
وقف الخسارة: ${analysis.stopLoss}
الأهداف:
${targets}`;
};

export const generateShareText = (item: SearchHistoryItem) => `
تاريخ التحليل: ${format(item.date, 'PPpp', { locale: ar })}
الرمز: ${item.symbol}
نوع التحليل: ${item.analysisType}
الإطار الزمني: ${item.timeframe}
السعر عند التحليل: ${item.currentPrice}
${formatAnalysisData(item.analysis)}
${'-'.repeat(50)}`;