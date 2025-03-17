
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

export const PriceInput = ({ value, onChange, defaultValue }: PriceInputProps) => {
  
  // استماع لتحديثات أسعار TradingView واستخدامها لتحديث القيمة
  useEffect(() => {
    // استخدام القيمة الافتراضية إذا لم تكن القيمة محددة
    if (!value && defaultValue) {
      onChange(defaultValue);
    }
    
    // مستمع لتحديثات السعر من TradingView
    const handleTradingViewPriceUpdate = (event: CustomEvent<{ price: number }>) => {
      if (event.detail && event.detail.price) {
        console.log("PriceInput: تحديث السعر تلقائيًا إلى:", event.detail.price);
        onChange(event.detail.price.toString());
      }
    };
    
    window.addEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    
    // طلب تحديث السعر الحالي (إذا كان متاحًا)
    window.dispatchEvent(new Event('request-current-price'));
    
    return () => {
      window.removeEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    };
  }, [onChange, defaultValue, value]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        السعر الحالي
      </label>
      <Input
        type="number"
        step="any"
        placeholder="أدخل السعر الحالي"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        dir="ltr"
      />
      <p className="text-sm text-gray-500 mt-1">
        يتم استخدام هذا السعر في التحليل
      </p>
    </div>
  );
};
