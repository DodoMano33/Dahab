
import { AnalysisData } from "@/types/analysis";

export const analyzeCompositeCandlestick = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("Analyzing chart with Composite Candlestick for:", { timeframe, currentPrice });
  
  // محاكاة التحليل باستخدام الشمعات المركبة
  const direction = Math.random() > 0.5 ? "صاعد" : "هابط";
  const movePercent = Math.random() * 0.045 + 0.015; // حركة بين 1.5% و 6%
  
  // احتساب مستويات الدعم والمقاومة باستخدام تحليل الشمعات
  const candlestickRange = Math.random() * 0.02 + 0.01; // نطاق الشمعة بين 1% و 3%
  const support = Number((currentPrice * (1 - candlestickRange)).toFixed(2));
  const resistance = Number((currentPrice * (1 + candlestickRange)).toFixed(2));
  
  // احتساب مستويات وقف الخسارة بناءً على الاتجاه
  const stopLoss = direction === "صاعد" 
    ? Number((support - currentPrice * 0.004).toFixed(2))
    : Number((resistance + currentPrice * 0.004).toFixed(2));
  
  // مستويات الأهداف
  const targets = [];
  if (direction === "صاعد") {
    const target1Price = Number((currentPrice * (1 + movePercent * 0.6)).toFixed(2));
    const target2Price = Number((currentPrice * (1 + movePercent)).toFixed(2));
    
    targets.push({
      price: target1Price,
      expectedTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 ساعة
    });
    targets.push({
      price: target2Price,
      expectedTime: new Date(Date.now() + 60 * 60 * 60 * 1000) // 60 ساعة
    });
  } else {
    const target1Price = Number((currentPrice * (1 - movePercent * 0.6)).toFixed(2));
    const target2Price = Number((currentPrice * (1 - movePercent)).toFixed(2));
    
    targets.push({
      price: target1Price,
      expectedTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 ساعة
    });
    targets.push({
      price: target2Price,
      expectedTime: new Date(Date.now() + 60 * 60 * 60 * 1000) // 60 ساعة
    });
  }
  
  // توليد نوع نمط الشمعة المركبة
  const candlePatterns = [
    "Three Line Strike", 
    "Morning Star", 
    "Evening Star", 
    "Three Black Crows", 
    "Three White Soldiers", 
    "Dark Cloud Cover"
  ];
  const pattern = candlePatterns[Math.floor(Math.random() * candlePatterns.length)];
  
  // نقطة الدخول المثالية
  const entryPrice = direction === "صاعد"
    ? Number((currentPrice * (1 + Math.random() * 0.002)).toFixed(2))
    : Number((currentPrice * (1 - Math.random() * 0.002)).toFixed(2));
  
  const result: AnalysisData = {
    pattern,
    direction,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: {
      price: entryPrice,
      reason: `Entry based on ${pattern} candlestick pattern`
    },
    analysisType: "شمعات مركبة",
    activation_type: "تلقائي"
  };
  
  return result;
};
