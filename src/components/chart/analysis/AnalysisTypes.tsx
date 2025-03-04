
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AnalysisTooltip, analysisTypeTooltips } from "@/components/ui/tooltips/AnalysisTooltips";

export type AnalysisTypeValue = "normal" | "scalping" | "ict" | "smc" | "turtle_soup" | "gann" | "waves" | "patterns" | "price_action";

interface AnalysisType {
  value: AnalysisTypeValue;
  label: string;
  arabicLabel: string;  // Add Arabic label for tooltip
}

const analysisTypes: AnalysisType[] = [
  { value: "normal", label: "تحديد الكل", arabicLabel: "عادي" },
  { value: "scalping", label: "Scalping", arabicLabel: "سكالبينج" },
  { value: "ict", label: "ICT", arabicLabel: "ICT" },
  { value: "gann", label: "Gann", arabicLabel: "Gann" },
  { value: "patterns", label: "Patterns", arabicLabel: "Patterns" },
  { value: "smc", label: "SMC", arabicLabel: "SMC" },
  { value: "turtle_soup", label: "Turtle Soup", arabicLabel: "Turtle Soup" },
  { value: "waves", label: "Waves", arabicLabel: "Waves" },
  { value: "price_action", label: "Price Action", arabicLabel: "Price Action" },
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
      if (selectedTypes.includes("normal")) {
        // If it's currently selected, deselect all
        onTypesChange([]);
      } else {
        // If it's not selected, select all
        onTypesChange(analysisTypes.map(t => t.value));
      }
    } else {
      const newTypes = selectedTypes.includes(type)
        ? selectedTypes.filter((t) => t !== type)
        : [...selectedTypes, type];

      // If all other types are selected, also select "normal"
      const otherTypesSelected = analysisTypes
        .filter(t => t.value !== "normal")
        .every(t => newTypes.includes(t.value));

      if (otherTypesSelected) {
        newTypes.push("normal");
      } else {
        // Remove "normal" if not all types are selected
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
              {type.value === "normal" ? (
                <Label htmlFor={`type-${type.value}`}>{type.label}</Label>
              ) : (
                <AnalysisTooltip content={analysisTypeTooltips[type.arabicLabel] || ''}>
                  <Label htmlFor={`type-${type.value}`} className="cursor-help">{type.label}</Label>
                </AnalysisTooltip>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
