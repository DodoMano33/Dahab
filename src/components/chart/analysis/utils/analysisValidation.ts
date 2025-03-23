
import { toast } from "sonner";

export const validateAnalysisInputs = (
  timeframes: string[],
  interval: string,
  analysisTypes: string[],
  currentPrice?: number,
  duration?: number
) => {
  if (timeframes.length === 0) {
    toast.error("الرجاء اختيار إطار زمني واحد على الأقل", { duration: 1000 });
    return false;
  }

  if (!interval) {
    toast.error("الرجاء اختيار الفاصل الزمني", { duration: 1000 });
    return false;
  }

  if (analysisTypes.length === 0) {
    toast.error("الرجاء اختيار نوع تحليل واحد على الأقل", { duration: 1000 });
    return false;
  }

  if (!currentPrice) {
    toast.error("الرجاء إدخال السعر الحالي للتحليل", { duration: 1000 });
    return false;
  }

  if (!duration || duration < 1 || duration > 72) {
    toast.error("مدة التحليل يجب أن تكون بين 1 و 72 ساعة", { duration: 1000 });
    return false;
  }

  return true;
};
