import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";

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
    { id: "scalping", label: "سكالبينج" },
    { id: "smc", label: "SMC" },
    { id: "ict", label: "ICT" },
    { id: "turtleSoup", label: "Turtle Soup" },
    { id: "gann", label: "Gann" },
    { id: "waves", label: "Waves" },
    { id: "patterns", label: "Patterns" },
  ];

  const handleCheckboxChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleAnalyze = () => {
    if (selectedTypes.length === 0) {
      toast.error("الرجاء اختيار نوع تحليل واحد على الأقل");
      return;
    }
    onAnalyze(selectedTypes);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right">اختر أنواع التحليل للدمج</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-3">
            {analysisTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-end gap-2">
                <label htmlFor={type.id} className="text-sm font-medium">
                  {type.label}
                </label>
                <Checkbox
                  id={type.id}
                  checked={selectedTypes.includes(type.id)}
                  onCheckedChange={() => handleCheckboxChange(type.id)}
                />
              </div>
            ))}
          </div>
          <Button onClick={handleAnalyze} className="w-full">
            تنفيذ التحليل المدمج
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};