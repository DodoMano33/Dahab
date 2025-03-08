import { Input } from "@/components/ui/input";

interface SymbolInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

export const SymbolInput = ({ value, onChange, defaultValue }: SymbolInputProps) => {
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
      {defaultValue && !value && (
        <p className="text-sm text-gray-500 mt-1">
          سيتم استخدام الرمز {defaultValue} من الشارت
        </p>
      )}
    </div>
  );
};