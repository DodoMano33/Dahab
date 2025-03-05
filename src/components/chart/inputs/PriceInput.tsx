
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

export const PriceInput = ({ value, onChange, defaultValue }: PriceInputProps) => {
  const [inputValue, setInputValue] = useState(value || defaultValue || "");

  // Update input value when default value changes
  useEffect(() => {
    if (defaultValue && (!value || value === "")) {
      console.log("PriceInput: Using default value:", defaultValue);
      setInputValue(defaultValue);
      onChange(defaultValue); // Update parent component with default value
    }
  }, [defaultValue, onChange]);

  // Update input value when value prop changes
  useEffect(() => {
    if (value && value !== inputValue) {
      console.log("PriceInput: Value prop changed to:", value);
      setInputValue(value);
    }
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
      {defaultValue && (!value || value === "") && (
        <p className="text-sm text-gray-500 mt-1">
          سيتم استخدام السعر <span className="font-medium">{defaultValue}</span> من الشارت
        </p>
      )}
    </div>
  );
};
