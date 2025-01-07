import { AutoAnalysisButton } from "./AutoAnalysisButton";
import { useAutoAnalysis } from "./hooks/useAutoAnalysis";
import { saveAnalysisToHistory } from "./utils/analysisHistoryUtils";
import { useAnalysisHandler } from "./AnalysisHandler";
import { toast } from "sonner";

interface AutoAnalysisProps {
  symbol: string;
  price: string;
  selectedTimeframes: string[];
  selectedInterval: string;
  selectedAnalysisTypes: string[];
}

export const AutoAnalysis = ({
  symbol,
  price,
  selectedTimeframes,
  selectedInterval,
  selectedAnalysisTypes,
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
    symbol,
    price,
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

    setIsAnalyzing(true);
    console.log("بدء التحليل التلقائي:", {
      timeframes: selectedTimeframes,
      interval: selectedInterval,
      analysisTypes: selectedAnalysisTypes
    });

    const intervalMs = getIntervalInMs(selectedInterval);
    const numericPrice = Number(price);

    const runAnalysis = async () => {
      try {
        for (const timeframe of selectedTimeframes) {
          for (const analysisType of selectedAnalysisTypes) {
            const result = await handleTradingViewConfig(
              symbol,
              timeframe,
              numericPrice,
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
              await saveAnalysisToHistory(result, symbol, timeframe, analysisType, user.id);
            }
          }
        }
      } catch (error) {
        console.error("خطأ في التحليل التلقائي:", error);
        toast.error("حدث خطأ أثناء التحليل التلقائي");
      }
    };

    // Run initial analysis
    await runAnalysis();

    // Set up interval for repeated analysis
    const interval = setInterval(runAnalysis, intervalMs);
    setAnalysisInterval(interval);
    toast.success("تم بدء التحليل التلقائي");
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
      disabled={!symbol || !price}
    />
  );
};