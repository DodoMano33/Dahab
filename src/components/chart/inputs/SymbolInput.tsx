
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface SymbolInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

export const SymbolInput = ({ value, onChange, defaultValue }: SymbolInputProps) => {
  const [inputValue, setInputValue] = useState(value || defaultValue || "");
  
  // Update input when external value changes (from TradingView)
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
      <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
        رمز العملة
      </label>
      <Input
        id="symbol"
        placeholder="مثال: XAUUSD"
        value={inputValue}
        onChange={handleInputChange}
        className="w-full"
        dir="ltr"
      />
      {defaultValue && !value && (
        <p className="text-sm text-gray-500 mt-1">
          سيتم استخدام الرمز {defaultValue} من الشارت
        </p>
      )}
    </div>
  );
};
