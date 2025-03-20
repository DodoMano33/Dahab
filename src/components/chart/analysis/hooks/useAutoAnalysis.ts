
import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { SearchHistoryItem } from "@/types/analysis";
import { useAnalysisHandler } from "../AnalysisHandler";
import { validateAnalysisInputs } from "../utils/analysisValidation";
import { getIntervalInMs } from "../utils/intervalUtils";
import { useSaveAnalysis } from "./useSaveAnalysis";
import { clearSupabaseCache, clearSearchHistoryCache } from "@/utils/supabaseCache";

interface AutoAnalysisConfig {
  timeframes: string[];
  interval: string;
  analysisTypes: string[];
  repetitions: number;
  currentPrice: number;
  symbol: string;
  duration: number;
  onAnalysisComplete?: (newItem: SearchHistoryItem) => void;
}

export const useAutoAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisInterval, setAnalysisInterval] = useState<NodeJS.Timeout | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { user } = useAuth();
  const { handleTradingViewConfig } = useAnalysisHandler();
  const { saveAnalysisResult } = useSaveAnalysis();

  const startAutoAnalysis = async (config: AutoAnalysisConfig) => {
    const { timeframes, interval, analysisTypes, repetitions, currentPrice, symbol, duration, onAnalysisComplete } = config;

    if (!user) {
      toast.error("يرجى تسجيل الدخول لحفظ نتائج التحليل");
      return;
    }

    // التحقق من المدخلات
    if (!validateAnalysisInputs(timeframes, interval, analysisTypes, currentPrice, duration)) {
      return;
    }

    try {
      // مسح التخزين المؤقت قبل بدء التحليل
      await clearSupabaseCache();
      await clearSearchHistoryCache();
      
      setIsAnalyzing(true);
      setErrorCount(0);
      console.log("Starting auto analysis with config:", { ...config, symbol, duration });

      // إلغاء أي طلبات سابقة
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // إنشاء مراقب جديد للإلغاء
      abortControllerRef.current = new AbortController();

      const runAnalysis = async () => {
        if (!isAnalyzing) return;
        
        try {
          const toastId = toast.loading("جاري تنفيذ التحليل التلقائي...");
          
          // محاولة تنظيف التخزين المؤقت مرة أخرى قبل كل تحليل جديد
          await clearSearchHistoryCache();
          
          for (const timeframe of timeframes) {
            for (const analysisType of analysisTypes) {
              if (!isAnalyzing) break;
              
              console.log(`Running analysis for ${symbol} on ${timeframe} with type ${analysisType} and duration ${duration}`);
              
              // تحويل نوع التحليل إلى مؤشرات منطقية
              const analysisConfig = mapAnalysisTypeToConfig(analysisType);
              
              try {
                const result = await handleTradingViewConfig(
                  symbol,
                  timeframe,
                  currentPrice,
                  analysisConfig.isScalping,
                  analysisConfig.isAI,
                  analysisConfig.isSMC,
                  analysisConfig.isICT,
                  analysisConfig.isTurtleSoup,
                  analysisConfig.isGann,
                  analysisConfig.isWaves,
                  analysisConfig.isPatternAnalysis,
                  analysisConfig.isPriceAction,
                  analysisConfig.isNeuralNetwork,
                  analysisConfig.isRNN,
                  analysisConfig.isTimeClustering,
                  analysisConfig.isMultiVariance,
                  analysisConfig.isCompositeCandlestick,
                  analysisConfig.isBehavioral,
                  analysisConfig.isFibonacci,
                  analysisConfig.isFibonacciAdvanced,
                  duration.toString()
                );

                if (result && result.analysisResult) {
                  console.log("Analysis completed successfully:", result);
                  
                  try {
                    await saveAnalysisResult({
                      userId: user.id,
                      symbol,
                      currentPrice,
                      result,
                      analysisType,
                      timeframe,
                      duration,
                      onAnalysisComplete
                    });
                  } catch (saveError) {
                    console.error("Error saving analysis result:", saveError);
                    
                    // محاولة إصلاح مشكلة التخزين المؤقت إذا كان الخطأ متعلقًا بذلك
                    if (saveError.message && saveError.message.includes('schema cache')) {
                      await clearSupabaseCache();
                      await clearSearchHistoryCache();
                      
                      // محاولة الحفظ مرة أخرى بعد مسح التخزين المؤقت
                      try {
                        await saveAnalysisResult({
                          userId: user.id,
                          symbol,
                          currentPrice,
                          result,
                          analysisType,
                          timeframe,
                          duration,
                          onAnalysisComplete
                        });
                      } catch (retryError) {
                        console.error("Failed to save analysis even after cache clear:", retryError);
                        throw retryError;
                      }
                    } else {
                      throw saveError;
                    }
                  }
                }
              } catch (analysisError) {
                console.error(`Error in ${analysisType} analysis on ${timeframe}:`, analysisError);
                setErrorCount(prev => prev + 1);
                
                // عرض رسالة خطأ واحدة فقط للمستخدم
                if (errorCount < 1) {
                  toast.error(`فشل تحليل ${analysisType} على الإطار الزمني ${timeframe}`);
                }
                
                // محاولة الاستمرار في التحليلات الأخرى
                continue;
              }
            }
          }
          
          toast.dismiss(toastId);
          if (isAnalyzing) {
            toast.success("تم إكمال دورة التحليل التلقائي");
          }
        } catch (error) {
          console.error("Error in auto analysis cycle:", error);
          setErrorCount(prev => prev + 1);
          
          if (errorCount < 3) {
            toast.error("حدث خطأ أثناء التحليل التلقائي. جارٍ المحاولة مرة أخرى.");
          }
        }
      };

      // تنفيذ التحليل للمرة الأولى
      await runAnalysis();

      // إعداد التكرار إذا كان أكثر من 1
      if (repetitions > 1 && isAnalyzing) {
        const intervalTime = getIntervalInMs(interval);
        console.log(`Setting up interval analysis every ${intervalTime}ms`);
        
        const intervalId = setInterval(runAnalysis, intervalTime);
        setAnalysisInterval(intervalId);
        
        return () => {
          if (intervalId) clearInterval(intervalId);
        };
      }
    } catch (error) {
      console.error("Fatal error in auto analysis:", error);
      toast.error("حدث خطأ غير متوقع في التحليل التلقائي");
      stopAutoAnalysis();
    }
  };

  const stopAutoAnalysis = () => {
    console.log("Stopping auto analysis");
    
    // إلغاء التحليل الجاري
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // إيقاف الفاصل الزمني
    if (analysisInterval) {
      clearInterval(analysisInterval);
      setAnalysisInterval(null);
    }
    
    setIsAnalyzing(false);
    toast.info("تم إيقاف التحليل التلقائي");
  };

  return {
    isAnalyzing,
    startAutoAnalysis,
    stopAutoAnalysis
  };
};

