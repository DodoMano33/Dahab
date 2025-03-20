
import { toast } from "sonner";
import { AutoAnalysisConfig } from "../types/autoAnalysisTypes";

export const useAnalysisValidation = () => {
  const validateAnalysisConfig = (config: AutoAnalysisConfig, user: any): { isValid: boolean } => {
    if (!user) {
      toast.error("يجب تسجيل الدخول لاستخدام التحليل التلقائي");
      return { isValid: false };
    }

    // التأكد من وجود إطارات زمنية وأنواع تحليل
    if (!config.timeframes.length) {
      toast.error("الرجاء اختيار إطار زمني واحد على الأقل");
      return { isValid: false };
    }

    if (!config.analysisTypes.length) {
      toast.error("الرجاء اختيار نوع تحليل واحد على الأقل");
      return { isValid: false };
    }

    if (!config.symbol) {
      toast.error("الرجاء إدخال رمز العملة أو الزوج");
      return { isValid: false };
    }

    if (!config.currentPrice || isNaN(config.currentPrice) || config.currentPrice <= 0) {
      toast.error("الرجاء إدخال السعر الحالي بشكل صحيح");
      return { isValid: false };
    }

    return { isValid: true };
  };

  return {
    validateAnalysisConfig
  };
};
