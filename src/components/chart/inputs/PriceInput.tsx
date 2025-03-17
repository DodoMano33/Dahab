
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string | null;
}

export const PriceInput = ({ value, onChange, defaultValue }: PriceInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow only numbers and decimals
    if (newValue === "" || /^[0-9]*\.?[0-9]*$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="price" className="block text-sm font-medium">
        السعر الحالي
      </Label>
      <Input
        id="price"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={defaultValue || "أدخل السعر الحالي"}
        className="w-full"
      />
    </div>
  );
};
