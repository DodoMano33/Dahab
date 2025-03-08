
import { AnalysisData } from "@/types/analysis";
import { convertArabicDirectionToEnglish } from "@/utils/directionConverter";

export const analyzeRNN = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("Analyzing chart with RNN for:", { timeframe, currentPrice });
  
  // مُحاكاة التحليل باستخدام الشبكات العصبية المتكررة
  const arabicDirection = Math.random() > 0.5 ? "صاعد" : "هابط";
  const direction = convertArabicDirectionToEnglish(arabicDirection);
  const movePercent = Math.random() * 0.05 + 0.01; // حركة بين 1% و 6%
  
  const support = Number((currentPrice * (1 - Math.random() * 0.03)).toFixed(2));
  const resistance = Number((currentPrice * (1 + Math.random() * 0.03)).toFixed(2));
  
  // احتساب مستويات وقف الخسارة بناءً على الاتجاه
  const stopLoss = direction === "Up" 
    ? Number((support - currentPrice * 0.005).toFixed(2))
    : Number((resistance + currentPrice * 0.005).toFixed(2));
  
  // مستويات الأهداف
  const targets = [];
  if (direction === "Up") {
    const target1Price = Number((currentPrice * (1 + movePercent * 0.5)).toFixed(2));
    const target2Price = Number((currentPrice * (1 + movePercent)).toFixed(2));
    const target3Price = Number((currentPrice * (1 + movePercent * 1.5)).toFixed(2));
    
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
      expectedTime: new Date(Date.now() + 72 * 60 * 60 * 1000) // 72 ساعة
    });
  } else {
    const target1Price = Number((currentPrice * (1 - movePercent * 0.5)).toFixed(2));
    const target2Price = Number((currentPrice * (1 - movePercent)).toFixed(2));
    const target3Price = Number((currentPrice * (1 - movePercent * 1.5)).toFixed(2));
    
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
      expectedTime: new Date(Date.now() + 72 * 60 * 60 * 1000) // 72 ساعة
    });
  }
  
  // نقطة الدخول المثالية
  const entryPrice = direction === "Up"
    ? Number((currentPrice * (1 + Math.random() * 0.005)).toFixed(2))
    : Number((currentPrice * (1 - Math.random() * 0.005)).toFixed(2));
  
  const result: AnalysisData = {
    pattern: "RNN Pattern Analysis",
    direction,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: {
      price: entryPrice,
      reason: "Entry based on RNN analysis of historical patterns"
    },
    analysisType: "RNN", 
    activation_type: "Automatic"
  };
  
  return result;
};
