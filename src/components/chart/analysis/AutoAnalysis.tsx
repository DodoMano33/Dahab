import { AutoAnalysisButton } from "./AutoAnalysisButton";
import { useAutoAnalysis } from "./hooks/useAutoAnalysis";
import { toast } from "sonner";
import { SearchHistoryItem } from "@/types/analysis";
import { performAnalysis } from "./components/AnalysisPerformer";
import { RepetitionInput } from "./RepetitionInput";

interface AutoAnalysisProps {
  selectedTimeframes: string[];
  selectedInterval: string;
  selectedAnalysisTypes: string[];
  onAnalysisComplete?: (newItem: SearchHistoryItem) => void;
  repetitions?: number;
  onHistoryClick?: () => void;
}

export const AutoAnalysis = ({
  selectedTimeframes,
  selectedInterval,
  selectedAnalysisTypes,
  onAnalysisComplete,
  repetitions = 1,
  onHistoryClick
}: AutoAnalysisProps) => {
  const {
    isAnalyzing,
    setIsAnalyzing,
    analysisInterval,
    setAnalysisInterval,
    validateInputs,
    getIntervalInMs,
    user,
    handleTradingViewConfig
  } = useAutoAnalysis(
    selectedTimeframes,
    selectedInterval,
    selectedAnalysisTypes
  );

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

        for (const timeframe of selectedTimeframes) {
          for (const analysisType of selectedAnalysisTypes) {
            await performAnalysis({
              symbol,
              price: currentPrice,
              timeframe,
              analysisType,
              user,
              handleTradingViewConfig,
              onAnalysisComplete
            });
          }
        }
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

  const stopAnalysis = () => {
    if (analysisInterval) {
      clearInterval(analysisInterval);
      setAnalysisInterval(null);
    }
    setIsAnalyzing(false);
    toast.success("تم إيقاف التحليل التلقائي");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-1/3">
          <RepetitionInput
            repetitions={String(repetitions)}
            onRepetitionsChange={(value) => console.log("Repetitions changed:", value)}
          />
        </div>
        <div className="flex-1">
          <AutoAnalysisButton
            isAnalyzing={isAnalyzing}
            onClick={isAnalyzing ? stopAnalysis : startAnalysis}
            onHistoryClick={onHistoryClick}
            className="w-full h-[88px] text-xl"
          />
        </div>
      </div>
    </div>
  );
};