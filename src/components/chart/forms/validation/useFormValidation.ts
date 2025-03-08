
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

    // Convert the price string to a number, or use defaultPrice
    const providedPrice = price ? Number(price) : defaultPrice;
    if (!providedPrice) {
      toast.error("الرجاء إدخال السعر أو انتظار تحميل الشارت");
      return false;
    }

    if (isNaN(Number(providedPrice))) {
      toast.error("الرجاء إدخال سعر صحيح");
      return false;
    }

    const durationHours = Number(duration);
    if (isNaN(durationHours) || durationHours < 1 || durationHours > 72) {
      toast.error("الرجاء إدخال مدة صالحة بين 1 و 72 ساعة");
      return false;
    }

    return true;
  };

  return { validateInputs };
};
