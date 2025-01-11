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

  const getAnalysisType = (type: string): AnalysisData['analysisType'] => {
    // تنظيف النص وإزالة المسافات الزائدة
    const cleanType = type.trim().toLowerCase();
    
    switch (cleanType) {
      case 'scalping': return 'سكالبينج';
      case 'smc': return 'SMC';
      case 'ict': return 'ICT';
      case 'turtle soup': return 'Turtle Soup';
      case 'gann': return 'Gann';
      case 'waves': return 'Waves';
      case 'patterns': return 'Patterns';
      case 'price action': return 'Price Action';
      default: throw new Error(`نوع تحليل غير صالح: ${type}`);
    }
  };

  const performAnalysis = async (symbol: string, price: number) => {
    for (const timeframe of selectedTimeframes) {
      for (const analysisType of selectedAnalysisTypes) {
        try {
          console.log(`بدء التحليل للإطار الزمني ${timeframe} - نوع التحليل ${analysisType}`);
          
          // تحديد نوع التحليل بناءً على الاختيار
          const isScalping = analysisType === 'Scalping';
          const isSMC = analysisType === 'SMC';
          const isICT = analysisType === 'ICT';
          const isTurtleSoup = analysisType === 'Turtle Soup';
          const isGann = analysisType === 'Gann';
          const isWaves = analysisType === 'Waves';
          const isPatternAnalysis = analysisType === 'Patterns';
          const isPriceAction = analysisType === 'Price Action';

          console.log("تكوين التحليل:", {
            isScalping,
            isSMC,
            isICT,
            isTurtleSoup,
            isGann,
            isWaves,
            isPatternAnalysis,
            isPriceAction
          });
          
          const result = await handleTradingViewConfig(
            symbol,
            timeframe,
            price,
            isScalping,
            false, // isAI is always false for individual analysis
            isSMC,
            isICT,
            isTurtleSoup,
            isGann,
            isWaves,
            isPatternAnalysis,
            isPriceAction
          );

          if (result && result.analysisResult) {
            console.log("تم استلام نتائج التحليل:", result);
            
            const mappedAnalysisType = getAnalysisType(analysisType);
            const savedData = await saveAnalysisToHistory(
              result,
              symbol,
              timeframe,
              mappedAnalysisType,
              user.id
            );

            console.log("تم حفظ التحليل في السجل:", savedData);

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
              
              console.log("إضافة تحليل جديد إلى السجل:", newHistoryEntry);
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