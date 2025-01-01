import { AnalysisData } from "@/types/analysis";
import { addDays } from "date-fns";

export interface PatternAnalysisResult extends AnalysisData {
  patternType: string;
  priorTrend: string;
  priceAction: string;
  stopLossReason: string;
}

export const analyzePattern = (
  chartImage: string,
  currentPrice: number,
  pattern: string
): PatternAnalysisResult => {
  console.log("تحليل النمط:", pattern);
  
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
        support: currentPrice * 0.95,
        resistance: currentPrice * 1.05,
        stopLoss: currentPrice * 1.14, // 14% فوق نقطة الدخول
        stopLossReason: "14% من قياس الهدف بعد وقف الخسارة المطلق، حيث أنه دعم هيكلي",
        bestEntryPoint: {
          price: currentPrice * 0.97,
          reason: "الدخول عند كسر الحد السفلي للمثلث الهابط"
        },
        targets: [
          {
            price: currentPrice * 0.85,
            expectedTime: addDays(new Date(), 7)
          },
          {
            price: currentPrice * 0.75,
            expectedTime: addDays(new Date(), 14)
          }
        ],
        analysisType: "Patterns"
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
        support: currentPrice * 0.93,
        resistance: currentPrice * 1.07,
        stopLoss: currentPrice * 1.21, // 21% في حالة النمط المائل
        stopLossReason: "21% من قياس الهدف بعد وقف الخسارة المطلق للأنماط المائلة",
        bestEntryPoint: {
          price: currentPrice * 0.95,
          reason: "الدخول عند كسر خط العنق"
        },
        targets: [
          {
            price: currentPrice * 0.85,
            expectedTime: addDays(new Date(), 10)
          },
          {
            price: currentPrice * 0.70,
            expectedTime: addDays(new Date(), 20)
          }
        ],
        analysisType: "Patterns"
      };
      break;

    // ... المزيد من الأنماط سيتم إضافتها هنا

    default:
      throw new Error("نمط غير معروف");
  }

  console.log("نتائج تحليل النمط:", analysis);
  return analysis;
};