import { DetailedIndicators, calculateDetailedIndicators } from './technicalIndicators';
import { addDays, addHours, format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface AdvancedAnalysisResult {
  entryPoint: number;
  confidence: number;
  reasons: string[];
  indicators: DetailedIndicators;
  expectedTiming: {
    optimal: Date;
    range: {
      start: Date;
      end: Date;
    };
  };
  volumeRecommendation: {
    minimum: number;
    optimal: number;
    maximum: number;
  };
  additionalAdvice: string[];
}

export const analyzeAdvancedEntryPoint = (
  data: { prices: number[]; volumes?: number[] },
  currentPrice: number,
  direction: "صاعد" | "هابط",
  support: number,
  resistance: number
): AdvancedAnalysisResult => {
  const indicators = calculateDetailedIndicators(data.prices, data.volumes);
  const reasons: string[] = [];
  let confidenceScore = 0;
  let suggestedEntry = currentPrice;

  // تحليل RSI
  if (indicators.rsi < 30 && direction === "صاعد") {
    confidenceScore += 2;
    reasons.push(`مؤشر القوة النسبية RSI في منطقة ذروة البيع (${indicators.rsi.toFixed(2)}) - فرصة شراء`);
    suggestedEntry = currentPrice;
  } else if (indicators.rsi > 70 && direction === "هابط") {
    confidenceScore += 2;
    reasons.push(`مؤشر القوة النسبية RSI في منطقة ذروة الشراء (${indicators.rsi.toFixed(2)}) - فرصة بيع`);
    suggestedEntry = currentPrice;
  }

  // تحليل MACD
  if (indicators.macd.macdLine > indicators.macd.signalLine && direction === "صاعد") {
    confidenceScore += 1.5;
    reasons.push(`تقاطع إيجابي في مؤشر MACD (${indicators.macd.histogram.toFixed(2)})`);
  }

  // تحليل Stochastic
  if (indicators.stochastic.k < 20 && direction === "صاعد") {
    confidenceScore += 1.5;
    reasons.push(`مؤشر Stochastic في منطقة ذروة البيع (K: ${indicators.stochastic.k.toFixed(2)}, D: ${indicators.stochastic.d.toFixed(2)})`);
  }

  // تحليل ADX
  if (indicators.adx > 25) {
    confidenceScore += 1;
    reasons.push(`قوة الاتجاه ADX قوية (${indicators.adx.toFixed(2)})`);
  }

  // تحليل حجم التداول
  const { volumeProfile } = indicators;
  const volumeRecommendation = {
    minimum: volumeProfile.averageVolume * 0.8,
    optimal: volumeProfile.recommendedVolume,
    maximum: volumeProfile.averageVolume * 2
  };

  if (volumeProfile.volumeRatio > 1.2) {
    confidenceScore += 1.5;
    reasons.push(`حجم التداول أعلى من المتوسط بنسبة ${(volumeProfile.volumeRatio * 100 - 100).toFixed(2)}%`);
  }

  // تحديد التوقيت المتوقع
  const now = new Date();
  const optimalTiming = addHours(now, 4); // توقيت مثالي بعد 4 ساعات
  const timingRange = {
    start: addHours(now, 2),
    end: addHours(now, 6)
  };

  // نصائح إضافية مفصلة
  const additionalAdvice = [
    `حجم التداول المطلوب: ${volumeRecommendation.optimal.toFixed(0)} (الحد الأدنى: ${volumeRecommendation.minimum.toFixed(0)})`,
    `مستوى RSI المثالي للدخول: ${direction === "صاعد" ? "30-40" : "60-70"}`,
    `نسبة المخاطرة/العائد المقترحة: 1:${direction === "صاعد" ? "3" : "2"}`,
    `المسافة المقترحة لوقف الخسارة: ${((Math.abs(currentPrice - support) / currentPrice) * 100).toFixed(2)}%`,
    `مؤشر CCI: ${indicators.cci.toFixed(2)} (مثالي عند ${direction === "صاعد" ? "-100" : "100"})`,
    `مؤشر MFI: ${indicators.mfi.toFixed(2)} (مثالي عند ${direction === "صاعد" ? "20-30" : "70-80"})`
  ];

  return {
    entryPoint: suggestedEntry,
    confidence: Math.min(confidenceScore, 10),
    reasons,
    indicators,
    expectedTiming: {
      optimal: optimalTiming,
      range: timingRange
    },
    volumeRecommendation,
    additionalAdvice
  };
};