import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare, Square } from "lucide-react";

interface CombinedAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (selectedTypes: string[]) => void;
}

export const CombinedAnalysisDialog = ({
  isOpen,
  onClose,
  onAnalyze,
}: CombinedAnalysisDialogProps) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const analysisTypes = [
    { id: "scalping", label: "Scalping" },
    { id: "smc", label: "SMC" },
    { id: "ict", label: "ICT" },
    { id: "turtleSoup", label: "Turtle Soup" },
    { id: "gann", label: "Gann" },
    { id: "waves", label: "Waves" },
    { id: "patterns", label: "Patterns" },
    { id: "priceAction", label: "Price Action" }
  ];

  const handleSelectAll = () => {
    if (selectedTypes.length === analysisTypes.length) {
      setSelectedTypes([]);
    } else {
      setSelectedTypes(analysisTypes.map(type => type.id));
    }
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleAnalyze = () => {
    if (selectedTypes.length === 0) {
      return;
    }
    onAnalyze(selectedTypes);
    onClose();
    setSelectedTypes([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      onClose();
      setSelectedTypes([]);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right">اختر أنواع التحليل</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="select-all"
              checked={selectedTypes.length === analysisTypes.length}
              onCheckedChange={handleSelectAll}
            />
            <label
              htmlFor="select-all"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              تحديد الكل
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {analysisTypes.map(type => (
              <div key={type.id} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={type.id}
                  checked={selectedTypes.includes(type.id)}
                  onCheckedChange={() => handleTypeToggle(type.id)}
                />
                <label
                  htmlFor={type.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleAnalyze}
            disabled={selectedTypes.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            تحليل
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};