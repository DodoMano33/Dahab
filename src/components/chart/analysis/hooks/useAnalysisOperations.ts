
import { toast } from "sonner";
import { clearSupabaseCache, clearSearchHistoryCache } from "@/utils/supabaseCache";
import { performAnalysis } from "../components/AnalysisPerformer";
import { AutoAnalysisConfig, TradingViewConfigHandler, AnalysisParameters } from "../types/autoAnalysisTypes";

export const useAnalysisOperations = (
  setIsAnalyzing: (isAnalyzing: boolean) => void,
  abortControllerRef: React.MutableRefObject<AbortController | null>,
  intervalRef: React.MutableRefObject<NodeJS.Timeout | null>
) => {
  const stopAnalysisOperations = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const clearCaches = async () => {
    try {
      await clearSupabaseCache();
      await clearSearchHistoryCache();
    } catch (error) {
      console.error("Error clearing cache:", error);
      // Continue despite errors
    }
  };

  const createTradingViewConfigHandler = (): TradingViewConfigHandler => {
    return (
      symbol: string,
      timeframe: string,
      currentPrice: number,
      isScalping?: boolean,
      isAI?: boolean,
      isSMC?: boolean,
      isICT?: boolean,
      isTurtleSoup?: boolean,
      isGann?: boolean,
      isWaves?: boolean,
      isPatternAnalysis?: boolean,
      isPriceAction?: boolean
    ) => {
      // محاكاة استجابة من TradingView
      return {
        analysisResult: {
          symbol,
          timeframe,
          currentPrice,
          analysisType: isScalping ? "scalping" : 
                      isSMC ? "smc" : 
                      isICT ? "ict" : 
                      isTurtleSoup ? "turtle_soup" : 
                      isGann ? "gann" : 
                      isWaves ? "waves" : 
                      isPatternAnalysis ? "patterns" : 
                      isPriceAction ? "price_action" : "normal",
          direction: Math.random() > 0.5 ? "صاعد" : "هابط",
          targets: [currentPrice * 1.01, currentPrice * 1.02, currentPrice * 1.03],
          stopLoss: currentPrice * 0.98,
          entryPoint: currentPrice,
          analysis: `تحليل تلقائي لـ ${symbol} على الإطار الزمني ${timeframe}`,
          confidence: Math.random() * 100,
          pattern: "نمط السعر"
        }
      };
    };
  };

  const executeAnalysis = async (params: AnalysisParameters, signal: AbortSignal) => {
    if (signal.aborted) return;
    
    console.log(`Performing ${params.analysisType} analysis on ${params.timeframe} timeframe`);
    
    try {
      // Add a small delay between operations
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Clear cache before each analysis
      await clearCaches();
      
      await performAnalysis(params);
      
      // إضافة تأخير صغير بين التحليلات
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error during ${params.analysisType} on ${params.timeframe}:`, error);
      
      // محاولة مرة أخرى بعد مسح التخزين المؤقت للمخطط
      try {
        await clearCaches();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log(`Retrying ${params.analysisType} on ${params.timeframe}...`);
        await performAnalysis(params);
      } catch (retryError) {
        console.error(`Retry also failed for ${params.analysisType} on ${params.timeframe}:`, retryError);
        toast.error(`فشل تحليل ${params.analysisType} على الإطار ${params.timeframe}`);
        
        // Continue with the next analysis instead of stopping everything
      }
    }
  };

  const performAnalysisCycle = async (config: AutoAnalysisConfig, user: any) => {
    await clearCaches();
    
    toast.success(`بدء التحليل التلقائي لـ ${config.symbol} على ${config.timeframes.length} إطار زمني و ${config.analysisTypes.length} نوع تحليل`);

    const handleTradingViewConfig = createTradingViewConfigHandler();
    const signal = abortControllerRef.current!.signal;
    
    let counter = 0;
    const maxAnalyses = config.repetitions > 0 ? config.repetitions : 1;

    const runCycle = async () => {
      if (signal.aborted || counter >= maxAnalyses) {
        stopAnalysisOperations();
        setIsAnalyzing(false);
        return;
      }

      counter++;
      console.log(`Starting analysis cycle ${counter} of ${maxAnalyses}`);

      // تنظيف ذاكرة التخزين المؤقت بشكل دوري
      if (counter % 3 === 0) {
        await clearCaches();
      }

      for (const timeframe of config.timeframes) {
        if (signal.aborted) break;
        
        for (const analysisType of config.analysisTypes) {
          if (signal.aborted) break;
          
          await executeAnalysis({
            symbol: config.symbol,
            price: config.currentPrice,
            timeframe,
            analysisType,
            user,
            handleTradingViewConfig,
            onAnalysisComplete: config.onAnalysisComplete
          }, signal);
        }
      }

      if (counter < maxAnalyses && !signal.aborted) {
        toast.success(`اكتملت دورة التحليل ${counter} من ${maxAnalyses}`);
        
        // انتظار قبل بدء الدورة التالية (30 ثانية)
        await new Promise(resolve => setTimeout(resolve, 30000));
        runCycle();
      } else {
        toast.success("اكتملت جميع دورات التحليل بنجاح");
        stopAnalysisOperations();
        setIsAnalyzing(false);
      }
    };

    await runCycle();
  };

  return {
    stopAnalysisOperations,
    performAnalysisCycle
  };
};
