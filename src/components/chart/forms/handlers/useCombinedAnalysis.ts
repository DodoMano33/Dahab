
import { useState } from "react";

interface CombinedAnalysisProps {
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

export const useCombinedAnalysis = ({
  symbol,
  defaultSymbol,
  price,
  defaultPrice,
  timeframe,
  duration,
  onSubmit
}: CombinedAnalysisProps) => {
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);

  const handleCombinedAnalysis = (selectedTypes: string[]) => {
    const providedPrice = price ? Number(price) : defaultPrice;
    
    console.log("Starting combined analysis with types:", selectedTypes);
    
    // Only pass selected types, not all boolean flags
    onSubmit(
      symbol || defaultSymbol || "",
      timeframe,
      providedPrice,
      false, // isScalping
      true,  // isAI
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
  };

  return {
    isAIDialogOpen,
    setIsAIDialogOpen,
    handleCombinedAnalysis
  };
};
