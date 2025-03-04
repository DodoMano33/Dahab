
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";

interface SymbolInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

export const SymbolInput = ({ value, onChange, defaultValue }: SymbolInputProps) => {
  const [inputValue, setInputValue] = useState(value || defaultValue || "");
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimerRef = useRef<number | null>(null);
  
  // Update input when external value changes (from TradingView)
  useEffect(() => {
    // If there's a default value from TradingView and no user input yet
    if ((defaultValue && !value) || (defaultValue && defaultValue !== value && !inputValue)) {
      console.log(`Setting symbol input from TradingView default: ${defaultValue}`);
      setInputValue(defaultValue);
      // Also inform parent component
      onChange(defaultValue);
    }

    // If there's a value from parent and it's different from current input and not focused
    if (value && value !== inputValue && !isFocused) {
      console.log(`Updating symbol input from parent: ${value}`);
      setInputValue(value);
    }
  }, [value, defaultValue, inputValue, isFocused, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    setInputValue(newValue);
    
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    
    // Debounce the update to avoid too many chart reloads
    debounceTimerRef.current = window.setTimeout(() => {
      console.log(`Symbol input changed to: ${newValue}`);
      onChange(newValue);
    }, 800); // 800ms debounce
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          // Ensure value is synced on blur
          onChange(inputValue);
        }}
        className="w-full"
        dir="ltr"
      />
      {defaultValue && !inputValue && (
        <p className="text-sm text-gray-500 mt-1">
          سيتم استخدام الرمز {defaultValue} من الشارت
        </p>
      )}
    </div>
  );
};
