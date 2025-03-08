
import { AnalysisData } from "@/types/analysis";

export const analyzeTimeClustering = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("Analyzing chart with Time Clustering for:", { timeframe, currentPrice });
  
  // محاكاة التحليل باستخدام التصفيق الزمني
  const direction = Math.random() > 0.5 ? "Bullish" : "Bearish";
  const movePercent = Math.random() * 0.04 + 0.01; // حركة بين 1% و 5%
  
  const support = Number((currentPrice * (1 - Math.random() * 0.025)).toFixed(2));
  const resistance = Number((currentPrice * (1 + Math.random() * 0.025)).toFixed(2));
  
  // احتساب مستويات وقف الخسارة بناءً على الاتجاه
  const stopLoss = direction === "Bullish" 
    ? Number((support - currentPrice * 0.004).toFixed(2))
    : Number((resistance + currentPrice * 0.004).toFixed(2));
  
  // مستويات الأهداف
  const targets = [];
  if (direction === "Bullish") {
    const target1Price = Number((currentPrice * (1 + movePercent * 0.7)).toFixed(2));
    const target2Price = Number((currentPrice * (1 + movePercent * 1.3)).toFixed(2));
    
    targets.push({
      price: target1Price,
      expectedTime: new Date(Date.now() + 36 * 60 * 60 * 1000) // 36 ساعة
    });
    targets.push({
      price: target2Price,
      expectedTime: new Date(Date.now() + 72 * 60 * 60 * 1000) // 72 ساعة
    });
  } else {
    const target1Price = Number((currentPrice * (1 - movePercent * 0.7)).toFixed(2));
    const target2Price = Number((currentPrice * (1 - movePercent * 1.3)).toFixed(2));
    
    targets.push({
      price: target1Price,
      expectedTime: new Date(Date.now() + 36 * 60 * 60 * 1000) // 36 ساعة
    });
    targets.push({
      price: target2Price,
      expectedTime: new Date(Date.now() + 72 * 60 * 60 * 1000) // 72 ساعة
    });
  }
  
  // نقطة الدخول المثالية
  const entryPrice = direction === "Bullish"
    ? Number((currentPrice * (1 + Math.random() * 0.002)).toFixed(2))
    : Number((currentPrice * (1 - Math.random() * 0.002)).toFixed(2));
  
  const result: AnalysisData = {
    pattern: "Time Cluster Pattern",
    direction,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: {
      price: entryPrice,
      reason: "Entry based on time clustering and seasonal patterns"
    },
    analysisType: "Time Clustering",
    activation_type: "Automatic"
  };
  
  return result;
};

