
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

interface SymbolInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

export const SymbolInput = ({ value, onChange, defaultValue }: SymbolInputProps) => {
  // تحديث القيمة عندما تتغير القيمة الافتراضية
  useEffect(() => {
    if (defaultValue && !value) {
      console.log("Setting symbol input value from default:", defaultValue);
      onChange(defaultValue);
    }
  }, [defaultValue, value, onChange]);

  return (
    <div>
      <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
        رمز العملة
      </label>
      <Input
        id="symbol"
        placeholder={defaultValue || "مثال: XAUUSD"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        dir="ltr"
      />
      {defaultValue && (
        <p className="text-sm text-gray-500 mt-1">
          الرمز الحالي من الشارت: {defaultValue}
        </p>
      )}
    </div>
  );
};
