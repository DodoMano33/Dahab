
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

export const PriceInput = ({ value, onChange, defaultValue }: PriceInputProps) => {
  // تحديث القيمة عندما تتغير القيمة الافتراضية
  useEffect(() => {
    if (defaultValue && !value) {
      console.log("Setting price input value from default:", defaultValue);
      onChange(defaultValue);
    }
  }, [defaultValue, value, onChange]);

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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        dir="ltr"
      />
      {defaultValue && (
        <p className="text-sm text-gray-500 mt-1">
          السعر الحالي من الشارت: {defaultValue}
        </p>
      )}
    </div>
  );
};
