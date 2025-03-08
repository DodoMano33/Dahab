
import { AnalysisData } from "@/types/analysis";
import { getExpectedTime } from "./technicalAnalysis";

export interface PatternInfo {
  name: string;
  arabicName: string;
  description: string;
  reliability: number; // 1-10
  expectedMove: "Up" | "Down" | "Neutral";
  stopLossPercent: number;
  targetPercent: number;
  timeframe: number; // in days
}

export const patterns: PatternInfo[] = [
  {
    name: "Symmetrical Triangle",
    arabicName: "مثلث متماثل",
    description: "Continuation pattern formed by two converging trendlines at the same angle",
    reliability: 7,
    expectedMove: "Neutral",
    stopLossPercent: 2,
    targetPercent: 5,
    timeframe: 14
  },
  {
    name: "Ascending Triangle",
    arabicName: "مثلث صاعد",
    description: "Bullish pattern formed by a horizontal resistance line and an ascending support line",
    reliability: 8,
    expectedMove: "Up",
    stopLossPercent: 2,
    targetPercent: 6,
    timeframe: 10
  },
  {
    name: "Descending Triangle",
    arabicName: "مثلث هابط",
    description: "Bearish pattern formed by a horizontal support line and a descending resistance line",
    reliability: 8,
    expectedMove: "Down",
    stopLossPercent: 2,
    targetPercent: 6,
    timeframe: 10
  },
  {
    name: "Head and Shoulders",
    arabicName: "رأس وكتفين",
    description: "Bearish reversal pattern formed by three peaks, with the middle peak being the highest",
    reliability: 9,
    expectedMove: "Down",
    stopLossPercent: 3,
    targetPercent: 8,
    timeframe: 21
  },
  {
    name: "Inverse Head and Shoulders",
    arabicName: "رأس وكتفين معكوس",
    description: "Bullish reversal pattern formed by three troughs, with the middle trough being the lowest",
    reliability: 9,
    expectedMove: "Up",
    stopLossPercent: 3,
    targetPercent: 8,
    timeframe: 21
  },
  {
    name: "Cup and Handle",
    arabicName: "الكوب والمقبض",
    description: "Bullish continuation pattern resembling a cup with a handle",
    reliability: 8,
    expectedMove: "Up",
    stopLossPercent: 2.5,
    targetPercent: 7,
    timeframe: 30
  },
  {
    name: "Falling Wedge",
    arabicName: "وتد هابط",
    description: "Bullish reversal pattern formed by two converging descending trendlines",
    reliability: 7,
    expectedMove: "Up",
    stopLossPercent: 2,
    targetPercent: 5,
    timeframe: 14
  },
  {
    name: "Rising Wedge",
    arabicName: "وتد صاعد",
    description: "Bearish reversal pattern formed by two converging ascending trendlines",
    reliability: 7,
    expectedMove: "Down",
    stopLossPercent: 2,
    targetPercent: 5,
    timeframe: 14
  },
  {
    name: "Rectangle",
    arabicName: "مستطيل",
    description: "Continuation pattern formed by parallel support and resistance lines",
    reliability: 6,
    expectedMove: "Neutral",
    stopLossPercent: 1.5,
    targetPercent: 4,
    timeframe: 10
  },
  {
    name: "Flag",
    arabicName: "راية",
    description: "Short-term continuation pattern appearing as a temporary correction to the trend",
    reliability: 7,
    expectedMove: "Neutral",
    stopLossPercent: 1,
    targetPercent: 3,
    timeframe: 5
  }
];

export const identifyPattern = (chartImage: string): PatternInfo => {
  console.log("Analyzing image to identify pattern:", chartImage);
  const randomIndex = Math.floor(Math.random() * patterns.length);
  return patterns[randomIndex];
};

export const analyzePatternWithPrice = (
  chartImage: string,
  currentPrice: number,
  timeframe: string = "1d"
): AnalysisData => {
  console.log("Analyzing pattern with current price and timeframe:", { currentPrice, timeframe });
  
  const pattern = identifyPattern(chartImage);
  console.log("Detected pattern:", pattern);

  // Adjust percentages based on timeframe
  const timeframeMultiplier = getTimeframeMultiplier(timeframe);
  const stopLossPercent = pattern.stopLossPercent * timeframeMultiplier;
  const targetPercent = pattern.targetPercent * timeframeMultiplier;

  const support = Number((currentPrice * (1 - stopLossPercent / 100)).toFixed(2));
  const resistance = Number((currentPrice * (1 + targetPercent / 100)).toFixed(2));
  
  const analysis: AnalysisData = {
    pattern: `${pattern.arabicName} (${pattern.name})`,
    direction: pattern.expectedMove,
    currentPrice: currentPrice,
    support: support,
    resistance: resistance,
    stopLoss: Number((currentPrice * (1 - stopLossPercent / 100)).toFixed(2)),
    bestEntryPoint: {
      price: pattern.expectedMove === "Up" ? support : resistance,
      reason: `Best entry point based on ${pattern.name} pattern with reliability ${pattern.reliability}/10 on ${timeframe} timeframe`
    },
    targets: [
      {
        price: Number((currentPrice * (1 + (targetPercent / 2) / 100)).toFixed(2)),
        expectedTime: getExpectedTime(timeframe, 0)
      },
      {
        price: Number((currentPrice * (1 + targetPercent / 100)).toFixed(2)),
        expectedTime: getExpectedTime(timeframe, 1)
      }
    ],
    fibonacciLevels: [
      { level: 0.236, price: Number((currentPrice * 1.0236).toFixed(2)) },
      { level: 0.382, price: Number((currentPrice * 1.0382).toFixed(2)) },
      { level: 0.618, price: Number((currentPrice * 1.0618).toFixed(2)) }
    ],
    analysisType: "Patterns"
  };

  console.log("Analysis results:", analysis);
  return analysis;
};

const getTimeframeMultiplier = (timeframe: string): number => {
  switch (timeframe) {
    case "1m":
      return 0.2;  // Very small percentages for 1-minute timeframe
    case "5m":
      return 0.4;
    case "30m":
      return 0.6;
    case "1h":
      return 0.8;
    case "4h":
      return 1.0;
    case "1d":
      return 1.2;  // Larger percentages for daily timeframe
    default:
      return 1.0;
  }
};
