
import { toast } from "sonner";

interface ValidationProps {
  user: { id: string } | null;
  symbol: string;
  timeframe: string;
  analysisType: string;
  selectedTypes: string[];
  navigate: (path: string) => void;
}

/**
 * هوك لفحص صحة بيانات التحليل
 */
export function useValidation() {
  const validateAnalysisInput = ({
    user,
    symbol,
    timeframe,
    analysisType,
    selectedTypes,
    navigate
  }: ValidationProps): boolean => {
    if (!user) {
      toast.error("يجب تسجيل الدخول لاستخدام هذه الميزة");
      navigate("/login");
      return false;
    }

    if (!symbol) {
      toast.error("الرجاء تحديد رمز المؤشر.");
      return false;
    }

    if (!timeframe) {
      toast.error("الرجاء تحديد الإطار الزمني.");
      return false;
    }

    if (!analysisType && (!selectedTypes || selectedTypes.length === 0)) {
      toast.error("الرجاء تحديد نوع التحليل.");
      return false;
    }

    return true;
  };

  return { validateAnalysisInput };
}
