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
        stopLoss: currentPrice * 1.14,
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
        stopLoss: currentPrice * 1.21,
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

    default:
      analysis = {
        pattern: "نموذج المثلث",
        patternType: "نمط استمراري",
        priorTrend: "تحليل النمط الفني",
        priceAction: "حركة السعر تتبع نمط المثلث",
        direction: "صاعد",
        currentPrice,
        support: currentPrice * 0.95,
        resistance: currentPrice * 1.05,
        stopLoss: currentPrice * 0.93,
        stopLossReason: "مستوى الدعم الرئيسي",
        bestEntryPoint: {
          price: currentPrice * 0.97,
          reason: "نقطة دخول مثالية عند مستوى الدعم"
        },
        targets: [
          {
            price: currentPrice * 1.05,
            expectedTime: addDays(new Date(), 5)
          },
          {
            price: currentPrice * 1.10,
            expectedTime: addDays(new Date(), 10)
          }
        ],
        analysisType: "Patterns"
      };
  }

  console.log("نتائج تحليل النمط:", analysis);
  return analysis;
};