// دالة مساعدة لتحويل نوع التحليل إلى مؤشرات منطقية
const mapAnalysisTypeToConfig = (analysisType: string) => {
  const config = {
    isScalping: false,
    isAI: false,
    isSMC: false,
    isICT: false,
    isTurtleSoup: false,
    isGann: false,
    isWaves: false,
    isPatternAnalysis: false,
    isPriceAction: false,
    isNeuralNetwork: false,
    isRNN: false,
    isTimeClustering: false,
    isMultiVariance: false,
    isCompositeCandlestick: false,
    isBehavioral: false,
    isFibonacci: false,
    isFibonacciAdvanced: false
  };

  switch (analysisType.toLowerCase()) {
    case 'scalping':
    case 'سكالبينج':
      config.isScalping = true;
      break;
    case 'smart':
    case 'ذكي':
      config.isAI = true;
      break;
    case 'smc':
      config.isSMC = true;
      break;
    case 'ict':
      config.isICT = true;
      break;
    case 'turtle_soup':
    case 'turtle soup':
      config.isTurtleSoup = true;
      break;
    case 'gann':
      config.isGann = true;
      break;
    case 'waves':
    case 'موجات':
      config.isWaves = true;
      break;
    case 'patterns':
    case 'أنماط':
      config.isPatternAnalysis = true;
      break;
    case 'price_action':
    case 'price action':
    case 'حركة السعر':
      config.isPriceAction = true;
      break;
    case 'neural_network':
    case 'neural network':
    case 'شبكة عصبية':
      config.isNeuralNetwork = true;
      break;
    case 'rnn':
      config.isRNN = true;
      break;
    case 'time_clustering':
    case 'time clustering':
      config.isTimeClustering = true;
      break;
    case 'multi_variance':
    case 'multi variance':
      config.isMultiVariance = true;
      break;
    case 'composite_candlestick':
    case 'composite candlestick':
      config.isCompositeCandlestick = true;
      break;
    case 'behavioral':
    case 'تحليل سلوكي':
      config.isBehavioral = true;
      break;
    case 'fibonacci':
    case 'فيبوناتشي':
      config.isFibonacci = true;
      break;
    case 'fibonacci_advanced':
    case 'fibonacci advanced':
    case 'فيبوناتشي متقدم':
      config.isFibonacciAdvanced = true;
      break;
    default:
      console.warn(`Unknown analysis type: ${analysisType}`);
      break;
  }

  return config;
};
