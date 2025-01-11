import { AutoAnalysisButton } from "./AutoAnalysisButton";
import { useAutoAnalysis } from "./hooks/useAutoAnalysis";
import { saveAnalysisToHistory } from "./utils/analysisHistoryUtils";
import { useAnalysisHandler } from "./AnalysisHandler";
import { toast } from "sonner";
import { SearchHistoryItem, AnalysisData, AnalysisType } from "@/types/analysis";

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

  const mapAnalysisTypeToConfig = (analysisType: string) => {
    const typeMapping: Record<string, {
      isScalping: boolean;
      isSMC: boolean;
      isICT: boolean;
      isTurtleSoup: boolean;
      isGann: boolean;
      isWaves: boolean;
      isPatternAnalysis: boolean;
      isPriceAction: boolean;
    }> = {
      'scalping': { isScalping: true, isSMC: false, isICT: false, isTurtleSoup: false, isGann: false, isWaves: false, isPatternAnalysis: false, isPriceAction: false },
      'smc': { isScalping: false, isSMC: true, isICT: false, isTurtleSoup: false, isGann: false, isWaves: false, isPatternAnalysis: false, isPriceAction: false },
      'ict': { isScalping: false, isSMC: false, isICT: true, isTurtleSoup: false, isGann: false, isWaves: false, isPatternAnalysis: false, isPriceAction: false },
      'turtle_soup': { isScalping: false, isSMC: false, isICT: false, isTurtleSoup: true, isGann: false, isWaves: false, isPatternAnalysis: false, isPriceAction: false },
      'gann': { isScalping: false, isSMC: false, isICT: false, isTurtleSoup: false, isGann: true, isWaves: false, isPatternAnalysis: false, isPriceAction: false },
      'waves': { isScalping: false, isSMC: false, isICT: false, isTurtleSoup: false, isGann: false, isWaves: true, isPatternAnalysis: false, isPriceAction: false },
      'patterns': { isScalping: false, isSMC: false, isICT: false, isTurtleSoup: false, isGann: false, isWaves: false, isPatternAnalysis: true, isPriceAction: false },
      'price_action': { isScalping: false, isSMC: false, isICT: false, isTurtleSoup: false, isGann: false, isWaves: false, isPatternAnalysis: false, isPriceAction: true }
    };

    // إذا لم يكن نوع التحليل موجوداً في التعيين، نرجع كائناً جديداً بدلاً من استخدام patterns كقيمة افتراضية
    return typeMapping[analysisType] || {
      isScalping: false,
      isSMC: false,
      isICT: false,
      isTurtleSoup: false,
      isGann: false,
      isWaves: false,
      isPatternAnalysis: false,
      isPriceAction: false
    };
  };

  const mapToAnalysisType = (analysisType: string): AnalysisType => {
    const mapping: Record<string, AnalysisType> = {
      'scalping': 'سكالبينج',
      'price_action': 'Price Action',
      'turtle_soup': 'Turtle Soup',
      'smc': 'SMC',
      'ict': 'ICT',
      'gann': 'Gann',
      'waves': 'Waves',
      'patterns': 'Patterns'
    };
    
    return mapping[analysisType] || 'Patterns';
  };

  const performAnalysis = async (symbol: string, price: number) => {
    console.log("Starting analysis for timeframes:", selectedTimeframes);
    console.log("Selected analysis types:", selectedAnalysisTypes);

    for (const timeframe of selectedTimeframes) {
      for (const analysisType of selectedAnalysisTypes) {
        try {
          console.log(`Starting analysis for ${timeframe} - ${analysisType}`);
          
          const config = mapAnalysisTypeToConfig(analysisType);
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
            
            const mappedAnalysisType = mapToAnalysisType(analysisType);

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
              
              console.log("Adding new analysis to history:", newHistoryEntry);
              onAnalysisComplete(newHistoryEntry);
            }

            toast.success(`تم إكمال تحليل ${mappedAnalysisType} على الإطار الزمني ${timeframe}`);
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