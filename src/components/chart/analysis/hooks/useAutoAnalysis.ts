
import { useState, useRef } from "react";
import { toast } from "sonner";
import { performAnalysis } from "../components/AnalysisPerformer";
import { useAuth } from "@/contexts/AuthContext";
import { SearchHistoryItem } from "@/types/analysis";
import { clearSupabaseCache, clearSearchHistoryCache } from "@/utils/supabaseCache";

interface AutoAnalysisConfig {
  timeframes: string[];
  interval: string;
  analysisTypes: string[];
  repetitions: number;
  symbol: string;
  currentPrice: number;
  duration: number;
  onAnalysisComplete?: (newItem: SearchHistoryItem) => void;
}

export const useAutoAnalysis = () => {
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopAutoAnalysis = () => {
    console.log("Stopping auto analysis");
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    setIsAnalyzing(false);
  };

  const startAutoAnalysis = async ({
    timeframes,
    interval,
    analysisTypes,
    repetitions,
    symbol,
    currentPrice,
    duration,
    onAnalysisComplete
  }: AutoAnalysisConfig) => {
    if (isAnalyzing) {
      stopAutoAnalysis();
    }

    if (!user) {
      toast.error("يجب تسجيل الدخول لاستخدام التحليل التلقائي");
      return;
    }

    // التأكد من وجود إطارات زمنية وأنواع تحليل
    if (!timeframes.length || !analysisTypes.length) {
      toast.error("الرجاء اختيار إطار زمني ونوع تحليل على الأقل");
      return;
    }

    console.log(`Starting auto analysis with ${timeframes.length} timeframes and ${analysisTypes.length} analysis types`);
    console.log("Timeframes:", timeframes);
    console.log("Analysis types:", analysisTypes);
    
    // تنظيف ذاكرة التخزين المؤقت لقاعدة البيانات
    try {
      await clearSupabaseCache();
      await clearSearchHistoryCache();
    } catch (error) {
      console.error("Error clearing cache before auto analysis:", error);
      // نستمر رغم الخطأ
    }

    setIsAnalyzing(true);
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    toast.success(`بدء التحليل التلقائي لـ ${symbol} على ${timeframes.length} إطار زمني و ${analysisTypes.length} نوع تحليل`);

    // إنشاء مرجع للمكون المسؤول عن معالجة التحليلات
    // مطلوب من أجل التحليل
    const handleTradingViewConfig = (
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
          direction: Math.random() > 0.5 ? "bullish" : "bearish",
          targets: [currentPrice * 1.01, currentPrice * 1.02, currentPrice * 1.03],
          stopLoss: currentPrice * 0.98,
          entryPoint: currentPrice,
          analysis: `تحليل تلقائي لـ ${symbol} على الإطار الزمني ${timeframe}`,
          confidence: Math.random() * 100
        }
      };
    };

    let counter = 0;
    const maxAnalyses = repetitions > 0 ? repetitions : 1;

    // وظيفة تنفيذ دورة تحليل واحدة
    const runAnalysisCycle = async () => {
      if (signal.aborted || counter >= maxAnalyses) {
        stopAutoAnalysis();
        return;
      }

      counter++;
      console.log(`Starting analysis cycle ${counter} of ${maxAnalyses}`);

      // تنظيف ذاكرة التخزين المؤقت بشكل دوري
      if (counter % 5 === 0) {
        try {
          await clearSupabaseCache();
          await clearSearchHistoryCache();
        } catch (error) {
          console.error("Error clearing cache during analysis cycle:", error);
        }
      }

      for (const timeframe of timeframes) {
        for (const analysisType of analysisTypes) {
          if (signal.aborted) break;
          
          console.log(`Performing ${analysisType} analysis on ${timeframe} timeframe`);
          
          try {
            await performAnalysis({
              symbol,
              price: currentPrice,
              timeframe,
              analysisType,
              user,
              handleTradingViewConfig,
              onAnalysisComplete
            });
            
            // إضافة تأخير صغير بين التحليلات
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (error) {
            console.error(`Error during ${analysisType} on ${timeframe}:`, error);
            
            // محاولة مرة أخرى بعد مسح التخزين المؤقت للمخطط
            try {
              await clearSupabaseCache();
              await clearSearchHistoryCache();
              
              await performAnalysis({
                symbol,
                price: currentPrice,
                timeframe,
                analysisType,
                user,
                handleTradingViewConfig,
                onAnalysisComplete
              });
            } catch (retryError) {
              console.error(`Retry also failed for ${analysisType} on ${timeframe}:`, retryError);
              toast.error(`فشل تحليل ${analysisType} على الإطار ${timeframe}`);
            }
          }
        }
      }

      if (counter < maxAnalyses && !signal.aborted) {
        toast.success(`اكتملت دورة التحليل ${counter} من ${maxAnalyses}`);
        
        // انتظار قبل بدء الدورة التالية (30 ثانية)
        await new Promise(resolve => setTimeout(resolve, 30000));
        runAnalysisCycle();
      } else {
        toast.success("اكتملت جميع دورات التحليل بنجاح");
        stopAutoAnalysis();
      }
    };

    // بدء أول دورة تحليل
    try {
      await runAnalysisCycle();
    } catch (error) {
      console.error("Error in analysis cycle:", error);
      toast.error("حدث خطأ أثناء دورة التحليل");
      stopAutoAnalysis();
    }
  };

  return {
    startAutoAnalysis,
    stopAutoAnalysis,
    isAnalyzing
  };
};
