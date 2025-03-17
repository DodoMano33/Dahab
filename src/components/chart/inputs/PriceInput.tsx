
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

export const PriceInput = ({ value, onChange, defaultValue }: PriceInputProps) => {
  
  // استخدام القيمة الافتراضية إذا لم تكن القيمة محددة
  useEffect(() => {
    if (!value && defaultValue) {
      onChange(defaultValue);
    }
  }, [defaultValue, value, onChange]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        السعر الحالي
      </label>
      <Input
        type="number"
        step="any"
        placeholder="أدخل السعر الحالي"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        dir="ltr"
      />
      <p className="text-sm text-gray-500 mt-1">
        يتم استخدام هذا السعر في التحليل
      </p>
    </div>
  );
};
