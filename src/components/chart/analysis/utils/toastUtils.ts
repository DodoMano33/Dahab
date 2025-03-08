
import { toast } from "sonner";

/**
 * Shows a loading toast that persists until dismissed
 * @returns The toast ID that can be used to dismiss it later
 */
export const showLoadingToast = (message: string): string => {
  const toastId = "analysis-loading-" + Date.now();
  toast.loading(message, {
    id: toastId,
    duration: 1000, // تغيير من 3000 إلى 1000 (1 ثانية)
  });
  return toastId;
};

/**
 * Shows a success toast for completed analysis
 */
export const showSuccessToast = (
  analysisType: string, 
  timeframe: string, 
  symbol: string, 
  price: number
): void => {
  toast.success(`تم إكمال تحليل ${analysisType} بنجاح على الإطار الزمني ${timeframe}`, {
    description: `${symbol} | السعر: ${price}`,
    duration: 1000, // تغيير من 3000 إلى 1000 (1 ثانية)
  });
};

/**
 * Shows an error toast with a given message
 */
export const showErrorToast = (error: unknown): void => {
  if (error instanceof Error) {
    toast.error(error.message, {
      duration: 1000, // تغيير من 3000 إلى 1000 (1 ثانية)
    });
  } else {
    toast.error("حدث خطأ أثناء التحليل", {
      duration: 1000, // تغيير من 3000 إلى 1000 (1 ثانية)
    });
  }
};

/**
 * Utility to dismiss multiple toast IDs safely
 */
export const dismissToasts = (...toastIds: (string | undefined)[]): void => {
  toastIds.forEach(id => {
    if (id) toast.dismiss(id);
  });
};
