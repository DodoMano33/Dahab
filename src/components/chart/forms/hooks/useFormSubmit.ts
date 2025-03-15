
import { useState } from "react";
import { useFormValidation } from "../validation/useFormValidation";

interface UseFormSubmitProps {
  symbol: string;
  defaultSymbol: string;
  price: string;
  defaultPrice: number | null;
  timeframe: string;
  duration: string;
  onSubmit: (
    symbol: string,
    timeframe: string,
    providedPrice?: number,
    isScalping?: boolean,
    isAI?: boolean,
    isSMC?: boolean,
    isICT?: boolean,
    isTurtleSoup?: boolean,
    isGann?: boolean,
    isWaves?: boolean,
    isPatternAnalysis?: boolean,
    isPriceAction?: boolean,
    isNeuralNetwork?: boolean,
    isRNN?: boolean,
    isTimeClustering?: boolean,
    isMultiVariance?: boolean,
    isCompositeCandlestick?: boolean,
    isBehavioral?: boolean,
    isFibonacci?: boolean,
    isFibonacciAdvanced?: boolean,
    duration?: string,
    selectedTypes?: string[]
  ) => void;
}

export const useFormSubmit = ({
  symbol,
  defaultSymbol,
  price,
  defaultPrice,
  timeframe,
  duration,
  onSubmit
}: UseFormSubmitProps) => {
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const { validateInputs } = useFormValidation();

  const handleSubmit = (
    e: React.MouseEvent,
    isScalping: boolean = false,
    isAI: boolean = false,
    isSMC: boolean = false,
    isICT: boolean = false,
    isTurtleSoup: boolean = false,
    isGann: boolean = false,
    isWaves: boolean = false,
    isPatternAnalysis: boolean = false,
    isPriceAction: boolean = false,
    isNeuralNetwork: boolean = false,
    isRNN: boolean = false,
    isTimeClustering: boolean = false,
    isMultiVariance: boolean = false,
    isCompositeCandlestick: boolean = false,
    isBehavioral: boolean = false,
    isFibonacci: boolean = false,
    isFibonacciAdvanced: boolean = false,
    selectedTypes: string[] = []
  ) => {
    e.preventDefault();
    
    const isValid = validateInputs({
      symbol: symbol,
      defaultSymbol: defaultSymbol,
      price,
      defaultPrice,
      duration
    });

    if (!isValid) return;

    if (isAI && selectedTypes.length > 0) {
      console.log("Smart Analysis with pre-selected types:", selectedTypes);
      const providedPrice = price ? Number(price) : defaultPrice;
      onSubmit(
        symbol,
        timeframe,
        providedPrice,
        isScalping,
        isAI,
        isSMC,
        isICT,
        isTurtleSoup,
        isGann,
        isWaves,
        isPatternAnalysis,
        isPriceAction,
        isNeuralNetwork,
        isRNN,
        isTimeClustering,
        isMultiVariance,
        isCompositeCandlestick,
        isBehavioral,
        isFibonacci,
        isFibonacciAdvanced,
        duration,
        selectedTypes
      );
      return;
    }
    
    if (isAI) {
      setIsAIDialogOpen(true);
      return;
    }
    
    console.log(`تحليل للذهب على الإطار الزمني ${timeframe} لمدة ${duration} ساعات`);
    
    const providedPrice = price ? Number(price) : defaultPrice;
    onSubmit(
      symbol,
      timeframe,
      providedPrice,
      isScalping,
      isAI,
      isSMC,
      isICT,
      isTurtleSoup,
      isGann,
      isWaves,
      isPatternAnalysis,
      isPriceAction,
      isNeuralNetwork,
      isRNN,
      isTimeClustering,
      isMultiVariance,
      isCompositeCandlestick,
      isBehavioral,
      isFibonacci,
      isFibonacciAdvanced,
      duration
    );
  };

  const handleCombinedAnalysis = (selectedTypes: string[]) => {
    console.log("Combined analysis with types:", selectedTypes);
    
    const providedPrice = price ? Number(price) : defaultPrice;
    
    onSubmit(
      symbol,
      timeframe,
      providedPrice,
      false, // isScalping
      true, // isAI
      false, // isSMC
      false, // isICT
      false, // isTurtleSoup
      false, // isGann
      false, // isWaves
      false, // isPatternAnalysis
      false, // isPriceAction
      false, // isNeuralNetwork
      false, // isRNN
      false, // isTimeClustering
      false, // isMultiVariance
      false, // isCompositeCandlestick
      false, // isBehavioral
      false, // isFibonacci
      false, // isFibonacciAdvanced
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
