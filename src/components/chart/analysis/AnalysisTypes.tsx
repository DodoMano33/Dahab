import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AnalysisType {
  value: string;
  label: string;
}

const analysisTypes: AnalysisType[] = [
  { value: "normal", label: "تحديد الكل" },
  { value: "scalping", label: "Scalping" },
  { value: "ict", label: "ICT" },
  { value: "gann", label: "Gann" },
  { value: "patterns", label: "Patterns" },
  { value: "smc", label: "SMC" },
  { value: "turtle_soup", label: "Turtle Soup" },
  { value: "waves", label: "Waves" },
  { value: "price_action", label: "Price Action" },
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
      // If "تحديد الكل" is clicked
      if (selectedTypes.length === analysisTypes.length - 1) {
        onTypesChange([]); // Deselect all if all were selected
      } else {
        onTypesChange(analysisTypes.map(t => t.value)); // Select all
      }
    } else {
      const newTypes = selectedTypes.includes(type)
        ? selectedTypes.filter((t) => t !== type)
        : [...selectedTypes, type];
      onTypesChange(newTypes);
    }
  };

  return (
    <Card className="p-6 bg-[#FFAC7D] rounded-lg">
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold">أنواع التحليل المراد تنفيذها</h3>
          <p className="text-sm text-red-600">* يمكن اختيار أكثر من إطار زمني</p>
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