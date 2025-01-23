import { SearchHistoryItem } from "@/types/analysis";

export const generateShareText = (item: SearchHistoryItem) => {
  const { symbol, currentPrice, analysis, analysisType, timeframe } = item;
  
  const targets = analysis.targets?.map((target, index) => 
    `الهدف ${index + 1}: ${target.price}`
  ).join('\n') || '';

  const bestEntryPoint = analysis.bestEntryPoint 
    ? `\nأفضل نقطة دخول: ${analysis.bestEntryPoint.price}\nالسبب: ${analysis.bestEntryPoint.reason}`
    : '';

  return `
الرمز: ${symbol}
السعر الحالي: ${currentPrice}
نوع التحليل: ${analysisType}
الإطار الزمني: ${timeframe}
الاتجاه: ${analysis.direction}
وقف الخسارة: ${analysis.stopLoss}
${targets}${bestEntryPoint}
`.trim();
};