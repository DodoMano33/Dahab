
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { mainAnalysisTypes, getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";

export type AnalysisTypeValue = 
  | "normal" 
  | "fibonacci"
  | "fibonacci_advanced"
  | "gann" 
  | "waves" 
  | "price_action" 
  | "scalping" 
  | "smc" 
  | "ict" 
  | "time_clustering" 
  | "pattern" 
  | "multi_variance" 
  | "neural_network"
  | "behaviors"
  | "turtle_soup"
  | "rnn"
  | "composite_candlesticks";

interface AnalysisTypesProps {
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
}

export const AnalysisTypes = ({
  selectedTypes,
  onTypesChange,
}: AnalysisTypesProps) => {
  // Create analysis types list from mainAnalysisTypes
  const analysisTypes = [
    { value: "normal", label: "Select All" },
    ...mainAnalysisTypes.filter(type => type !== "normal").map(type => ({
      value: type,
      label: getStrategyName(type)
    }))
  ];
  
  // Log the available types for debugging
  console.log("Available analysis types:", analysisTypes.map(t => t.value));
  console.log("Currently selected types:", selectedTypes);
  
  const handleTypeChange = (type: string) => {
    if (type === "normal") {
      // If "Select All" is clicked
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
          <h3 className="text-xl font-semibold">Analysis Types to Execute</h3>
          <p className="text-sm text-gray-700 mt-1">
            {selectedTypes.length} of {analysisTypes.length-1} types selected
          </p>
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
