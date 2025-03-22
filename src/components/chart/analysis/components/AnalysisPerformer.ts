
import { toast } from "sonner";
import { saveAnalysisToHistory } from "../utils/analysisHistoryUtils";
import { mapAnalysisTypeToConfig, mapToAnalysisType } from "../utils/analysisTypeMapper";
import { SearchHistoryItem } from "@/types/analysis";
import { AnalysisType } from "@/types/analysis";
import { clearSupabaseCache, clearSearchHistoryCache } from "@/utils/supabaseCache";

interface AnalysisPerformerProps {
  symbol: string;
  price: number;
  timeframe: string;
  analysisType: string;
  user: { id: string } | null;
  handleTradingViewConfig: any;
  onAnalysisComplete?: (newItem: SearchHistoryItem) => void;
  duration?: number; // إضافة مدة التحليل كمعامل اختياري
}

export const performAnalysis = async ({
  symbol,
  price,
  timeframe,
  analysisType,
  user,
  handleTradingViewConfig,
  onAnalysisComplete,
  duration // استلام مدة التحليل
}: AnalysisPerformerProps) => {
  try {
    console.log(`Starting analysis for ${timeframe} - ${analysisType} with duration ${duration} hours`);
    
    // Clear caches before starting analysis
    await clearSupabaseCache();
    await clearSearchHistoryCache();
    
    const config = mapAnalysisTypeToConfig(analysisType);
    console.log("Analysis configuration:", config);
    
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
      duration ? duration.toString() : undefined // تحويل القيمة إلى سلسلة نصية
    );

    if (result && result.analysisResult && user) {
      console.log("Analysis completed successfully:", result);
      
      // Ensure timeframe is included in the result
      result.analysisResult.timeframe = timeframe;
      
      // إضافة مدة التحليل إلى النتائج إذا تم توفيرها
      if (duration) {
        result.duration = duration;
        console.log(`Adding analysis duration: ${duration} hours`);
      }
      
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
          
          // التأكد من إضافة مدة التحليل إلى كائن النتيجة المرسل إلى وظيفة الحفظ
          if (duration) {
            result.duration = duration;
          }
          
          savedData = await saveAnalysisToHistory(
            result,
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

      if (onAnalysisComplete) {
        const newHistoryEntry: SearchHistoryItem = {
          id: savedData.id,
          date: new Date(),
          symbol: symbol,
          currentPrice: price,
          analysis: result.analysisResult,
          analysisType: mappedAnalysisType,
          timeframe: timeframe,
          analysis_duration_hours: duration || 8 // استخدام مدة التحليل المدخلة
        };
        
        console.log("Adding new analysis to history:", newHistoryEntry);
        onAnalysisComplete(newHistoryEntry);
      }

      toast.success(`تم إكمال تحليل ${mappedAnalysisType} على الإطار الزمني ${timeframe}`);
    }
  } catch (error) {
    console.error(`Error in ${analysisType} analysis on ${timeframe}:`, error);
    toast.error(`فشل في تحليل ${analysisType} على ${timeframe}`);
    throw error;
  }
};
