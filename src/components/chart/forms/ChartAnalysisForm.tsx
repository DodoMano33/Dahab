
import { useState, useEffect } from "react";
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
    duration?: string
  ) => void;
  isAnalyzing: boolean;
  onHistoryClick: () => void;
  currentAnalysis?: string;
  defaultSymbol?: string;
  defaultPrice?: number | null;
  onUpdateChartSymbol?: (symbol: string) => void;
}

export const ChartAnalysisForm = ({
  onSubmit,
  isAnalyzing,
  onHistoryClick,
  currentAnalysis,
  defaultSymbol,
  defaultPrice,
  onUpdateChartSymbol
}: ChartAnalysisFormProps) => {
  const [symbol, setSymbol] = useState(defaultSymbol || "");
  const [price, setPrice] = useState(defaultPrice?.toString() || "");
  const [timeframe, setTimeframe] = useState("1d");
  const [duration, setDuration] = useState("8");
  const [isChartSynced, setIsChartSynced] = useState(false);

  const { validateInputs } = useFormValidation();
  const { isAIDialogOpen, setIsAIDialogOpen, handleCombinedAnalysis } = useCombinedAnalysis({
    symbol,
    defaultSymbol: defaultSymbol || "",
    price,
    defaultPrice,
    timeframe,
    duration,
    onSubmit
  });

  // Sync with TradingView symbol changes
  useEffect(() => {
    if (defaultSymbol && defaultSymbol !== symbol) {
      console.log(`Updating symbol input from chart: ${defaultSymbol}`);
      setSymbol(defaultSymbol);
      setIsChartSynced(true);
      
      // Reset flag after a moment
      const timer = setTimeout(() => {
        setIsChartSynced(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [defaultSymbol]);

  // Sync with TradingView price changes
  useEffect(() => {
    if (defaultPrice && (!price || isChartSynced)) {
      console.log(`Updating price input from chart: ${defaultPrice}`);
      setPrice(defaultPrice.toString());
    }
  }, [defaultPrice, isChartSynced]);

  const handlePriceUpdate = (newPrice: number | null) => {
    if (newPrice) {
      setPrice(newPrice.toString());
    }
  };

  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
    // Update TradingView chart if handler provided
    if (onUpdateChartSymbol) {
      onUpdateChartSymbol(newSymbol);
    }
  };

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
    isBehavioral: boolean = false
  ) => {
    e.preventDefault();
    
    const isValid = validateInputs({
      symbol,
      defaultSymbol,
      price,
      defaultPrice,
      duration
    });

    if (!isValid) return;

    if (isAI) {
      setIsAIDialogOpen(true);
      return;
    }
    
    console.log(`تحليل ${currentAnalysis} للرمز ${symbol || defaultSymbol} على الإطار الزمني ${timeframe} لمدة ${duration} ساعات`);
    
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
      duration
    );
  };

  return (
    <form className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <SymbolInput 
        value={symbol} 
        onChange={handleSymbolChange} 
        defaultValue={defaultSymbol}
        onPriceUpdate={handlePriceUpdate}
        updateChart={true}
        onUpdateChart={onUpdateChartSymbol}
      />
      <PriceInput 
        value={price} 
        onChange={setPrice}
        defaultValue={defaultPrice?.toString()}
        isAutoPriceEnabled={true}
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
