
import { CombinedAnalysisDialog } from "../analysis/CombinedAnalysisDialog";
import { AnalysisButtonGroup } from "../buttons/AnalysisButtonGroup";
import { ChartFormInputs } from "./components/ChartFormInputs";
import { useChartAnalysisForm } from "./hooks/useChartAnalysisForm";

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
  const defaultPriceString = defaultPrice ? defaultPrice.toString() : "";
  
  const {
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
  } = useChartAnalysisForm({
    onSubmit,
    defaultSymbol,
    defaultPrice
  });

  return (
    <form className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <ChartFormInputs 
        symbol={symbol}
        setSymbol={setSymbol}
        price={price}
        setPrice={setPrice}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        duration={duration}
        setDuration={setDuration}
        defaultSymbol={defaultSymbol}
        defaultPrice={defaultPriceString}
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
