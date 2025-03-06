import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type AnalysisTypeValue = 
  | "normal" 
  | "scalping" 
  | "ict" 
  | "smc" 
  | "turtle_soup" 
  | "gann" 
  | "waves" 
  | "patterns" 
  | "price_action" 
  | "neural_networks"
  | "rnn"
  | "time_clustering"
  | "multi_variance"
  | "composite_candlestick"
  | "behavioral"
  | "fibonacci"
  | "fibonacci_advanced";

interface AnalysisType {
  value: AnalysisTypeValue;
  label: string;
}

const analysisTypes: AnalysisType[] = [
  { value: "normal", label: "تحديد الكل" },
  { value: "scalping", label: "مضاربة" },
  { value: "ict", label: "نظرية السوق" },
  { value: "smc", label: "نظرية هيكل السوق" },
  { value: "turtle_soup", label: "الحساء السلحفائي" },
  { value: "gann", label: "جان" },
  { value: "waves", label: "تقلبات" },
  { value: "patterns", label: "نمطي" },
  { value: "price_action", label: "حركة السعر" },
  { value: "fibonacci", label: "فيبوناتشي" },
  { value: "fibonacci_advanced", label: "تحليل فيبوناتشي متقدم" },
  { value: "neural_networks", label: "شبكات عصبية" },
  { value: "rnn", label: "شبكات عصبية متكررة" },
  { value: "time_clustering", label: "تصفيق زمني" },
  { value: "multi_variance", label: "تباين متعدد العوامل" },
  { value: "composite_candlestick", label: "شمعات مركبة" },
  { value: "behavioral", label: "تحليل سلوكي" },
];

interface AnalysisTypesProps {
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
}

export const AnalysisTypes = ({
  selectedTypes,
  onTypesChange,
}: AnalysisTypesProps) => {
  const handleTypeChange = (type: string) => {
    if (type === "normal") {
      if (selectedTypes.includes("normal")) {
        onTypesChange([]);
      } else {
        onTypesChange(analysisTypes.map(t => t.value));
      }
    } else {
      const newTypes = selectedTypes.includes(type)
        ? selectedTypes.filter((t) => t !== type)
        : [...selectedTypes, type];

      const otherTypesSelected = analysisTypes
        .filter(t => t.value !== "normal")
        .every(t => newTypes.includes(t.value));

      if (otherTypesSelected) {
        newTypes.push("normal");
      } else {
        const normalIndex = newTypes.indexOf("normal");
        if (normalIndex !== -1) {
          newTypes.splice(normalIndex, 1);
        }
      }

      onTypesChange(newTypes);
    }
  };

  return (
    <Card className="p-6 bg-[#FFAC7D] rounded-lg">
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold">أنواع التحليل المراد تنفيذها</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {analysisTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={`type-${type.value}`}
                checked={selectedTypes.includes(type.value)}
                onCheckedChange={() => handleTypeChange(type.value)}
              />
              <Label htmlFor={`type-${type.value}`}>{type.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
