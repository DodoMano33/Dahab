import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TimeframeOption {
  value: string;
  label: string;
}

const timeframeOptions: TimeframeOption[] = [
  { value: "1m", label: "دقيقة" },
  { value: "5m", label: "5 دقائق" },
  { value: "30m", label: "30 دقيقة" },
  { value: "1h", label: "1 ساعة" },
  { value: "4h", label: "4 ساعات" },
  { value: "1d", label: "يومي" },
];

interface TimeframeAnalysisProps {
  selectedTimeframes: string[];
  onTimeframeChange: (timeframes: string[]) => void;
}

export const TimeframeAnalysis = ({
  selectedTimeframes,
  onTimeframeChange,
}: TimeframeAnalysisProps) => {
  const handleTimeframeChange = (timeframe: string) => {
    const newTimeframes = selectedTimeframes.includes(timeframe)
      ? selectedTimeframes.filter((t) => t !== timeframe)
      : [...selectedTimeframes, timeframe];
    onTimeframeChange(newTimeframes);
  };

  return (
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
  );
};