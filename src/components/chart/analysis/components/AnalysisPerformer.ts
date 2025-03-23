
import { toast } from "sonner";
import { saveAnalysisToHistory } from "../utils/analysisHistoryUtils";
import { mapAnalysisTypeToConfig, mapToAnalysisType } from "../utils/analysisTypeMapper";
import { SearchHistoryItem } from "@/types/analysis";
import { AnalysisType } from "@/types/analysis";
import { clearSupabaseCache, clearSearchHistoryCache } from "@/utils/supabaseCache";
import { dispatchAnalysisSuccessEvent } from "@/hooks/analysis-checker/events/analysisEvents";

interface AnalysisPerformerProps {
  symbol: string;
  price: number;
  timeframe: string;
  analysisType: string;
  user: { id: string } | null;
  handleTradingViewConfig: any;
  onAnalysisComplete?: (newItem: SearchHistoryItem) => void;
  duration?: number; // مدة التحليل كمعامل اختياري
}

export const performAnalysis = async ({
  symbol,
  price,
  timeframe,
  analysisType,
  user,
  handleTradingViewConfig,
  onAnalysisComplete,
  duration
}: AnalysisPerformerProps) => {
  try {
    // نضيف سجل لتتبع مدة التحليل
    console.log(`Starting analysis for ${timeframe} - ${analysisType} with duration ${duration || 36} hours`);
    
    // Clear caches before starting analysis
    await clearSupabaseCache();
    await clearSearchHistoryCache();
    
    const config = mapAnalysisTypeToConfig(analysisType);
    console.log("Analysis configuration:", config);
    
    // التأكد من أن مدة التحليل مرسلة كسلسلة نصية
    const durationString = duration !== undefined ? duration.toString() : "36";
    console.log("Sending duration as string:", durationString);
    
    // تمرير مدة التحليل إلى handleTradingViewConfig
    const result = await handleTradingViewConfig(
      symbol,
      timeframe,
      price,
      config.isScalping,
      false,
      config.isSMC,
      config.isICT,
      config.isTurtleSoup,
      config.isGann,
      config.isWaves,
      config.isPatternAnalysis,
      config.isPriceAction,
      false, // isNeuralNetwork
      false, // isRNN
      false, // isTimeClustering
      false, // isMultiVariance
      false, // isCompositeCandlestick 
      false, // isBehavioral
      false, // isFibonacci
      false, // isFibonacciAdvanced
      durationString // تمرير مدة التحليل كسلسلة نصية
    );

    if (result && result.analysisResult && user) {
      console.log("Analysis completed successfully:", result);
      
      // Ensure timeframe is included in the result
      result.analysisResult.timeframe = timeframe;
      
      // التأكد من تضمين مدة التحليل في النتائج
      // استخدام المدة من النتيجة أو المدة المقدمة كمعامل أو 36 ساعات كقيمة افتراضية
      const finalDuration = result.duration || duration || 36;
      console.log(`Using final duration: ${finalDuration} hours`);
      
      // إضافة أهداف افتراضية إذا لم تكن موجودة
      if (!result.analysisResult.targets || !Array.isArray(result.analysisResult.targets) || result.analysisResult.targets.length === 0) {
        console.log("No targets in result, adding default targets");
        const basePrice = result.analysisResult.currentPrice || price;
        const isUptrend = result.analysisResult.direction === "صاعد";
        const now = new Date();
        
        result.analysisResult.targets = [
          {
            price: isUptrend ? basePrice * 1.01 : basePrice * 0.99,
            expectedTime: new Date(now.getTime() + 24 * 60 * 60 * 1000) // غدًا
          },
          {
            price: isUptrend ? basePrice * 1.02 : basePrice * 0.98,
            expectedTime: new Date(now.getTime() + 48 * 60 * 60 * 1000) // بعد غد
          },
          {
            price: isUptrend ? basePrice * 1.03 : basePrice * 0.97,
            expectedTime: new Date(now.getTime() + 72 * 60 * 60 * 1000) // بعد 3 أيام
          }
        ];
        
        console.log("Added default targets:", result.analysisResult.targets);
      } else {
        // تأكد من أن جميع الأهداف لديها تواريخ متوقعة
        const now = new Date();
        result.analysisResult.targets = result.analysisResult.targets.map((target, index) => {
          if (!target.expectedTime) {
            return {
              ...target,
              expectedTime: new Date(now.getTime() + (index + 1) * 24 * 60 * 60 * 1000)
            };
          }
          return target;
        });
      }
      
      // Convert string to AnalysisType
      const mappedAnalysisType = mapToAnalysisType(analysisType) as AnalysisType;

      // Try up to 3 times to save if there are schema cache issues
      let savedData = null;
      let attempt = 0;
      let lastError = null;
      
      while (attempt < 3 && !savedData) {
        try {
          if (attempt > 0) {
            console.log(`Retrying save (attempt ${attempt+1}/3)...`);
            await clearSupabaseCache();
            await clearSearchHistoryCache();
            await new Promise(resolve => setTimeout(resolve, 300));
          }
          
          // إضافة مدة التحليل إلى كائن النتيجة المرسل إلى وظيفة الحفظ
          const resultWithDuration = {
            ...result,
            duration: finalDuration // تأكيد تمرير المدة النهائية
          };
          
          console.log("Saving analysis with duration:", finalDuration);
          
          savedData = await saveAnalysisToHistory(
            resultWithDuration,
            symbol,
            timeframe,
            mappedAnalysisType,
            user.id
          );
          
          console.log("Analysis saved to history:", savedData);
        } catch (error) {
          console.error(`Failed save attempt ${attempt+1}:`, error);
          lastError = error;
          attempt++;
        }
      }
      
      if (!savedData) {
        throw lastError || new Error("Failed to save analysis after multiple attempts");
      }

      // إطلاق إشعار نجاح التحليل
      dispatchAnalysisSuccessEvent({
        timestamp: new Date().toISOString(),
        checked: 1,
        symbol: symbol
      });
      
      // إطلاق حدث مخصص لتحديث سجل البحث
      window.dispatchEvent(new CustomEvent('refreshSearchHistory'));

      if (onAnalysisComplete) {
        const newHistoryEntry: SearchHistoryItem = {
          id: savedData.id,
          date: new Date(),
          symbol: symbol,
          currentPrice: price,
          analysis: result.analysisResult,
          analysisType: mappedAnalysisType,
          timeframe: timeframe,
          analysis_duration_hours: finalDuration // استخدام المدة النهائية
        };
        
        console.log("Adding new analysis to history with duration:", finalDuration, newHistoryEntry);
        onAnalysisComplete(newHistoryEntry);
      }

      toast.success(`تم إكمال تحليل ${mappedAnalysisType} على الإطار الزمني ${timeframe}`, { duration: 1000 });
    }
  } catch (error) {
    console.error(`Error in ${analysisType} analysis on ${timeframe}:`, error);
    toast.error(`فشل في تحليل ${analysisType} على ${timeframe}`, { duration: 1000 });
    throw error;
  }
};
