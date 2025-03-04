
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  isAutoPriceEnabled?: boolean;
}

export const PriceInput = ({ 
  value, 
  onChange, 
  defaultValue,
  isAutoPriceEnabled = true
}: PriceInputProps) => {
  const [isAutoUpdated, setIsAutoUpdated] = useState(false);

  // If the price is updated from outside (like from chart) and isAutoPriceEnabled is true
  useEffect(() => {
    if (defaultValue && !value && isAutoPriceEnabled) {
      onChange(defaultValue);
      setIsAutoUpdated(true);
      
      // Reset the flag after a while
      const timer = setTimeout(() => {
        setIsAutoUpdated(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [defaultValue, value, onChange, isAutoPriceEnabled]);

  return (
    <div>
      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
        السعر
      </label>
      <div className="relative">
        <Input
          id="price"
          type="number"
          step="any"
          placeholder={defaultValue || "أدخل السعر (إجباري)"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${isAutoUpdated ? 'border-green-400 bg-green-50' : ''}`}
          dir="ltr"
        />
        {isAutoUpdated && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-green-500 text-xs">تم التحديث من الشارت</span>
          </div>
        )}
      </div>
      {defaultValue && !value && (
        <p className="text-sm text-gray-500 mt-1">
          سيتم استخدام السعر {defaultValue} من الشارت
        </p>
      )}
    </div>
  );
};
