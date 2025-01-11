import { AutoAnalysisButton } from "./AutoAnalysisButton";
import { useAutoAnalysis } from "./hooks/useAutoAnalysis";
import { saveAnalysisToHistory } from "./utils/analysisHistoryUtils";
import { useAnalysisHandler } from "./AnalysisHandler";
import { toast } from "sonner";
import { SearchHistoryItem, AnalysisData } from "@/types/analysis";

interface AutoAnalysisProps {
  selectedTimeframes: string[];
  selectedInterval: string;
  selectedAnalysisTypes: string[];
  onAnalysisComplete?: (newItem: SearchHistoryItem) => void;
  repetitions?: number;
}

export const AutoAnalysis = ({
  selectedTimeframes,
  selectedInterval,
  selectedAnalysisTypes,
  onAnalysisComplete,
  repetitions = 1
}: AutoAnalysisProps) => {
  const {
    isAnalyzing,
    setIsAnalyzing,
    analysisInterval,
    setAnalysisInterval,
    validateInputs,
    getIntervalInMs,
    user
  } = useAutoAnalysis(
    selectedTimeframes,
    selectedInterval,
    selectedAnalysisTypes
  );

  const { handleTradingViewConfig } = useAnalysisHandler();

  const startAnalysis = async () => {
    if (!user) {
      toast.error("يرجى تسجيل الدخول لبدء التحليل التلقائي");
      return;
    }

    if (!validateInputs()) {
      return;
    }

    const symbolInput = document.querySelector('input#symbol') as HTMLInputElement;
    const priceInput = document.querySelector('input#price') as HTMLInputElement;

    if (!symbolInput?.value || !priceInput?.value) {
      toast.error("الرجاء إدخال رمز العملة والسعر قبل بدء التحليل التلقائي");
      return;
    }

    const symbol = symbolInput.value.toUpperCase();
    const currentPrice = Number(priceInput.value);

    if (isNaN(currentPrice) || currentPrice <= 0) {
      toast.error("الرجاء إدخال سعر صحيح");
      return;
    }

    setIsAnalyzing(true);
    const intervalMs = getIntervalInMs(selectedInterval);
    let currentRepetition = 0;

    const runAnalysis = async () => {
      try {
        if (currentRepetition >= repetitions) {
          stopAnalysis();
          return;
        }

        await performAnalysis(symbol, currentPrice);
        currentRepetition++;
      } catch (error) {
        console.error("خطأ في التحليل التلقائي:", error);
        toast.error("حدث خطأ أثناء التحليل التلقائي");
      }
    };

    await runAnalysis();
    const interval = setInterval(runAnalysis, intervalMs);
    setAnalysisInterval(interval);
    toast.success("تم بدء التحليل التلقائي");
  };

  const performAnalysis = async (symbol: string, price: number) => {
    console.log("Starting analysis for timeframes:", selectedTimeframes);
    console.log("Selected analysis types:", selectedAnalysisTypes);

    for (const timeframe of selectedTimeframes) {
      for (const analysisType of selectedAnalysisTypes) {
        try {
          console.log(`Starting analysis for ${timeframe} - ${analysisType}`);
          
          // Map analysis type to correct configuration
          const config = {
            isScalping: analysisType === 'Scalping',
            isSMC: analysisType === 'SMC',
            isICT: analysisType === 'ICT',
            isTurtleSoup: analysisType === 'Turtle Soup',
            isGann: analysisType === 'Gann',
            isWaves: analysisType === 'Waves',
            isPatternAnalysis: analysisType === 'Patterns',
            isPriceAction: analysisType === 'Price Action'
          };

          console.log("Analysis configuration:", config);
          
          const result = await handleTradingViewConfig(
            symbol,
            timeframe,
            price,
            config.isScalping,
            false, // isAI
            config.isSMC,
            config.isICT,
            config.isTurtleSoup,
            config.isGann,
            config.isWaves,
            config.isPatternAnalysis,
            config.isPriceAction
          );

          if (result && result.analysisResult) {
            console.log("Analysis completed successfully:", result);
            
            const savedData = await saveAnalysisToHistory(
              result,
              symbol,
              timeframe,
              analysisType,
              user.id
            );

            console.log("Analysis saved to history:", savedData);

            if (onAnalysisComplete) {
              const newHistoryEntry: SearchHistoryItem = {
                id: savedData.id,
                date: new Date(),
                symbol: symbol,
                currentPrice: price,
                analysis: result.analysisResult,
                analysisType: analysisType,
                timeframe: timeframe
              };
              
              console.log("Adding new analysis to history:", newHistoryEntry);
              onAnalysisComplete(newHistoryEntry);
            }

            toast.success(`تم إكمال تحليل ${analysisType} على الإطار الزمني ${timeframe}`);
          }
        } catch (error) {
          console.error(`Error in ${analysisType} analysis on ${timeframe}:`, error);
          toast.error(`فشل في تحليل ${analysisType} على ${timeframe}`);
        }
      }
    }
  };

  const stopAnalysis = () => {
    if (analysisInterval) {
      clearInterval(analysisInterval);
      setAnalysisInterval(null);
    }
    setIsAnalyzing(false);
    toast.success("تم إيقاف التحليل التلقائي");
  };

  return (
    <AutoAnalysisButton
      isAnalyzing={isAnalyzing}
      onClick={isAnalyzing ? stopAnalysis : startAnalysis}
    />
  );
};