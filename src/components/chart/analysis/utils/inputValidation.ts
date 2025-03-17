
import { showErrorToast } from "./toastUtils";

/**
 * Validates required inputs for analysis
 * @returns true if inputs are valid
 */
export const validateAnalysisInputs = (
  symbol: string,
  timeframe: string
): boolean => {
  try {
    if (!symbol || !timeframe) {
      throw new Error("جميع الحقول مطلوبة");
    }

    return true;
  } catch (error) {
    showErrorToast(error);
    return false;
  }
};
