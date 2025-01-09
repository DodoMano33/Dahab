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

    // Get the current symbol and price from the form fields
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

  const getAnalysisType = (type: string): AnalysisData['analysisType'] => {
    switch (type) {
      case 'scalping': return 'سكالبينج';
      case 'smc': return 'SMC';
      case 'ict': return 'ICT';
      case 'turtleSoup': return 'Turtle Soup';
      case 'gann': return 'Gann';
      case 'waves': return 'Waves';
      case 'patterns': return 'Patterns';
      case 'priceAction': return 'Price Action';
      default: return 'Patterns';
    }
  };

  const performAnalysis = async (symbol: string, price: number) => {
    for (const timeframe of selectedTimeframes) {
      for (const analysisType of selectedAnalysisTypes) {
        try {
          console.log(`Performing analysis for ${timeframe} - ${analysisType}`);
          
          const result = await handleTradingViewConfig(
            symbol,
            timeframe,
            price,
            analysisType === "scalping",
            false,
            analysisType === "smc",
            analysisType === "ict",
            analysisType === "turtleSoup",
            analysisType === "gann",
            analysisType === "waves",
            analysisType === "patterns",
            analysisType === "priceAction"
          );

          if (result && result.analysisResult) {
            console.log("Analysis result received:", result);
            
            const mappedAnalysisType = getAnalysisType(analysisType);
            const savedData = await saveAnalysisToHistory(
              result,
              symbol,
              timeframe,
              mappedAnalysisType,
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
                analysisType: mappedAnalysisType,
                timeframe: timeframe
              };
              
              console.log("Calling onAnalysisComplete with new entry:", newHistoryEntry);
              onAnalysisComplete(newHistoryEntry);
            }
          }
        } catch (error) {
          console.error(`Error analyzing ${analysisType} on ${timeframe}:`, error);
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
