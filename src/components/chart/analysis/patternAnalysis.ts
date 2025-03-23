
import { AnalysisData } from "@/types/analysis";
import { analyzeChartPatterns } from "@/utils/technicalAnalysis/patternRecognition";
import { calculateSupportResistance } from "@/utils/technicalAnalysis/indicators";
import { identifyAdvancedPricePatterns } from "@/utils/technicalAnalysis/advancedPatternIdentification";

export const analyzePattern = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData | null> => {
  console.log("بدء تحليل النمط للشارت:", { timeframe, currentPrice });
  
  try {
    if (!currentPrice || isNaN(currentPrice)) {
      console.error("خطأ: السعر الحالي غير صالح:", currentPrice);
      return null;
    }

    if (!chartImage) {
      console.error("خطأ: لم يتم استلام صورة الشارت");
      return null;
    }

    // الحصول على بيانات الشارت من API للتحليل الفني
    // في البيئة الحقيقية، سنقوم بجلب بيانات الأسعار التاريخية
    // هنا نستخدم تحليل فني حقيقي على البيانات
    
    // تحليل الشارت للكشف عن الأنماط
    const patternResults = await analyzeChartPatterns(chartImage, currentPrice, timeframe);
    
    if (!patternResults || !patternResults.pattern) {
      console.log("لم يتم العثور على أنماط محددة في الشارت");
      return null;
    }
    
    // حساب مستويات الدعم والمقاومة
    const { support, resistance } = calculateSupportResistance([patternResults.support, patternResults.resistance, currentPrice]);
    
    // تحديد أنماط متقدمة إضافية
    const advancedPatterns = await identifyAdvancedPricePatterns(chartImage, currentPrice, timeframe);
    
    // تجميع نتائج التحليل
    const analysisResult: AnalysisData = {
      pattern: patternResults.pattern,
      direction: patternResults.direction,
      currentPrice,
      support,
      resistance,
      stopLoss: patternResults.stopLoss,
      targets: patternResults.targets,
      bestEntryPoint: patternResults.bestEntryPoint,
      fibonacciLevels: patternResults.fibonacciLevels || [],
      analysisType: "Patterns"
    };

    console.log("تم إكمال تحليل النمط بنجاح:", analysisResult);
    return analysisResult;
  } catch (error) {
    console.error("خطأ في تحليل النمط:", error);
    return null;
  }
};
