import { AutoAnalysisButton } from "./AutoAnalysisButton";
import { useAnalysisExecution } from "./hooks/useAnalysisExecution";
import { saveAnalysisToHistory } from "./utils/analysisHistoryUtils";
import { mapAnalysisType } from "./utils/analysisTypeMapper";
import { SearchHistoryItem } from "@/types/analysis";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  
  const {
    isAnalyzing,
    setIsAnalyzing,
    analysisInterval,
    setAnalysisInterval,
    validateInputs,
    getIntervalInMs,
    handleTradingViewConfig
  } = useAnalysisExecution({
    selectedTimeframes,
    selectedInterval,
    selectedAnalysisTypes,
    onAnalysisComplete,
    user
  });

  const performAnalysis = async (symbol: string, price: number) => {
    for (const timeframe of selectedTimeframes) {
      for (const analysisType of selectedAnalysisTypes) {
        try {
          console.log(`بدء تحليل ${timeframe} - ${analysisType}`);
          
          // تعيين المتغيرات بناءً على نوع التحليل
          const analysisConfig = {
            isScalping: analysisType === "scalping",
            isAI: false,
            isSMC: analysisType === "smc",
            isICT: analysisType === "ict",
            isTurtleSoup: analysisType === "turtleSoup",
            isGann: analysisType === "gann",
            isWaves: analysisType === "waves",
            isPatternAnalysis: analysisType === "patterns",
            isPriceAction: analysisType === "priceAction"
          };

          const result = await handleTradingViewConfig(
            symbol,
            timeframe,
            price,
            analysisConfig.isScalping,
            analysisConfig.isAI,
            analysisConfig.isSMC,
            analysisConfig.isICT,
            analysisConfig.isTurtleSoup,
            analysisConfig.isGann,
            analysisConfig.isWaves,
            analysisConfig.isPatternAnalysis,
            analysisConfig.isPriceAction
          );

          if (result && result.analysisResult) {
            console.log("نتيجة التحليل:", result);
            
            // تحويل نوع التحليل مع التحقق من صحته
            const mappedAnalysisType = mapAnalysisType(analysisType);
            console.log("نوع التحليل المحول:", mappedAnalysisType);

            // تعيين نوع التحليل في نتيجة التحليل
            result.analysisResult.analysisType = mappedAnalysisType;
            
            const savedData = await saveAnalysisToHistory(
              result,
              symbol,
              timeframe,
              mappedAnalysisType,
              user.id
            );

            if (onAnalysisComplete) {
              const newHistoryEntry: SearchHistoryItem = {
                id: savedData.id,
                date: new Date(),
                symbol: symbol,
                currentPrice: price,
                analysis: {
                  ...result.analysisResult,
                  analysisType: mappedAnalysisType
                },
                analysisType: mappedAnalysisType,
                timeframe: timeframe
              };
              
              console.log("إضافة عنصر جديد إلى السجل:", newHistoryEntry);
              onAnalysisComplete(newHistoryEntry);
            }
          }
        } catch (error) {
          console.error(`خطأ في تحليل ${analysisType} على ${timeframe}:`, error);
          toast.error(`فشل في تحليل ${analysisType} على ${timeframe}`);
        }
      }
    }
  };

  const startAnalysis = async () => {
    if (!validateInputs()) return;

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