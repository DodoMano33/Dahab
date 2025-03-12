
import { Input } from "@/components/ui/input";

interface SymbolInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
}

export const SymbolInput = ({ value, onChange, defaultValue, disabled = false }: SymbolInputProps) => {
  return (
    <div>
      <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
        رمز العملة
      </label>
      <Input
        id="symbol"
        placeholder={defaultValue || "XAUUSD"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${disabled ? 'bg-gray-100' : ''}`}
        dir="ltr"
        disabled={disabled}
      />
      {disabled && (
        <p className="text-sm text-gray-500 mt-1">
          هذا التطبيق مخصص لتحليل الذهب (XAUUSD) فقط
        </p>
      )}
    </div>
  );
};
