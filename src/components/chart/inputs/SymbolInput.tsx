import { Input } from "@/components/ui/input";

interface SymbolInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SymbolInput = ({ value, onChange }: SymbolInputProps) => {
  return (
    <div>
      <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
        رمز العملة
      </label>
      <Input
        id="symbol"
        placeholder="مثال: XAUUSD"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        dir="ltr"
      />
    </div>
  );
};