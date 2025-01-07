import { AutoAnalysisButton } from "./AutoAnalysisButton";
import { useAutoAnalysis } from "./hooks/useAutoAnalysis";
import { saveAnalysisToHistory } from "./utils/analysisHistoryUtils";
import { useAnalysisHandler } from "./AnalysisHandler";
import { toast } from "sonner";

interface AutoAnalysisProps {
  selectedTimeframes: string[];
  selectedInterval: string;
  selectedAnalysisTypes: string[];
  onAnalysisComplete?: () => void;
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

    setIsAnalyzing(true);
    const intervalMs = getIntervalInMs(selectedInterval);
    let currentRepetition = 0;

    const runAnalysis = async () => {
      try {
        if (currentRepetition >= repetitions) {
          stopAnalysis();
          return;
        }

        await performAnalysis();
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

  const performAnalysis = async () => {
    for (const timeframe of selectedTimeframes) {
      for (const analysisType of selectedAnalysisTypes) {
        try {
          const result = await handleTradingViewConfig(
            "XAUUSD", // Default symbol
            timeframe,
            2500, // Default price
            analysisType === "scalping",
            false, // isAI
            analysisType === "smc",
            analysisType === "ict",
            analysisType === "turtleSoup",
            analysisType === "gann",
            analysisType === "waves",
            analysisType === "patterns",
            analysisType === "priceAction"
          );

          if (result && result.analysisResult) {
            await saveAnalysisToHistory(
              result,
              "XAUUSD", // symbol
              timeframe,
              analysisType,
              user.id
            );
            if (onAnalysisComplete) {
              onAnalysisComplete();
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