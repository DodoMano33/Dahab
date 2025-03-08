
import { AnalysisData } from "@/types/analysis";

export const analyzeBehavioral = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("Analyzing chart with Behavioral Analysis for:", { timeframe, currentPrice });
  
  // محاكاة التحليل السلوكي
  const direction = Math.random() > 0.5 ? "صاعد" : "هابط";
  const movePercent = Math.random() * 0.05 + 0.02; // حركة بين 2% و 7%
  
  // احتساب مستويات الدعم والمقاومة باستخدام التحليل السلوكي
  const behavioralRange = Math.random() * 0.025 + 0.015; // نطاق سلوكي بين 1.5% و 4%
  const support = Number((currentPrice * (1 - behavioralRange)).toFixed(2));
  const resistance = Number((currentPrice * (1 + behavioralRange)).toFixed(2));
  
  // احتساب مستويات وقف الخسارة بناءً على الاتجاه
  const stopLoss = direction === "صاعد" 
    ? Number((support - currentPrice * 0.005).toFixed(2))
    : Number((resistance + currentPrice * 0.005).toFixed(2));
  
  // مستويات الأهداف
  const targets = [];
  if (direction === "صاعد") {
    const target1Price = Number((currentPrice * (1 + movePercent * 0.5)).toFixed(2));
    const target2Price = Number((currentPrice * (1 + movePercent * 1.1)).toFixed(2));
    
    targets.push({
      price: target1Price,
      expectedTime: new Date(Date.now() + 36 * 60 * 60 * 1000) // 36 ساعة
    });
    targets.push({
      price: target2Price,
      expectedTime: new Date(Date.now() + 84 * 60 * 60 * 1000) // 84 ساعة
    });
  } else {
    const target1Price = Number((currentPrice * (1 - movePercent * 0.5)).toFixed(2));
    const target2Price = Number((currentPrice * (1 - movePercent * 1.1)).toFixed(2));
    
    targets.push({
      price: target1Price,
      expectedTime: new Date(Date.now() + 36 * 60 * 60 * 1000) // 36 ساعة
    });
    targets.push({
      price: target2Price,
      expectedTime: new Date(Date.now() + 84 * 60 * 60 * 1000) // 84 ساعة
    });
  }
  
  // توليد نوع نمط سلوكي
  const behavioralPatterns = [
    "Fear & Greed Pattern", 
    "Market Sentiment", 
    "Behavioral Reversal", 
    "Psychological Support/Resistance", 
    "Sentiment Extreme"
  ];
  const pattern = behavioralPatterns[Math.floor(Math.random() * behavioralPatterns.length)];
  
  // نقطة الدخول المثالية
  const entryPrice = direction === "صاعد"
    ? Number((currentPrice * (1 + Math.random() * 0.003)).toFixed(2))
    : Number((currentPrice * (1 - Math.random() * 0.003)).toFixed(2));
  
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
      reason: `Entry based on ${pattern} behavioral analysis`
    },
    analysisType: "تحليل سلوكي",
    activation_type: "تلقائي"
  };
  
  return result;
};
