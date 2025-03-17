
import { useState } from "react";
import { toast } from "sonner";

interface FormSubmitProps {
  symbol: string;
  defaultSymbol?: string;
  timeframe: string;
  duration: string;
  onSubmit: (symbol: string, timeframe: string, isScalping?: boolean, isAI?: boolean, isSMC?: boolean, isICT?: boolean, isTurtleSoup?: boolean, isGann?: boolean, isWaves?: boolean, isPatternAnalysis?: boolean, isPriceAction?: boolean, isNeuralNetwork?: boolean, isRNN?: boolean, isTimeClustering?: boolean, isMultiVariance?: boolean, isCompositeCandlestick?: boolean, isBehavioral?: boolean, isFibonacci?: boolean, isFibonacciAdvanced?: boolean, duration?: string, selectedTypes?: string[]) => void;
}

export const useFormSubmit = ({
  symbol,
  defaultSymbol,
  timeframe,
  duration,
  onSubmit
}: FormSubmitProps) => {
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  
  const validateInputs = () => {
    if (!symbol && !defaultSymbol) {
      toast.error("الرجاء إدخال رمز العملة أو انتظار تحميل الشارت");
      return false;
    }

    const durationHours = Number(duration);
    if (isNaN(durationHours) || durationHours < 1 || durationHours > 72) {
      toast.error("الرجاء إدخال مدة صالحة بين 1 و 72 ساعة");
      return false;
    }

    return true;
  };

  const handleSubmit = (type: string) => {
    if (!validateInputs()) return;
    
    console.log(`Submitting analysis with type ${type}`, {
      symbol: symbol || defaultSymbol,
      timeframe,
      duration
    });

    switch (type) {
      case "فيبوناتشي":
        onSubmit(symbol || defaultSymbol || "", timeframe, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, duration);
        break;
      case "فيبوناتشي متقدم":
        onSubmit(symbol || defaultSymbol || "", timeframe, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, duration);
        break;
      case "سكالبينج":
        onSubmit(symbol || defaultSymbol || "", timeframe, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, duration);
        break;
      case "SMC":
        onSubmit(symbol || defaultSymbol || "", timeframe, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, duration);
        break;
      case "ICT":
        onSubmit(symbol || defaultSymbol || "", timeframe, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, duration);
        break;
      case "Turtle Soup":
        onSubmit(symbol || defaultSymbol || "", timeframe, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, duration);
        break;
      case "Gann":
        onSubmit(symbol || defaultSymbol || "", timeframe, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, duration);
        break;
      case "Price Action":
        onSubmit(symbol || defaultSymbol || "", timeframe, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, duration);
        break;
      case "الذكاء الاصطناعي":
        setIsAIDialogOpen(true);
        break;
      default:
        // نوع تحليل افتراضي - استخدم "Patterns"
        onSubmit(symbol || defaultSymbol || "", timeframe, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, duration);
        break;
    }
  };

  const handleCombinedAnalysis = (selectedTypes: string[]) => {
    if (!validateInputs()) return;
    
    console.log("Submitting combined analysis with types:", selectedTypes, {
      symbol: symbol || defaultSymbol,
      timeframe,
      duration
    });
    
    onSubmit(
      symbol || defaultSymbol || "", 
      timeframe, 
      false, 
      true, 
      false, 
      false, 
      false, 
      false, 
      false, 
      false, 
      false, 
      false, 
      false, 
      false, 
      false, 
      false, 
      false, 
      false, 
      false, 
      duration,
      selectedTypes
    );
    
    setIsAIDialogOpen(false);
  };

  return {
    isAIDialogOpen,
    setIsAIDialogOpen,
    handleSubmit,
    handleCombinedAnalysis
  };
};
