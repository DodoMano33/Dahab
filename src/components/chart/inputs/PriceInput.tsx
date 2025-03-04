
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

export const PriceInput = ({ value, onChange, defaultValue }: PriceInputProps) => {
  const [inputValue, setInputValue] = useState(value || defaultValue || "");
  const [isFocused, setIsFocused] = useState(false);
  const previousDefaultRef = useRef<string | undefined>(defaultValue);
  
  // Update input when external price changes (from TradingView)
  useEffect(() => {
    // If there's a new price from TradingView and the field isn't focused
    if (defaultValue && defaultValue !== previousDefaultRef.current && !isFocused) {
      console.log(`Updating price from TradingView: ${defaultValue}`);
      setInputValue(defaultValue);
      previousDefaultRef.current = defaultValue;
      
      // Also inform parent component if we don't have a user-set value
      if (!value) {
        onChange(defaultValue);
      }
    }

    // If there's a value from parent and it's different from current input
    if (value && value !== inputValue && !isFocused) {
      console.log(`Updating price from parent: ${value}`);
      setInputValue(value);
    }
  }, [value, defaultValue, inputValue, isFocused, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log(`Price input changed to: ${newValue}`);
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full"
        dir="ltr"
      />
      {defaultValue && !value && (
        <p className="text-sm text-gray-500 mt-1">
          السعر الحالي {defaultValue} من الشارت
        </p>
      )}
    </div>
  );
};
