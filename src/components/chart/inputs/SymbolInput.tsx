
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { fetchCurrentPrice } from "@/services/priceService";

interface SymbolInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  onPriceUpdate?: (price: number | null) => void;
}

export const SymbolInput = ({ 
  value, 
  onChange, 
  defaultValue,
  onPriceUpdate 
}: SymbolInputProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value || defaultValue || "");

  // استخدام قيمة مؤجلة للرمز لتجنب طلبات API متعددة
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value || defaultValue || "");
    }, 300);

    return () => clearTimeout(timer);
  }, [value, defaultValue]);

  // استدعاء API للحصول على السعر عند تغيير الرمز
  useEffect(() => {
    const fetchPrice = async () => {
      if (!debouncedValue) return;
      
      try {
        setIsLoading(true);
        const price = await fetchCurrentPrice(debouncedValue);
        if (price && onPriceUpdate) {
          onPriceUpdate(price);
        }
      } catch (error) {
        console.error("خطأ في الحصول على السعر:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();
  }, [debouncedValue, onPriceUpdate]);

  return (
    <div>
      <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
        رمز العملة
      </label>
      <div className="relative">
        <Input
          id="symbol"
          placeholder={defaultValue || "مثال: XAUUSD"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
          dir="ltr"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>
      {defaultValue && !value && (
        <p className="text-sm text-gray-500 mt-1">
          سيتم استخدام الرمز {defaultValue} من الشارت
        </p>
      )}
    </div>
  );
};
