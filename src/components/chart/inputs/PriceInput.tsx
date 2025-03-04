
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

export const PriceInput = ({ value, onChange, defaultValue }: PriceInputProps) => {
  const [inputValue, setInputValue] = useState(value);

  // Update input value when default value changes
  useEffect(() => {
    if (defaultValue && !value) {
      setInputValue(defaultValue);
    }
  }, [defaultValue, value]);

  // Update input value when value prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

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
        placeholder={defaultValue || "أدخل السعر (إجباري)"}
        value={inputValue}
        onChange={handleInputChange}
        className="w-full"
        dir="ltr"
      />
      {defaultValue && !value && (
        <p className="text-sm text-gray-500 mt-1">
          سيتم استخدام السعر <span className="font-medium">{defaultValue}</span> من الشارت
        </p>
      )}
    </div>
  );
};
