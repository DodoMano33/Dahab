
import { Input } from "@/components/ui/input";

interface AnalysisDurationInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const AnalysisDurationInput = ({ value, onChange }: AnalysisDurationInputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        مدة بقاء التحليل (بالساعات)
      </label>
      <Input
        type="number"
        min="1"
        max="72"
        placeholder="أدخل عدد الساعات (36 ساعة افتراضياً)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        dir="ltr"
      />
      <p className="text-sm text-gray-500 mt-1">
        يجب أن تكون المدة بين 1 و 72 ساعة
      </p>
    </div>
  );
};
