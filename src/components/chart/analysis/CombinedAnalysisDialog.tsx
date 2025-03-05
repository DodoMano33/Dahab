
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, Loader2 } from "lucide-react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const analysisTypes = [
    { id: "scalping", label: "Scalping" },
    { id: "smc", label: "SMC" },
    { id: "ict", label: "ICT" },
    { id: "turtleSoup", label: "Turtle Soup" },
    { id: "gann", label: "Gann" },
    { id: "waves", label: "Waves" },
    { id: "patterns", label: "Patterns" },
    { id: "priceAction", label: "Price Action" },
    { id: "neural_networks", label: "شبكات عصبية" },
    { id: "rnn", label: "شبكات عصبية متكررة" },
    { id: "time_clustering", label: "تصفيق زمني" },
    { id: "multi_variance", label: "تباين متعدد العوامل" },
    { id: "composite_candlestick", label: "شمعات مركبة" },
    { id: "behavioral", label: "تحليل سلوكي" },
    { id: "fibonacci", label: "فيبوناتشي" },
    { id: "fibonacci_advanced", label: "تحليل فيبوناتشي متقدم" }
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
    setIsSubmitting(true);
    
    // Small delay to give visual feedback
    setTimeout(() => {
      onAnalyze(selectedTypes);
      onClose();
      setIsSubmitting(false);
      setSelectedTypes([]);
    }, 300);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setSelectedTypes([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right flex items-center justify-between">
            <Brain className="w-5 h-5 text-green-600" />
            <span>اختر أنواع التحليل</span>
          </DialogTitle>
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
          <div className="grid grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2">
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
            disabled={selectedTypes.length === 0 || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري التحليل...
              </>
            ) : (
              'تحليل'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
