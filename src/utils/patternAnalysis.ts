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
  currentPrice: number,
  pattern: string = "descending_triangle"
): Promise<PatternAnalysisResult> => {
  console.log("بدء تحليل النمط:", pattern);
  
  try {
    let analysis: PatternAnalysisResult;
    
    switch (pattern.toLowerCase()) {
      case "descending_triangle":
        analysis = {
          pattern: "المثلث الهابط",
          patternType: "نمط استمراري",
          priorTrend: "الاتجاه السابق في صالح اتجاه التداول",
          priceAction: "حركة السعر داخل النمط شبه هابطة تفضل اتجاه التداول",
          direction: "هابط",
          currentPrice,
          support: Number((currentPrice * 0.95).toFixed(2)),
          resistance: Number((currentPrice * 1.05).toFixed(2)),
          stopLoss: Number((currentPrice * 1.14).toFixed(2)),
          stopLossReason: "14% من قياس الهدف بعد وقف الخسارة المطلق، حيث أنه دعم هيكلي",
          bestEntryPoint: {
            price: Number((currentPrice * 0.97).toFixed(2)),
            reason: "الدخول عند كسر الحد السفلي للمثلث الهابط"
          },
          targets: [
            {
              price: Number((currentPrice * 0.85).toFixed(2)),
              expectedTime: addDays(new Date(), 7)
            },
            {
              price: Number((currentPrice * 0.75).toFixed(2)),
              expectedTime: addDays(new Date(), 14)
            }
          ],
          analysisType: "Patterns",
          fibonacciLevels: [
            { level: 0.236, price: Number((currentPrice * 0.98).toFixed(2)) },
            { level: 0.382, price: Number((currentPrice * 0.96).toFixed(2)) },
            { level: 0.618, price: Number((currentPrice * 0.94).toFixed(2)) }
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
          currentPrice,
          support: Number((currentPrice * 0.93).toFixed(2)),
          resistance: Number((currentPrice * 1.07).toFixed(2)),
          stopLoss: Number((currentPrice * 1.21).toFixed(2)),
          stopLossReason: "21% من قياس الهدف بعد وقف الخسارة المطلق للأنماط المائلة",
          bestEntryPoint: {
            price: Number((currentPrice * 0.95).toFixed(2)),
            reason: "الدخول عند كسر خط العنق"
          },
          targets: [
            {
              price: Number((currentPrice * 0.85).toFixed(2)),
              expectedTime: addDays(new Date(), 10)
            },
            {
              price: Number((currentPrice * 0.70).toFixed(2)),
              expectedTime: addDays(new Date(), 20)
            }
          ],
          analysisType: "Patterns",
          fibonacciLevels: [
            { level: 0.236, price: Number((currentPrice * 0.97).toFixed(2)) },
            { level: 0.382, price: Number((currentPrice * 0.95).toFixed(2)) },
            { level: 0.618, price: Number((currentPrice * 0.93).toFixed(2)) }
          ]
        };
        break;

      default:
        analysis = {
          pattern: "نموذج المثلث",
          patternType: "نمط استمراري",
          priorTrend: "تحليل النمط الفني",
          priceAction: "حركة السعر تتبع نمط المثلث",
          direction: "صاعد",
          currentPrice,
          support: Number((currentPrice * 0.95).toFixed(2)),
          resistance: Number((currentPrice * 1.05).toFixed(2)),
          stopLoss: Number((currentPrice * 0.93).toFixed(2)),
          stopLossReason: "مستوى الدعم الرئيسي",
          bestEntryPoint: {
            price: Number((currentPrice * 0.97).toFixed(2)),
            reason: "نقطة دخول مثالية عند مستوى الدعم"
          },
          targets: [
            {
              price: Number((currentPrice * 1.05).toFixed(2)),
              expectedTime: addDays(new Date(), 5)
            },
            {
              price: Number((currentPrice * 1.10).toFixed(2)),
              expectedTime: addDays(new Date(), 10)
            }
          ],
          analysisType: "Patterns",
          fibonacciLevels: [
            { level: 0.236, price: Number((currentPrice * 1.02).toFixed(2)) },
            { level: 0.382, price: Number((currentPrice * 1.04).toFixed(2)) },
            { level: 0.618, price: Number((currentPrice * 1.06).toFixed(2)) }
          ]
        };
    }

    console.log("نتائج تحليل النمط:", analysis);
    return analysis;
  } catch (error) {
    console.error("خطأ في تحليل النمط:", error);
    throw new Error("فشل في تحليل النمط");
  }
};