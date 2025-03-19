
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { priceUpdater } from "@/utils/priceUpdater";
import { toast } from "sonner";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  tradingViewPrice?: number | null;
}

export const PriceInput = ({ 
  value, 
  onChange, 
  defaultValue,
  tradingViewPrice
}: PriceInputProps) => {
  const [useAutoPrice, setUseAutoPrice] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // محاولة تحديث السعر
  const updatePrice = async () => {
    if (!useAutoPrice) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // محاولة الحصول على السعر من Metal Price API
      const symbol = 'XAUUSD'; // الرمز الافتراضي
      const price = await priceUpdater.fetchPrice(symbol);
      
      if (price !== null) {
        onChange(price.toString());
        setErrorMessage(null);
      } else {
        // السعر غير متاح من Metal Price API
        setErrorMessage("لم نتمكن من جلب السعر المباشر. يمكنك إدخال السعر يدويًا.");
      }
    } catch (error) {
      console.error("خطأ في جلب السعر:", error);
      setErrorMessage("حدث خطأ أثناء جلب السعر المباشر.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // استخدام السعر من Metal Price API تلقائيًا
  useEffect(() => {
    if (useAutoPrice) {
      updatePrice();
    }
  }, [useAutoPrice]);

  // استمع للتحديثات المباشرة من Metal Price API
  useEffect(() => {
    const handleMetalPriceUpdate = (event: CustomEvent) => {
      if (useAutoPrice && event.detail && event.detail.price) {
        onChange(event.detail.price.toString());
        setErrorMessage(null);
      }
    };

    window.addEventListener('metal-price-update', handleMetalPriceUpdate as EventListener);
    return () => {
      window.removeEventListener('metal-price-update', handleMetalPriceUpdate as EventListener);
    };
  }, [useAutoPrice, onChange]);

  // تفعيل أو تعطيل وضع السعر التلقائي
  const toggleAutoPriceMode = () => {
    const newMode = !useAutoPrice;
    setUseAutoPrice(newMode);
    
    if (newMode) {
      // محاولة الحصول على السعر تلقائيًا
      updatePrice();
    } else {
      // تعطيل وضع السعر التلقائي والسماح بإدخال السعر يدويًا
      setErrorMessage(null);
    }
  };

  // اختيار السعر المناسب للعرض
  const displayPrice = tradingViewPrice !== null && tradingViewPrice !== undefined
    ? tradingViewPrice.toFixed(5)
    : value 
      ? parseFloat(value).toFixed(5)
      : defaultValue 
        ? defaultValue 
        : "السعر غير متاح";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          السعر (إجباري)
        </label>
        <Badge 
          variant={useAutoPrice ? "default" : "outline"} 
          className="cursor-pointer" 
          onClick={toggleAutoPriceMode}
        >
          {useAutoPrice ? "السعر التلقائي" : "السعر اليدوي"}
        </Badge>
      </div>
      <Input
        id="price"
        type="number"
        step="any"
        placeholder={`أدخل السعر (إجباري)`}
        value={value}
        onChange={(e) => !useAutoPrice && onChange(e.target.value)}
        className={`w-full ${useAutoPrice ? 'bg-gray-100' : ''}`}
        dir="ltr"
        disabled={useAutoPrice}
      />
      
      {useAutoPrice && isLoading && (
        <p className="text-sm text-yellow-500 mt-1">
          جارِ جلب السعر المباشر من Metal Price API...
        </p>
      )}
      
      {useAutoPrice && errorMessage && (
        <div className="flex flex-col mt-1">
          <p className="text-sm text-red-500">{errorMessage}</p>
          <button 
            onClick={updatePrice} 
            className="text-xs text-blue-500 hover:underline mt-1"
          >
            إعادة المحاولة
          </button>
        </div>
      )}
      
      {useAutoPrice && !isLoading && !errorMessage && value && (
        <p className="text-sm text-green-500 mt-1">
          السعر المباشر من Metal Price API: {displayPrice}
        </p>
      )}
      
      {!useAutoPrice && tradingViewPrice !== null && (
        <p className="text-sm text-gray-500 mt-1">
          السعر المتاح من Metal Price API: {displayPrice}
        </p>
      )}
    </div>
  );
};
