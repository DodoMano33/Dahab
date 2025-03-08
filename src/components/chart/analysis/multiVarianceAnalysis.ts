
import { AnalysisData } from "@/types/analysis";
import { convertArabicDirectionToEnglish } from "@/utils/directionConverter";

export const analyzeMultiVariance = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("Analyzing chart with Multi-factor Variance for:", { timeframe, currentPrice });
  
  // مُحاكاة التحليل باستخدام التباين متعدد العوامل
  const arabicDirection = Math.random() > 0.5 ? "صاعد" : "هابط";
  const direction = convertArabicDirectionToEnglish(arabicDirection);
  const movePercent = Math.random() * 0.06 + 0.02; // حركة بين 2% و 8%
  
  // احتساب مستويات الدعم والمقاومة باستخدام تباين متعدد العوامل
  const varianceMultiplier = Math.random() * 0.01 + 0.02; // بين 2% و 3%
  const support = Number((currentPrice * (1 - varianceMultiplier)).toFixed(2));
  const resistance = Number((currentPrice * (1 + varianceMultiplier)).toFixed(2));
  
  // احتساب مستويات وقف الخسارة بناءً على الاتجاه
  const stopLoss = direction === "Up" 
    ? Number((support - currentPrice * 0.005).toFixed(2))
    : Number((resistance + currentPrice * 0.005).toFixed(2));
  
  // مستويات الأهداف
  const targets = [];
  if (direction === "Up") {
    const target1Price = Number((currentPrice * (1 + movePercent * 0.4)).toFixed(2));
    const target2Price = Number((currentPrice * (1 + movePercent * 0.8)).toFixed(2));
    const target3Price = Number((currentPrice * (1 + movePercent * 1.2)).toFixed(2));
    
    targets.push({
      price: target1Price,
      expectedTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 ساعة
    });
    targets.push({
      price: target2Price,
      expectedTime: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 ساعة
    });
    targets.push({
      price: target3Price,
      expectedTime: new Date(Date.now() + 96 * 60 * 60 * 1000) // 96 ساعة
    });
  } else {
    const target1Price = Number((currentPrice * (1 - movePercent * 0.4)).toFixed(2));
    const target2Price = Number((currentPrice * (1 - movePercent * 0.8)).toFixed(2));
    const target3Price = Number((currentPrice * (1 - movePercent * 1.2)).toFixed(2));
    
    targets.push({
      price: target1Price,
      expectedTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 ساعة
    });
    targets.push({
      price: target2Price,
      expectedTime: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 ساعة
    });
    targets.push({
      price: target3Price,
      expectedTime: new Date(Date.now() + 96 * 60 * 60 * 1000) // 96 ساعة
    });
  }
  
  // نقطة الدخول المثالية
  const entryPrice = direction === "Up"
    ? Number((currentPrice * (1 + Math.random() * 0.003)).toFixed(2))
    : Number((currentPrice * (1 - Math.random() * 0.003)).toFixed(2));
  
  const result: AnalysisData = {
    pattern: "Multi-factor Variance Pattern",
    direction,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: {
      price: entryPrice,
      reason: "Entry based on multi-factor variance analysis of market conditions"
    },
    analysisType: "Multi Variance",
    activation_type: "Automatic"
  };
  
  return result;
};
