import { calculateMovingAverage } from './chartPatternAnalysis';

interface PriceData {
  prices: number[];
  volumes?: number[];
}

interface AdvancedAnalysisResult {
  entryPoint: number;
  confidence: number;
  reasons: string[];
}

export const calculateRSI = (prices: number[], period: number = 14): number => {
  if (prices.length < period) return 50; // Default neutral value
  
  let gains = 0;
  let losses = 0;
  
  for (let i = 1; i < period; i++) {
    const difference = prices[i] - prices[i - 1];
    if (difference >= 0) {
      gains += difference;
    } else {
      losses -= difference;
    }
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

export const calculateBollingerBands = (prices: number[], period: number = 20, stdDev: number = 2) => {
  const sma = calculateMovingAverage(prices, period)[0];
  
  // Calculate Standard Deviation
  const squaredDiffs = prices.slice(0, period).map(price => Math.pow(price - sma, 2));
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / period;
  const standardDeviation = Math.sqrt(variance);
  
  const upperBand = sma + (standardDeviation * stdDev);
  const lowerBand = sma - (standardDeviation * stdDev);
  
  return { upper: upperBand, middle: sma, lower: lowerBand };
}

export const analyzeAdvancedEntryPoint = (
  data: PriceData,
  currentPrice: number,
  direction: "صاعد" | "هابط",
  support: number,
  resistance: number
): AdvancedAnalysisResult => {
  const reasons: string[] = [];
  let confidenceScore = 0;
  let suggestedEntry = currentPrice;
  
  // RSI Analysis
  const rsi = calculateRSI(data.prices);
  if (rsi < 30 && direction === "صاعد") {
    confidenceScore += 2;
    reasons.push("مؤشر RSI يشير إلى تشبع بيعي (فرصة شراء)");
    suggestedEntry = currentPrice;
  } else if (rsi > 70 && direction === "هابط") {
    confidenceScore += 2;
    reasons.push("مؤشر RSI يشير إلى تشبع شرائي (فرصة بيع)");
    suggestedEntry = currentPrice;
  }

  // Bollinger Bands Analysis
  const bb = calculateBollingerBands(data.prices);
  if (currentPrice <= bb.lower && direction === "صاعد") {
    confidenceScore += 1.5;
    reasons.push("السعر عند الحد السفلي لمؤشر بولينجر");
    suggestedEntry = currentPrice;
  } else if (currentPrice >= bb.upper && direction === "هابط") {
    confidenceScore += 1.5;
    reasons.push("السعر عند الحد العلوي لمؤشر بولينجر");
    suggestedEntry = currentPrice;
  }

  // Support/Resistance Analysis
  const priceRange = resistance - support;
  const distanceFromSupport = currentPrice - support;
  const distanceFromResistance = resistance - currentPrice;
  
  if (direction === "صاعد" && distanceFromSupport < priceRange * 0.2) {
    confidenceScore += 2;
    reasons.push("السعر قريب من مستوى الدعم في اتجاه صاعد");
    suggestedEntry = currentPrice;
  } else if (direction === "هابط" && distanceFromResistance < priceRange * 0.2) {
    confidenceScore += 2;
    reasons.push("السعر قريب من مستوى المقاومة في اتجاه هابط");
    suggestedEntry = currentPrice;
  }

  // Moving Averages Analysis
  const ma9 = calculateMovingAverage(data.prices, 9)[0];
  const ma50 = calculateMovingAverage(data.prices, 50)[0];
  
  if (ma9 > ma50 && direction === "صاعد") {
    confidenceScore += 1.5;
    reasons.push("المتوسط المتحرك 9 أيام فوق المتوسط المتحرك 50 يوم");
  } else if (ma9 < ma50 && direction === "هابط") {
    confidenceScore += 1.5;
    reasons.push("المتوسط المتحرك 9 أيام تحت المتوسط المتحرك 50 يوم");
  }

  return {
    entryPoint: suggestedEntry,
    confidence: Math.min(confidenceScore, 10),
    reasons
  };
};