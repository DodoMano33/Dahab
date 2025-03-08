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
  { value: "normal", label: "Select All" },
  { value: "patterns", label: "Patterns" },
  { value: "scalping", label: "Scalping" },
  { value: "smc", label: "SMC" },
  { value: "ict", label: "ICT" },
  { value: "turtle_soup", label: "Turtle Soup" },
  { value: "gann", label: "Gann" },
  { value: "waves", label: "Waves" },
  { value: "price_action", label: "Price Action" },
  { value: "fibonacci", label: "Fibonacci" },
  { value: "fibonacci_advanced", label: "Advanced Fibonacci" },
  { value: "neural_networks", label: "Neural Networks" },
  { value: "rnn", label: "Recurrent Neural Networks" },
  { value: "time_clustering", label: "Time Clustering" },
  { value: "multi_variance", label: "Multi Variance" },
  { value: "composite_candlestick", label: "Composite Candlestick" },
  { value: "behavioral", label: "Behavioral Analysis" },
];

interface AnalysisTypesProps {
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
}

export const AnalysisTypes = ({
  selectedTypes,
  onTypesChange,
}: AnalysisTypesProps) => {
  console.log("Available analysis types:", analysisTypes.map(t => t.value));
  console.log("Currently selected types:", selectedTypes);
  
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
          <h3 className="text-xl font-semibold">Analysis Types</h3>
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
