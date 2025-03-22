
import { toast } from "sonner";

interface ValidationProps {
  symbol: string;
  defaultSymbol?: string;
  price: string;
  defaultPrice?: number | null;
  duration: string;
}

export const useFormValidation = () => {
  const validateInputs = ({
    symbol,
    defaultSymbol,
    price,
    defaultPrice,
    duration
  }: ValidationProps) => {
    if (!symbol && !defaultSymbol) {
      toast.error("الرجاء إدخال رمز العملة أو انتظار تحميل الشارت");
      return false;
    }

    const providedPrice = price ? Number(price) : defaultPrice;
    if (!providedPrice) {
      toast.error("الرجاء إدخال السعر أو انتظار تحميل الشارت");
      return false;
    }

    if (isNaN(providedPrice)) {
      toast.error("الرجاء إدخال سعر صحيح");
      return false;
    }

    const durationHours = Number(duration);
    console.log("Validating duration:", duration, "Parsed:", durationHours);
    
    if (isNaN(durationHours)) {
      toast.error("الرجاء إدخال مدة صالحة");
      return false;
    }
    
    if (durationHours < 1 || durationHours > 72) {
      toast.error("مدة التحليل يجب أن تكون بين 1 و 72 ساعة");
      return false;
    }

    console.log("Form validation passed with duration:", durationHours);
    return true;
  };

  return { validateInputs };
};
