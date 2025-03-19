
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useEffect, useState, useCallback, memo, useRef } from "react";

interface IntervalSettingsProps {
  interval: number;
  onIntervalChange: (interval: number) => void;
  label: string;
  id: string;
}

export const IntervalSettings = memo(function IntervalSettings({ 
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

  // استخدام مرجع لتتبع ما إذا كان المكون مُركّب
  const isMountedRef = useRef(true);
  // استخدام مرجع لتتبع القيمة الأصلية للتجنب التحديثات غير الضرورية
  const initialValueRef = useRef<number>(interval);

  // التأكد من أن القيمة المحددة موجودة في القائمة
  const ensureValidValue = useCallback((value: number): string => {
    // تحقق مما إذا كانت القيمة موجودة في القائمة
    const isValidValue = timeIntervalOptions.some(option => option.value === value);
    // إذا لم تكن القيمة موجودة، استخدم 5 دقائق كقيمة افتراضية
    return isValidValue ? String(value) : "300000";
  }, []);

  // استخدام حالة محلية لتخزين القيمة المحددة مع التأكد من صحتها
  const [selectedInterval, setSelectedInterval] = useState(() => ensureValidValue(interval));

  // تحديث القيمة المحلية عند تغير القيمة الخارجية فقط إذا كانت قيمة مختلفة عن القيمة الأصلية
  useEffect(() => {
    if (interval !== initialValueRef.current) {
      const validValue = ensureValidValue(interval);
      if (validValue !== selectedInterval) {
        setSelectedInterval(validValue);
      }
      initialValueRef.current = interval;
    }
  }, [interval, ensureValidValue, selectedInterval]);

  // تعيين isMountedRef إلى false عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleValueChange = useCallback((value: string) => {
    // عدم تحديث الحالة إذا كانت نفس القيمة
    if (value === selectedInterval) return;
    
    // تحديث الحالة المحلية فقط إذا كان المكون لا يزال مُركّبًا
    if (isMountedRef.current) {
      setSelectedInterval(value);
      
      // استخدام setTimeout لتجنب تحديثات متعددة سريعة
      setTimeout(() => {
        if (isMountedRef.current) {
          onIntervalChange(Number(value));
        }
      }, 0);
    }
  }, [selectedInterval, onIntervalChange]);

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
});
