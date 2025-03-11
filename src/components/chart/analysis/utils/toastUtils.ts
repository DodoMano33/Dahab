
import { toast } from "sonner";

/**
 * Shows a loading toast that persists until dismissed
 * @returns The toast ID that can be used to dismiss it later
 */
export const showLoadingToast = (message: string): string => {
  const toastId = "analysis-loading-" + Date.now();
  toast.loading(message, {
    id: toastId,
    duration: Infinity,
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
    duration: 500, // Changed to 0.5 seconds
  });
};

/**
 * Shows an error toast with a given message
 */
export const showErrorToast = (error: unknown): void => {
  if (error instanceof Error) {
    toast.error(error.message, {
      duration: 500, // Changed to 0.5 seconds
    });
  } else {
    toast.error("حدث خطأ أثناء التحليل", {
      duration: 500, // Changed to 0.5 seconds
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
