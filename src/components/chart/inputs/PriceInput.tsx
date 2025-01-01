import { Input } from "@/components/ui/input";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const PriceInput = ({ value, onChange }: PriceInputProps) => {
  return (
    <div>
      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
        السعر (اختياري)
      </label>
      <Input
        id="price"
        type="number"
        step="any"
        placeholder="أدخل السعر (اختياري)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        dir="ltr"
      />
    </div>
  );
};