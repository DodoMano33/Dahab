
import { useState, useEffect } from "react";
import { useFormValidation } from "../validation/useFormValidation";
import { useCombinedAnalysis } from "../handlers/useCombinedAnalysis";

interface UseChartAnalysisFormProps {
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
  defaultSymbol?: string;
  defaultPrice?: number | null;
}

export const useChartAnalysisForm = ({
  onSubmit,
  defaultSymbol,
  defaultPrice
}: UseChartAnalysisFormProps) => {
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState("");
  const [timeframe, setTimeframe] = useState("1d");
  const [duration, setDuration] = useState("8");
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  
  // Log default values changes
  useEffect(() => {
    console.log("ChartAnalysisForm hook default values:", {
      defaultSymbol,
      defaultPrice,
      defaultPriceString: defaultPrice ? defaultPrice.toString() : ""
    });
  }, [defaultSymbol, defaultPrice]);

  const { validateInputs } = useFormValidation();
  
  const { handleCombinedAnalysis } = useCombinedAnalysis({
    symbol,
    defaultSymbol: defaultSymbol || "",
    price,
    defaultPrice,
    timeframe,
    duration,
    onSubmit
  });

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
    
    console.log("Form submission values:", {
      symbol,
      defaultSymbol,
      price,
      defaultPrice,
      finalSymbol: symbol || defaultSymbol || "",
      finalPrice: price ? Number(price) : defaultPrice
    });
    
    const isValid = validateInputs({
      symbol,
      defaultSymbol,
      price,
      defaultPrice,
      duration
    });

    if (!isValid) return;

    // Handle AI analysis with pre-selected types
    if (isAI && selectedTypes.length > 0) {
      console.log("Smart Analysis with pre-selected types:", selectedTypes);
      const providedPrice = price ? Number(price) : defaultPrice;
      onSubmit(
        symbol || defaultSymbol || "",
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
    
    // Show dialog for AI analysis without pre-selected types
    if (isAI) {
      setIsAIDialogOpen(true);
      return;
    }
    
    console.log(`Standard analysis for symbol ${symbol || defaultSymbol} on timeframe ${timeframe} for ${duration} hours`);
    
    const providedPrice = price ? Number(price) : defaultPrice;
    onSubmit(
      symbol || defaultSymbol || "",
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

  return {
    symbol,
    setSymbol,
    price,
    setPrice,
    timeframe,
    setTimeframe,
    duration,
    setDuration,
    isAIDialogOpen,
    setIsAIDialogOpen,
    handleSubmit,
    handleCombinedAnalysis
  };
};
