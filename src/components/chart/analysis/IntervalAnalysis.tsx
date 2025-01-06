import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface IntervalOption {
  value: string;
  label: string;
}

const intervalOptions: IntervalOption[] = [
  { value: "1m", label: "دقيقة" },
  { value: "5m", label: "5 دقائق" },
  { value: "30m", label: "30 دقيقة" },
  { value: "1h", label: "1 ساعة" },
  { value: "4h", label: "4 ساعات" },
  { value: "1d", label: "يومي" },
];

interface IntervalAnalysisProps {
  selectedInterval: string;
  onIntervalChange: (interval: string) => void;
}

export const IntervalAnalysis = ({
  selectedInterval,
  onIntervalChange,
}: IntervalAnalysisProps) => {
  return (
    <Card className="p-6 bg-[#87CEEB] rounded-lg">
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold">التحليل كل مدة</h3>
          <p className="text-sm text-red-600">* لا يمكن اختيار أكثر من خيار واحد</p>
        </div>
        <div className="space-y-3">
          {intervalOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={`interval-${option.value}`}
                checked={selectedInterval === option.value}
                onCheckedChange={() => onIntervalChange(option.value === selectedInterval ? "" : option.value)}
              />
              <Label htmlFor={`interval-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};