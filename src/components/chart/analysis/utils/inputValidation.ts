
import { showErrorToast } from "./toastUtils";

/**
 * Validates required inputs for analysis
 * @returns true if inputs are valid
 */
export const validateAnalysisInputs = (
  symbol: string,
  timeframe: string,
  providedPrice?: number
): boolean => {
  try {
    if (!symbol || !timeframe) {
      throw new Error("جميع الحقول مطلوبة");
    }

    if (!providedPrice) {
      throw new Error("يجب إدخال السعر الحالي للتحليل");
    }

    return true;
  } catch (error) {
    showErrorToast(error);
    return false;
  }
};
