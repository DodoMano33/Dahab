import { AnalysisData } from "@/types/analysis";
import { analyzePatternWithPrice } from "./patternRecognition";

export const analyzePattern = async (
  chartImage: string,
  currentPrice: number
): Promise<AnalysisData> => {
  console.log("بدء تحليل النمط - البيانات المستلمة:", { chartImage, currentPrice });
  
  try {
    if (!currentPrice || isNaN(currentPrice)) {
      console.error("خطأ: السعر الحالي غير صالح:", currentPrice);
      throw new Error("السعر الحالي غير صالح");
    }

    if (!chartImage) {
      console.error("خطأ: لم يتم استلام صورة الشارت");
      throw new Error("لم يتم استلام صورة الشارت");
    }

    const analysis = analyzePatternWithPrice(chartImage, currentPrice);
    console.log("تم إكمال تحليل النمط بنجاح:", analysis);
    return analysis;

  } catch (error) {
    console.error("خطأ في تحليل النمط:", error);
    throw new Error(`فشل في تحليل النمط: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
  }
};