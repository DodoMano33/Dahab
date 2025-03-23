
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
      toast.error("يجب تسجيل الدخول لاستخدام هذه الميزة", { duration: 1000 });
      navigate("/login");
      return false;
    }

    if (!symbol) {
      toast.error("الرجاء تحديد رمز المؤشر.", { duration: 1000 });
      return false;
    }

    if (!timeframe) {
      toast.error("الرجاء تحديد الإطار الزمني.", { duration: 1000 });
      return false;
    }

    if (!analysisType && (!selectedTypes || selectedTypes.length === 0)) {
      toast.error("الرجاء تحديد نوع التحليل.", { duration: 1000 });
      return false;
    }

    return true;
  };

  return { validateAnalysisInput };
}
