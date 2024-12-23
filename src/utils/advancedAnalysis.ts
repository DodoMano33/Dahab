import { calculateTechnicalIndicators } from './technicalIndicators';

interface PriceData {
  prices: number[];
  volumes?: number[];
}

interface AdvancedAnalysisResult {
  entryPoint: number;
  confidence: number;
  reasons: string[];
}

export const analyzeAdvancedEntryPoint = (
  data: PriceData,
  currentPrice: number,
  direction: "صاعد" | "هابط",
  support: number,
  resistance: number
): AdvancedAnalysisResult => {
  const indicators = calculateTechnicalIndicators(data.prices, data.volumes);
  const reasons: string[] = [];
  let confidenceScore = 0;
  let suggestedEntry = currentPrice;

  // تحليل RSI
  if (indicators.rsi < 30 && direction === "صاعد") {
    confidenceScore += 2;
    reasons.push("مؤشر القوة النسبية RSI يشير إلى تشبع بيعي (فرصة شراء)");
    suggestedEntry = currentPrice;
  } else if (indicators.rsi > 70 && direction === "هابط") {
    confidenceScore += 2;
    reasons.push("مؤشر القوة النسبية RSI يشير إلى تشبع شرائي (فرصة بيع)");
    suggestedEntry = currentPrice;
  }

  // تحليل بولينجر باند
  const { bollingerBands } = indicators;
  if (currentPrice <= bollingerBands.lower && direction === "صاعد") {
    confidenceScore += 1.5;
    reasons.push("السعر عند الحد السفلي لمؤشر بولينجر (دعم محتمل)");
    suggestedEntry = currentPrice;
  } else if (currentPrice >= bollingerBands.upper && direction === "هابط") {
    confidenceScore += 1.5;
    reasons.push("السعر عند الحد العلوي لمؤشر بولينجر (مقاومة محتملة)");
    suggestedEntry = currentPrice;
  }

  // تحليل المتوسطات المتحركة
  const { movingAverages } = indicators;
  if (movingAverages.short > movingAverages.long && direction === "صاعد") {
    confidenceScore += 1.5;
    reasons.push("المتوسط المتحرك القصير يتجاوز المتوسط الطويل (إشارة صعود)");
  } else if (movingAverages.short < movingAverages.long && direction === "هابط") {
    confidenceScore += 1.5;
    reasons.push("المتوسط المتحرك القصير أقل من المتوسط الطويل (إشارة هبوط)");
  }

  // تحليل الدعم والمقاومة
  const priceRange = resistance - support;
  const distanceFromSupport = currentPrice - support;
  const distanceFromResistance = resistance - currentPrice;
  
  if (direction === "صاعد" && distanceFromSupport < priceRange * 0.2) {
    confidenceScore += 2;
    reasons.push("السعر قريب من مستوى الدعم في اتجاه صاعد (فرصة شراء)");
    suggestedEntry = currentPrice;
  } else if (direction === "هابط" && distanceFromResistance < priceRange * 0.2) {
    confidenceScore += 2;
    reasons.push("السعر قريب من مستوى المقاومة في اتجاه هابط (فرصة بيع)");
    suggestedEntry = currentPrice;
  }

  // نصائح إضافية حسب التحليل الفني
  if (indicators.obv > 0) {
    reasons.push("مؤشر OBV إيجابي يدعم اتجاه السعر");
    confidenceScore += 1;
  }

  return {
    entryPoint: suggestedEntry,
    confidence: Math.min(confidenceScore, 10),
    reasons: reasons.length > 0 ? reasons : ["لا توجد إشارات قوية في الوقت الحالي"]
  };
};