import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { AnalysisData } from "@/types/analysis";

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

export const filterHistoryByDateRange = (
  history: any[],
  selectedItems: Set<string>,
  dateRange: { from: Date | undefined; to: Date | undefined }
) => {
  return history.filter(item => {
    if (selectedItems.size > 0) {
      return selectedItems.has(item.id);
    }
    if (dateRange.from && dateRange.to) {
      return item.date >= dateRange.from && item.date <= dateRange.to;
    }
    return false;
  });
};