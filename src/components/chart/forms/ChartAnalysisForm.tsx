
import { useState } from "react";
import { AnalysisButtonGroup } from "../buttons/AnalysisButtonGroup";
import { CombinedAnalysisDialog } from "../analysis/CombinedAnalysisDialog";
import { FormHeader } from "./components/FormHeader";
import { FormInputs } from "./components/FormInputs";
import { useFormSubmit } from "./hooks/useFormSubmit";

interface ChartAnalysisFormProps {
  onSubmit: (
    symbol: string,
    timeframe: string,
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
}

export const ChartAnalysisForm = ({
  onSubmit,
  isAnalyzing,
  onHistoryClick,
  currentAnalysis,
  defaultSymbol
}: ChartAnalysisFormProps) => {
  // تثبيت رمز الذهب كقيمة افتراضية
  const fixedSymbol = "XAUUSD";
  const [symbol, setSymbol] = useState(fixedSymbol);
  const [timeframe, setTimeframe] = useState("1d");
  const [duration, setDuration] = useState("8");

  const {
    isAIDialogOpen, 
    setIsAIDialogOpen, 
    handleSubmit,
    handleCombinedAnalysis
  } = useFormSubmit({
    symbol: fixedSymbol,
    defaultSymbol: fixedSymbol,
    timeframe,
    duration,
    onSubmit
  });

  return (
    <form className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <FormHeader />
      
      <FormInputs
        symbol={fixedSymbol}
        setSymbol={setSymbol}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        duration={duration}
        setDuration={setDuration}
      />
      
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
