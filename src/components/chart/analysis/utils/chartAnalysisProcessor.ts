
import { AnalysisData, AnalysisType } from "@/types/analysis";
import { executeSpecificAnalysis, executeMultipleAnalyses } from "@/utils/technicalAnalysis/analysisExecutor";
import { supabase } from "@/lib/supabase";
import { showErrorToast, showSuccessToast } from "./toastUtils";
import { useAuth } from "@/contexts/AuthContext";

interface ChartAnalysisInput {
  symbol: string;
  timeframe: string;
  providedPrice: number;
  analysisType: string;
  selectedTypes: string[];
  isAI?: boolean;
  options?: any;
  duration?: string;
  chartImage?: string; // صورة الشارت للتحليل
}

// تحديث نوع البيانات الناتجة ليشمل symbol و currentPrice
interface ChartAnalysisResult {
  analysisResult: AnalysisData | null;
  duration?: string | number;
  symbol?: string;
  currentPrice?: number;
}

export const processChartAnalysis = async (
  input: ChartAnalysisInput
): Promise<ChartAnalysisResult> => {
  const {
    symbol,
    timeframe,
    providedPrice,
    analysisType,
    selectedTypes,
    isAI = false,
    options,
    duration,
    chartImage
  } = input;

  console.log(`Processing chart analysis for ${symbol} at price ${providedPrice} with type ${analysisType}`);
  console.log("Selected types:", selectedTypes);

  try {
    let analysisResult: AnalysisData | null = null;
    let analysisTypes: string[] = [];

    // تحديد أنواع التحليل المطلوبة
    if (selectedTypes && selectedTypes.length > 0) {
      analysisTypes = selectedTypes;
      console.log("Using provided analysis types:", analysisTypes);
    } else {
      analysisTypes = [analysisType];
      console.log("Using single analysis type:", analysisType);
    }

    if (!chartImage) {
      console.error("لا توجد صورة شارت للتحليل!");
      showErrorToast(new Error("لا توجد صورة شارت للتحليل!"));
      return { analysisResult: null, symbol, currentPrice: providedPrice };
    }

    // تنفيذ التحليل
    if (analysisTypes.length === 1) {
      // تحليل نوع واحد
      analysisResult = await executeSpecificAnalysis(analysisTypes[0], chartImage, providedPrice, timeframe);
      
      if (!analysisResult) {
        console.error("لم يتم العثور على أي أنماط أو إشارات في هذا التحليل.");
        showErrorToast(new Error("لم يتم العثور على أي أنماط أو إشارات في هذا التحليل."));
        return { analysisResult: null, symbol, currentPrice: providedPrice };
      }
      
      console.log("Single analysis result:", analysisResult);
    } else {
      // تحليل متعدد
      const results = await executeMultipleAnalyses(analysisTypes, chartImage, providedPrice, timeframe);
      
      if (results.length === 0) {
        console.error("لم يتم العثور على أي أنماط أو إشارات في أي من التحليلات.");
        showErrorToast(new Error("لم يتم العثور على أي أنماط أو إشارات في أي من التحليلات."));
        return { analysisResult: null, symbol, currentPrice: providedPrice };
      }
      
      // استخدام النتيجة الأولى
      analysisResult = results[0];
      console.log("Multiple analyses results (using first):", results);
    }

    // إضافة مدة التحليل
    const durationHours = duration ? parseInt(duration) : 8;
    if (analysisResult) {
      analysisResult.analysis_duration_hours = durationHours;
      analysisResult.activation_type = "تلقائي";
    }

    console.log("Analysis completed successfully:", analysisResult);
    return { 
      analysisResult,
      duration: durationHours,
      symbol,
      currentPrice: providedPrice
    };
  } catch (error) {
    console.error("Error in chart analysis processor:", error);
    showErrorToast(error);
    throw error;
  }
};

// حفظ نتيجة التحليل في قاعدة البيانات
export const saveAnalysisToDatabase = async (
  symbol: string,
  timeframe: string,
  currentPrice: number,
  analysisType: AnalysisType,
  analysis: AnalysisData,
  analysis_duration_hours: number = 8
) => {
  try {
    const auth = useAuth();
    const user = auth?.user;
    
    if (!user) {
      console.error("لا يمكن حفظ التحليل: المستخدم غير مسجل الدخول");
      return;
    }
    
    // تصحيح استدعاء الدالة هنا
    const { error } = await supabase
      .from('search_history')
      .insert({
        user_id: user.id,
        symbol,
        timeframe,
        current_price: currentPrice,
        analysis_type: analysisType,
        analysis_duration_hours,
        analysis
      });
    
    if (error) {
      console.error("Error saving analysis to database:", error);
      throw error;
    }
    
    showSuccessToast("تم حفظ التحليل بنجاح");
  } catch (error) {
    console.error("Error in saveAnalysisToDatabase:", error);
    showErrorToast(error);
  }
};
