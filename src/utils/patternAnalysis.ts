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

    if (!chartImage) {
      console.error("صورة الشارت غير صالحة");
      throw new Error("صورة الشارت غير صالحة");
    }

    // تحديد النمط بناءً على السعر الحالي
    const pattern = currentPrice > 2000 ? "head_and_shoulders" : "descending_triangle";
    console.log("النمط المحدد:", pattern);

    let analysis: PatternAnalysisResult;
    const formattedPrice = Number(currentPrice.toFixed(2));
    
    switch (pattern) {
      case "descending_triangle":
        analysis = {
          pattern: "المثلث الهابط",
          patternType: "نمط استمراري",
          priorTrend: "الاتجاه السابق في صالح اتجاه التداول",
          priceAction: "حركة السعر داخل النمط شبه هابطة تفضل اتجاه التداول",
          direction: "هابط",
          currentPrice: formattedPrice,
          support: Number((formattedPrice * 0.95).toFixed(2)),
          resistance: Number((formattedPrice * 1.05).toFixed(2)),
          stopLoss: Number((formattedPrice * 1.14).toFixed(2)),
          stopLossReason: "14% من قياس الهدف بعد وقف الخسارة المطلق، حيث أنه دعم هيكلي",
          bestEntryPoint: {
            price: Number((formattedPrice * 0.97).toFixed(2)),
            reason: "الدخول عند كسر الحد السفلي للمثلث الهابط"
          },
          targets: [
            {
              price: Number((formattedPrice * 0.85).toFixed(2)),
              expectedTime: addDays(new Date(), 7)
            },
            {
              price: Number((formattedPrice * 0.75).toFixed(2)),
              expectedTime: addDays(new Date(), 14)
            }
          ],
          analysisType: "Patterns",
          fibonacciLevels: [
            { level: 0.236, price: Number((formattedPrice * 0.98).toFixed(2)) },
            { level: 0.382, price: Number((formattedPrice * 0.96).toFixed(2)) },
            { level: 0.618, price: Number((formattedPrice * 0.94).toFixed(2)) }
          ]
        };
        break;

      case "head_and_shoulders":
        analysis = {
          pattern: "الرأس والكتفين",
          patternType: "نمط انعكاسي",
          priorTrend: "الاتجاه السابق معاكس لاتجاه التداول",
          priceAction: "حركة السعر داخل النمط شبه هابطة تفضل اتجاه التداول",
          direction: "هابط",
          currentPrice: formattedPrice,
          support: Number((formattedPrice * 0.93).toFixed(2)),
          resistance: Number((formattedPrice * 1.07).toFixed(2)),
          stopLoss: Number((formattedPrice * 1.21).toFixed(2)),
          stopLossReason: "21% من قياس الهدف بعد وقف الخسارة المطلق للأنماط المائلة",
          bestEntryPoint: {
            price: Number((formattedPrice * 0.95).toFixed(2)),
            reason: "الدخول عند كسر خط العنق"
          },
          targets: [
            {
              price: Number((formattedPrice * 0.85).toFixed(2)),
              expectedTime: addDays(new Date(), 10)
            },
            {
              price: Number((formattedPrice * 0.70).toFixed(2)),
              expectedTime: addDays(new Date(), 20)
            }
          ],
          analysisType: "Patterns",
          fibonacciLevels: [
            { level: 0.236, price: Number((formattedPrice * 0.97).toFixed(2)) },
            { level: 0.382, price: Number((formattedPrice * 0.95).toFixed(2)) },
            { level: 0.618, price: Number((formattedPrice * 0.93).toFixed(2)) }
          ]
        };
        break;

      default:
        throw new Error("نمط غير معروف");
    }

    console.log("تم إكمال تحليل النمط بنجاح:", analysis);
    return analysis;
  } catch (error) {
    console.error("خطأ في تحليل النمط:", error);
    throw error;
  }
};