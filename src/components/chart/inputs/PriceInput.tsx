
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

export const PriceInput = ({ value, onChange, defaultValue }: PriceInputProps) => {
  const [inputValue, setInputValue] = useState(value || defaultValue || "");
  
  // Update input when external price changes (from TradingView)
  useEffect(() => {
    if ((defaultValue && !value) || (defaultValue && defaultValue !== value && !inputValue)) {
      setInputValue(defaultValue);
    }
    if (value && value !== inputValue) {
      setInputValue(value);
    }
  }, [value, defaultValue, inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div>
      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
        السعر (إجباري)
      </label>
      <Input
        id="price"
        type="number"
        step="any"
        placeholder="أدخل السعر (إجباري)"
        value={inputValue}
        onChange={handleInputChange}
        className="w-full"
        dir="ltr"
      />
      {defaultValue && !value && (
        <p className="text-sm text-gray-500 mt-1">
          سيتم استخدام السعر {defaultValue} من الشارت
        </p>
      )}
    </div>
  );
};
