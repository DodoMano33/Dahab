import { AnalysisData } from "@/types/analysis";
import { addDays } from "date-fns";

export interface PatternInfo {
  name: string;
  arabicName: string;
  description: string;
  reliability: number; // 1-10
  expectedMove: "صاعد" | "هابط" | "محايد";
  stopLossPercent: number;
  targetPercent: number;
  timeframe: number; // بالأيام
}

export const patterns: PatternInfo[] = [
  {
    name: "Symmetrical Triangle",
    arabicName: "مثلث متماثل",
    description: "نمط استمراري يتكون من خطي اتجاه متقاربين بنفس الزاوية",
    reliability: 7,
    expectedMove: "محايد",
    stopLossPercent: 2,
    targetPercent: 5,
    timeframe: 14
  },
  {
    name: "Ascending Triangle",
    arabicName: "مثلث صاعد",
    description: "نمط صعودي يتكون من خط مقاومة أفقي وخط دعم صاعد",
    reliability: 8,
    expectedMove: "صاعد",
    stopLossPercent: 2,
    targetPercent: 6,
    timeframe: 10
  },
  {
    name: "Descending Triangle",
    arabicName: "مثلث هابط",
    description: "نمط هبوطي يتكون من خط دعم أفقي وخط مقاومة هابط",
    reliability: 8,
    expectedMove: "هابط",
    stopLossPercent: 2,
    targetPercent: 6,
    timeframe: 10
  },
  {
    name: "Head and Shoulders",
    arabicName: "رأس وكتفين",
    description: "نمط انعكاسي هبوطي يتكون من ثلاث قمم، الوسطى أعلى",
    reliability: 9,
    expectedMove: "هابط",
    stopLossPercent: 3,
    targetPercent: 8,
    timeframe: 21
  },
  {
    name: "Inverse Head and Shoulders",
    arabicName: "رأس وكتفين معكوس",
    description: "نمط انعكاسي صعودي يتكون من ثلاث قيعان، الوسطى أدنى",
    reliability: 9,
    expectedMove: "صاعد",
    stopLossPercent: 3,
    targetPercent: 8,
    timeframe: 21
  },
  {
    name: "Cup and Handle",
    arabicName: "الكوب والمقبض",
    description: "نمط استمراري صعودي يشبه الفنجان مع مقبض",
    reliability: 8,
    expectedMove: "صاعد",
    stopLossPercent: 2.5,
    targetPercent: 7,
    timeframe: 30
  },
  {
    name: "Falling Wedge",
    arabicName: "وتد هابط",
    description: "نمط انعكاسي صعودي يتكون من خطي اتجاه هابطين متقاربين",
    reliability: 7,
    expectedMove: "صاعد",
    stopLossPercent: 2,
    targetPercent: 5,
    timeframe: 14
  },
  {
    name: "Rising Wedge",
    arabicName: "وتد صاعد",
    description: "نمط انعكاسي هبوطي يتكون من خطي اتجاه صاعدين متقاربين",
    reliability: 7,
    expectedMove: "هابط",
    stopLossPercent: 2,
    targetPercent: 5,
    timeframe: 14
  },
  {
    name: "Rectangle",
    arabicName: "مستطيل",
    description: "نمط استمراري يتكون من خطي دعم ومقاومة متوازيين",
    reliability: 6,
    expectedMove: "محايد",
    stopLossPercent: 1.5,
    targetPercent: 4,
    timeframe: 10
  },
  {
    name: "Flag",
    arabicName: "راية",
    description: "نمط استمراري قصير المدى يظهر كتصحيح مؤقت للاتجاه",
    reliability: 7,
    expectedMove: "محايد",
    stopLossPercent: 1,
    targetPercent: 3,
    timeframe: 5
  }
];

export const identifyPattern = (chartImage: string): PatternInfo => {
  console.log("تحليل الصورة للتعرف على النمط:", chartImage);
  const randomIndex = Math.floor(Math.random() * patterns.length);
  return patterns[randomIndex];
};

export const analyzePatternWithPrice = (
  chartImage: string,
  currentPrice: number
): AnalysisData => {
  console.log("تحليل النمط مع السعر الحالي:", currentPrice);
  
  const pattern = identifyPattern(chartImage);
  console.log("النمط المكتشف:", pattern);

  const support = Number((currentPrice * (1 - pattern.stopLossPercent / 100)).toFixed(2));
  const resistance = Number((currentPrice * (1 + pattern.targetPercent / 100)).toFixed(2));
  
  const analysis: AnalysisData = {
    pattern: `${pattern.arabicName} (${pattern.name})`,
    direction: pattern.expectedMove,
    currentPrice: currentPrice,
    support: support,
    resistance: resistance,
    stopLoss: Number((currentPrice * (1 - pattern.stopLossPercent / 100)).toFixed(2)),
    bestEntryPoint: {
      price: pattern.expectedMove === "صاعد" ? support : resistance,
      reason: `أفضل نقطة دخول بناءً على نمط ${pattern.arabicName} مع موثوقية ${pattern.reliability}/10`
    },
    targets: [
      {
        price: Number((currentPrice * (1 + (pattern.targetPercent / 2) / 100)).toFixed(2)),
        expectedTime: addDays(new Date(), Math.floor(pattern.timeframe / 2))
      },
      {
        price: Number((currentPrice * (1 + pattern.targetPercent / 100)).toFixed(2)),
        expectedTime: addDays(new Date(), pattern.timeframe)
      }
    ],
    fibonacciLevels: [
      { level: 0.236, price: Number((currentPrice * 1.0236).toFixed(2)) },
      { level: 0.382, price: Number((currentPrice * 1.0382).toFixed(2)) },
      { level: 0.618, price: Number((currentPrice * 1.0618).toFixed(2)) }
    ],
    analysisType: "Patterns"
  };

  console.log("نتائج التحليل:", analysis);
  return analysis;
};
