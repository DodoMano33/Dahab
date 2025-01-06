import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface TimeframeOption {
  value: string;
  label: string;
}

const timeframeOptions: TimeframeOption[] = [
  { value: "1m", label: "دقيقة 1" },
  { value: "5m", label: "دقائق 5" },
  { value: "30m", label: "دقيقة 30" },
  { value: "1h", label: "ساعة 1" },
  { value: "4h", label: "ساعات 4" },
  { value: "1d", label: "يومي" },
];

interface AnalysisSettingsProps {
  onTimeframesChange: (timeframes: string[]) => void;
  onIntervalChange: (interval: string) => void;
}

export const AnalysisSettings = ({
  onTimeframesChange,
  onIntervalChange,
}: AnalysisSettingsProps) => {
  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<string>("");

  const handleTimeframeChange = (timeframe: string) => {
    const newTimeframes = selectedTimeframes.includes(timeframe)
      ? selectedTimeframes.filter((t) => t !== timeframe)
      : [...selectedTimeframes, timeframe];
    
    setSelectedTimeframes(newTimeframes);
    onTimeframesChange(newTimeframes);
  };

  const handleIntervalChange = (interval: string) => {
    setSelectedInterval(interval === selectedInterval ? "" : interval);
    onIntervalChange(interval === selectedInterval ? "" : interval);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-white bg-red-600 py-4">
        تفعيل التحليلات
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-[#98D8AA] rounded-lg">
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold">التحليل لإطار زمني</h3>
              <p className="text-sm text-red-600">* يمكن اختيار أكثر من إطار زمني</p>
            </div>
            <div className="space-y-3">
              {timeframeOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={`timeframe-${option.value}`}
                    checked={selectedTimeframes.includes(option.value)}
                    onCheckedChange={() => handleTimeframeChange(option.value)}
                  />
                  <Label htmlFor={`timeframe-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#87CEEB] rounded-lg">
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold">التحليل كل مدة</h3>
              <p className="text-sm text-red-600">* لا يمكن اختيار أكثر من خيار واحد</p>
            </div>
            <div className="space-y-3">
              {timeframeOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={`interval-${option.value}`}
                    checked={selectedInterval === option.value}
                    onCheckedChange={() => handleIntervalChange(option.value)}
                  />
                  <Label htmlFor={`interval-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-[#F4A460] p-4 rounded-lg">
        <h3 className="text-xl font-bold text-center text-white mb-4">
          إختيار التحليلات
        </h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="text-center text-gray-600">
            تظهر هنا نتائج التحليلات
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <p>في حال وصل السعر الحالي للعنصر الذي تم تحليله الى الهدف الاول يصبح لون الشريط اخضر فاتح</p>
            <p>في حال وصل السعر الحالي للعنصر الذي تم تحليله الى الهدف الثاني يصبح لون الشريط اخضر غامق</p>
            <p>في حال وصل السعر الحالي للعنصر الذي تم تحليله الى نقطة وقف الخسارة يصبح لون الشريط احمر غامق</p>
          </div>
        </div>
      </div>
    </div>
  );
};