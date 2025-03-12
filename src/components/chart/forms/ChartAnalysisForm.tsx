
import { useState } from "react";
import { SymbolInput } from "../inputs/SymbolInput";
import { PriceInput } from "../inputs/PriceInput";
import { TimeframeInput } from "../inputs/TimeframeInput";
import { AnalysisButtonGroup } from "../buttons/AnalysisButtonGroup";
import { CombinedAnalysisDialog } from "../analysis/CombinedAnalysisDialog";
import { AnalysisDurationInput } from "../inputs/AnalysisDurationInput";
import { useFormValidation } from "./validation/useFormValidation";
import { useCombinedAnalysis } from "./handlers/useCombinedAnalysis";

interface ChartAnalysisFormProps {
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
  isAnalyzing: boolean;
  onHistoryClick: () => void;
  currentAnalysis?: string;
  defaultSymbol?: string;
  defaultPrice?: number | null;
}

export const ChartAnalysisForm = ({
  onSubmit,
  isAnalyzing,
  onHistoryClick,
  currentAnalysis,
  defaultSymbol,
  defaultPrice
}: ChartAnalysisFormProps) => {
  // تثبيت رمز الذهب كقيمة افتراضية
  const fixedSymbol = "XAUUSD";
  const [symbol, setSymbol] = useState(fixedSymbol);
  const [price, setPrice] = useState(defaultPrice?.toString() || "");
  const [timeframe, setTimeframe] = useState("1d");
  const [duration, setDuration] = useState("8");

  const { validateInputs } = useFormValidation();
  const { isAIDialogOpen, setIsAIDialogOpen, handleCombinedAnalysis } = useCombinedAnalysis({
    symbol: fixedSymbol,
    defaultSymbol: fixedSymbol,
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
    
    const isValid = validateInputs({
      symbol: fixedSymbol,
      defaultSymbol: fixedSymbol,
      price,
      defaultPrice,
      duration
    });

    if (!isValid) return;

    if (isAI && selectedTypes.length > 0) {
      console.log("Smart Analysis with pre-selected types:", selectedTypes);
      const providedPrice = price ? Number(price) : defaultPrice;
      onSubmit(
        fixedSymbol,
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
    
    console.log(`تحليل ${currentAnalysis} للذهب على الإطار الزمني ${timeframe} لمدة ${duration} ساعات`);
    
    const providedPrice = price ? Number(price) : defaultPrice;
    onSubmit(
      fixedSymbol,
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

  return (
    <form className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 mb-4">
        <p className="text-sm font-medium text-yellow-800">
          هذا التطبيق مخصص لتحليل الذهب (XAUUSD) فقط
        </p>
      </div>
      
      <SymbolInput 
        value={fixedSymbol} 
        onChange={() => {}} // لا نسمح بتغيير الرمز
        defaultValue={fixedSymbol}
        disabled={true}
      />
      
      <PriceInput 
        value={price} 
        onChange={setPrice}
        defaultValue={defaultPrice?.toString()}
        tradingViewPrice={defaultPrice}
      />
      
      <AnalysisDurationInput
        value={duration}
        onChange={setDuration}
      />
      
      <TimeframeInput value={timeframe} onChange={setTimeframe} />
      
      <AnalysisButtonGroup
        isAnalyzing={isAnalyzing}
        onSubmit={handleSubmit}
        onHistoryClick={onHistoryClick}
        currentAnalysis={currentAnalysis}
      />
      
      <CombinedAnalysisDialog
        isOpen={isAIDialogOpen}
        onClose={() => setIsAIDialogOpen(false)}
        onAnalyze={handleCombinedAnalysis}
      />
    </form>
  );
};
