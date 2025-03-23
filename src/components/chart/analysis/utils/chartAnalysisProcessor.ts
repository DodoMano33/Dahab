
import { AnalysisData, AnalysisType } from "@/types/analysis";
import { executeAnalysisBasedOnType } from "./processors/typeProcessor";
import { createBaseAnalysisResult, mergeAnalysisResults } from "./processors/baseAnalysisBuilder";
import { saveAnalysisToDatabase } from "./processors/databaseHandler";
import { validateAnalysisInput, AnalysisInput } from "./processors/inputValidator";
import { AnalysisResult } from "@/components/chart/analysis/hooks/analysisState/useAnalysisResult";

export const processChartAnalysis = async (input: AnalysisInput): Promise<AnalysisResult> => {
  try {
    console.log("Processing chart analysis with input:", input);
    
    // التحقق من صحة البيانات المدخلة
    if (!validateAnalysisInput(input)) {
      throw new Error("بيانات التحليل غير صالحة");
    }
    
    // الحصول على البيانات الأساسية
    const { symbol, timeframe, providedPrice, analysisType, chartImage, duration } = input;
    
    // إنشاء كائن نتائج التحليل الأساسي
    const baseResult = createBaseAnalysisResult(symbol, timeframe, providedPrice, analysisType, duration);

    // تنفيذ التحليل المناسب بناءً على النوع
    const specificAnalysisResult = await executeAnalysisBasedOnType(
      analysisType, 
      chartImage || "", 
      providedPrice, 
      timeframe
    );
    
    // دمج النتائج الأساسية مع نتائج التحليل الخاص
    const analysisResult = mergeAnalysisResults(
      baseResult,
      specificAnalysisResult,
      timeframe,
      providedPrice,
      duration
    );

    console.log("Analysis completed with result:", analysisResult);
    
    // إرجاع كائن النتيجة النهائي
    return {
      analysisResult,
      duration: duration,
      symbol: symbol,
      currentPrice: providedPrice
    };
  } catch (error: any) {
    console.error("فشل في معالجة تحليل الشارت:", error);
    throw new Error(`فشل في معالجة تحليل الشارت: ${error.message}`);
  }
};

// تصدير وظيفة حفظ التحليل للاستخدام من قبل المكونات الأخرى
export { saveAnalysisToDatabase } from "./processors/databaseHandler";
