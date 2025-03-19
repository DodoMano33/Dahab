
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useEffect, useState } from "react";

interface IntervalSettingsProps {
  interval: number;
  onIntervalChange: (interval: number) => void;
  label: string;
  id: string;
}

export function IntervalSettings({ 
  interval, 
  onIntervalChange, 
  label, 
  id 
}: IntervalSettingsProps) {
  // تحديد القيم بشكل أكثر مناسبة للاستخدام
  const timeIntervalOptions = [
    { value: 10000, label: "10 ثواني" },
    { value: 20000, label: "20 ثانية" },
    { value: 30000, label: "30 ثانية" },
    { value: 60000, label: "1 دقيقة" },
    { value: 180000, label: "3 دقائق" },
    { value: 300000, label: "5 دقائق" },
    { value: 900000, label: "15 دقيقة" },
    { value: 1800000, label: "30 دقيقة" },
    { value: 3600000, label: "60 دقيقة" }
  ];

  // التأكد من أن القيمة المحددة موجودة في القائمة
  const ensureValidValue = (value: number): string => {
    // تحقق مما إذا كانت القيمة موجودة في القائمة
    const isValidValue = timeIntervalOptions.some(option => option.value === value);
    // إذا لم تكن القيمة موجودة، استخدم 5 دقائق كقيمة افتراضية
    return isValidValue ? String(value) : "300000";
  };

  // استخدام حالة محلية لتخزين القيمة المحددة مع التأكد من صحتها
  const [selectedInterval, setSelectedInterval] = useState(ensureValidValue(interval));

  // تحديث القيمة المحلية عند تغير القيمة الخارجية
  useEffect(() => {
    const validValue = ensureValidValue(interval);
    setSelectedInterval(validValue);
  }, [interval]);

  const handleValueChange = (value: string) => {
    setSelectedInterval(value);
    onIntervalChange(Number(value));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={selectedInterval}
        onValueChange={handleValueChange}
      >
        <SelectTrigger id={id}>
          <SelectValue placeholder={`اختر ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {timeIntervalOptions.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
