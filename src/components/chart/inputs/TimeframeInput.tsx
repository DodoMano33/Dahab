import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeframeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TimeframeInput = ({ value, onChange }: TimeframeInputProps) => {
  const timeframes = [
    { value: "1m", label: "1 دقيقة" },
    { value: "5m", label: "5 دقائق" },
    { value: "30m", label: "30 دقيقة" },
    { value: "1h", label: "1 ساعة" },
    { value: "4h", label: "4 ساعات" },
    { value: "1d", label: "يومي" },
  ];

  return (
    <div>
      <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">
        الإطار الزمني
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="timeframe" className="w-full">
          <SelectValue placeholder="اختر الإطار الزمني" />
        </SelectTrigger>
        <SelectContent>
          {timeframes.map((timeframe) => (
            <SelectItem key={timeframe.value} value={timeframe.value}>
              {timeframe.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};