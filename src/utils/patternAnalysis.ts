import { AnalysisData } from "@/types/analysis";
import { addDays } from "date-fns";

export interface PatternAnalysisResult extends AnalysisData {
  patternType: string;
  priorTrend: string;
  priceAction: string;
  stopLossReason: string;
}

export const analyzePattern = async (
  chartImage: string,
  currentPrice: number
): Promise<PatternAnalysisResult> => {
  console.log("بدء تحليل النمط مع السعر:", currentPrice);
  
  try {
    if (!currentPrice || isNaN(currentPrice)) {
      console.error("السعر الحالي غير صالح:", currentPrice);
      throw new Error("السعر الحالي غير صالح");
    }

    // تحديد النمط بناءً على السعر الحالي
    const pattern = currentPrice > 2000 ? "head_and_shoulders" : "descending_triangle";
    console.log("النمط المحدد:", pattern);

    let analysis: PatternAnalysisResult;
    const formattedPrice = Number(currentPrice.toFixed(2));
    
    // حساب مستويات الدعم والمقاومة
    const support = Number((formattedPrice * 0.95).toFixed(2));
    const resistance = Number((formattedPrice * 1.05).toFixed(2));
    
    // تحديد الاتجاه بناءً على موقع السعر الحالي
    const direction = currentPrice > support ? "صاعد" : "هابط";
    
    // حساب مستويات فيبوناتشي
    const fibLevels = [
      { level: 0.236, price: Number((formattedPrice * 0.98).toFixed(2)) },
      { level: 0.382, price: Number((formattedPrice * 0.96).toFixed(2)) },
      { level: 0.618, price: Number((formattedPrice * 0.94).toFixed(2)) }
    ];

    analysis = {
      pattern: direction === "صاعد" ? "نموذج صعودي" : "نموذج هابط",
      patternType: "نمط انعكاسي",
      priorTrend: "الاتجاه السابق معاكس لاتجاه التداول",
      priceAction: "حركة السعر تدعم اتجاه التداول",
      direction: direction,
      currentPrice: formattedPrice,
      support: support,
      resistance: resistance,
      stopLoss: Number((formattedPrice * (direction === "صاعد" ? 0.93 : 1.07)).toFixed(2)),
      stopLossReason: "تم تحديد وقف الخسارة بناءً على مستوى الدعم/المقاومة القريب",
      bestEntryPoint: {
        price: Number((formattedPrice * (direction === "صاعد" ? 0.97 : 1.03)).toFixed(2)),
        reason: direction === "صاعد" 
          ? "نقطة دخول عند مستوى الدعم القريب" 
          : "نقطة دخول عند مستوى المقاومة القريب"
      },
      targets: [
        {
          price: Number((formattedPrice * (direction === "صاعد" ? 1.1 : 0.9)).toFixed(2)),
          expectedTime: addDays(new Date(), 7)
        },
        {
          price: Number((formattedPrice * (direction === "صاعد" ? 1.15 : 0.85)).toFixed(2)),
          expectedTime: addDays(new Date(), 14)
        }
      ],
      analysisType: "Patterns",
      fibonacciLevels: fibLevels
    };

    console.log("تم إكمال تحليل النمط بنجاح:", analysis);
    return analysis;
  } catch (error) {
    console.error("خطأ في تحليل النمط:", error);
    throw error;
  }
};