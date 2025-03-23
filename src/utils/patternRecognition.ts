
import { AnalysisData } from "@/types/analysis";
import { getExpectedTime } from "./technicalAnalysis";

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

export const identifyPattern = (chartImage: string, patternIndex?: number): PatternInfo => {
  console.log("تحليل الصورة للتعرف على النمط:", chartImage.substring(0, 20) + "...");
  
  // إذا تم تحديد مؤشر نمط، استخدمه مباشرة
  if (patternIndex !== undefined && patternIndex >= 0 && patternIndex < patterns.length) {
    console.log(`استخدام النمط المحدد بمؤشر ${patternIndex}: ${patterns[patternIndex].name}`);
    return patterns[patternIndex];
  }
  
  // اختيار نمط عشوائي
  const randomIndex = Math.floor(Math.random() * patterns.length);
  console.log(`اختيار نمط عشوائي بمؤشر ${randomIndex}: ${patterns[randomIndex].name}`);
  return patterns[randomIndex];
};

export const analyzePatternWithPrice = (
  chartImage: string,
  currentPrice: number,
  timeframe: string = "1d",
  patternIndex?: number
): AnalysisData => {
  console.log("تحليل النمط مع السعر الحالي والإطار الزمني:", { currentPrice, timeframe });
  
  const pattern = identifyPattern(chartImage, patternIndex);
  console.log("النمط المكتشف:", pattern);

  // تعديل النسب بناءً على الإطار الزمني
  const timeframeMultiplier = getTimeframeMultiplier(timeframe);
  const stopLossPercent = pattern.stopLossPercent * timeframeMultiplier;
  const targetPercent = pattern.targetPercent * timeframeMultiplier;

  // حساب الدعم والمقاومة بناءً على اتجاه النمط
  let support: number;
  let resistance: number;
  
  if (pattern.expectedMove === "صاعد") {
    support = Number((currentPrice * (1 - stopLossPercent / 100)).toFixed(2));
    resistance = Number((currentPrice * (1 + targetPercent / 100)).toFixed(2));
  } else if (pattern.expectedMove === "هابط") {
    support = Number((currentPrice * (1 - targetPercent / 100)).toFixed(2));
    resistance = Number((currentPrice * (1 + stopLossPercent / 100)).toFixed(2));
  } else {
    // للاتجاه المحايد، نوزع المسافة بالتساوي
    const rangePercent = (stopLossPercent + targetPercent) / 2;
    support = Number((currentPrice * (1 - rangePercent / 100)).toFixed(2));
    resistance = Number((currentPrice * (1 + rangePercent / 100)).toFixed(2));
  }
  
  // حساب نقطة وقف الخسارة بشكل صحيح بناءً على اتجاه النمط
  const stopLoss = pattern.expectedMove === "صاعد" 
    ? support * 0.99 // أقل من الدعم للاتجاه الصاعد
    : resistance * 1.01; // أعلى من المقاومة للاتجاه الهابط
  
  // حساب الأهداف بشكل متنوع بناءً على اتجاه النمط
  let targets = [];
  
  if (pattern.expectedMove === "صاعد") {
    targets = [
      {
        price: Number((currentPrice * (1 + (targetPercent / 3) / 100)).toFixed(2)),
        expectedTime: getExpectedTime(timeframe, 0)
      },
      {
        price: Number((currentPrice * (1 + (targetPercent * 2/3) / 100)).toFixed(2)),
        expectedTime: getExpectedTime(timeframe, 1)
      },
      {
        price: Number((currentPrice * (1 + targetPercent / 100)).toFixed(2)),
        expectedTime: getExpectedTime(timeframe, 2)
      }
    ];
  } else if (pattern.expectedMove === "هابط") {
    targets = [
      {
        price: Number((currentPrice * (1 - (targetPercent / 3) / 100)).toFixed(2)),
        expectedTime: getExpectedTime(timeframe, 0)
      },
      {
        price: Number((currentPrice * (1 - (targetPercent * 2/3) / 100)).toFixed(2)),
        expectedTime: getExpectedTime(timeframe, 1)
      },
      {
        price: Number((currentPrice * (1 - targetPercent / 100)).toFixed(2)),
        expectedTime: getExpectedTime(timeframe, 2)
      }
    ];
  } else {
    // للاتجاه المحايد، هدف واحد لكل اتجاه
    targets = [
      {
        price: resistance,
        expectedTime: getExpectedTime(timeframe, 0)
      },
      {
        price: support,
        expectedTime: getExpectedTime(timeframe, 1)
      }
    ];
  }
  
  // حساب أفضل نقطة دخول
  const bestEntryPrice = pattern.expectedMove === "صاعد" 
    ? Number((Math.max(currentPrice * 0.995, support * 1.01)).toFixed(2))
    : Number((Math.min(currentPrice * 1.005, resistance * 0.99)).toFixed(2));
  
  // حساب مستويات فيبوناتشي بناءً على اتجاه النمط
  const range = resistance - support;
  const fibBase = pattern.expectedMove === "صاعد" ? support : resistance;
  const fibMultiplier = pattern.expectedMove === "صاعد" ? 1 : -1;
  
  const fibonacciLevels = [
    { level: 0.236, price: Number((fibBase + fibMultiplier * range * 0.236).toFixed(2)) },
    { level: 0.382, price: Number((fibBase + fibMultiplier * range * 0.382).toFixed(2)) },
    { level: 0.5, price: Number((fibBase + fibMultiplier * range * 0.5).toFixed(2)) },
    { level: 0.618, price: Number((fibBase + fibMultiplier * range * 0.618).toFixed(2)) },
    { level: 0.786, price: Number((fibBase + fibMultiplier * range * 0.786).toFixed(2)) }
  ];
  
  // إنشاء كائن التحليل النهائي
  const analysis: AnalysisData = {
    pattern: `${pattern.arabicName} (${pattern.name})`,
    direction: pattern.expectedMove,
    currentPrice: currentPrice,
    support: support,
    resistance: resistance,
    stopLoss: stopLoss,
    bestEntryPoint: {
      price: bestEntryPrice,
      reason: `أفضل نقطة دخول بناءً على نمط ${pattern.arabicName} مع موثوقية ${pattern.reliability}/10 على الإطار الزمني ${timeframe}`
    },
    targets: targets,
    fibonacciLevels: fibonacciLevels,
    analysisType: "نمطي",
    timeframe: timeframe
  };

  console.log("نتائج التحليل:", analysis);
  return analysis;
};

const getTimeframeMultiplier = (timeframe: string): number => {
  switch (timeframe) {
    case "1m":
      return 0.2;  // نسب صغيرة جداً للإطار الزمني 1 دقيقة
    case "5m":
      return 0.4;
    case "30m":
      return 0.6;
    case "1h":
      return 0.8;
    case "4h":
      return 1.0;
    case "1d":
      return 1.2;  // نسب أكبر للإطار الزمني اليومي
    default:
      return 1.0;
  }
};
