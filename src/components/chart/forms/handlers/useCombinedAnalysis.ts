import { useState } from "react";

interface CombinedAnalysisProps {
  symbol: string;
  defaultSymbol: string;
  price: string;
  defaultPrice: number | null;
  timeframe: string;
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
    isPriceAction?: boolean
  ) => void;
}

export const useCombinedAnalysis = ({
  symbol,
  defaultSymbol,
  price,
  defaultPrice,
  timeframe,
  onSubmit
}: CombinedAnalysisProps) => {
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);

  const handleCombinedAnalysis = (selectedTypes: string[]) => {
    const providedPrice = price ? Number(price) : defaultPrice;
    
    console.log("Starting combined analysis with types:", selectedTypes);
    
    const analysisFlags = {
      isScalping: selectedTypes.includes("scalping"),
      isAI: true,
      isSMC: selectedTypes.includes("smc"),
      isICT: selectedTypes.includes("ict"),
      isTurtleSoup: selectedTypes.includes("turtleSoup"),
      isGann: selectedTypes.includes("gann"),
      isWaves: selectedTypes.includes("waves"),
      isPatternAnalysis: selectedTypes.includes("patterns"),
      isPriceAction: selectedTypes.includes("priceAction")
    };

    onSubmit(
      symbol || defaultSymbol || "",
      timeframe,
      providedPrice,
      analysisFlags.isScalping,
      analysisFlags.isAI,
      analysisFlags.isSMC,
      analysisFlags.isICT,
      analysisFlags.isTurtleSoup,
      analysisFlags.isGann,
      analysisFlags.isWaves,
      analysisFlags.isPatternAnalysis,
      analysisFlags.isPriceAction
    );
  };

  return {
    isAIDialogOpen,
    setIsAIDialogOpen,
    handleCombinedAnalysis
  };
};