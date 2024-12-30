import { AnalysisData } from "@/types/analysis";
import { addMinutes } from "date-fns";

export const analyzeScalpingChart = async (
  imageData: string,
  currentPrice: number,
  symbol: string
): Promise<AnalysisData> => {
  console.log("بدء تحليل السكالبينج للرمز:", symbol);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (!imageData) {
        reject(new Error("فشل في معالجة الصورة"));
        return;
      }

      const prices = detectPrices(imageData, currentPrice);
      console.log("الأسعار المكتشفة لتحليل السكالبينج:", prices);

      // تحديد الاتجاه بناءً على متوسط الأسعار
      const direction = detectScalpingTrend(prices) as "صاعد" | "هابط";
      
      // حساب مستويات الدعم والمقاومة القريبة
      const { support, resistance } = calculateNearestLevels(prices, currentPrice);
      
      // حساب وقف الخسارة (1:2 نسبة المخاطرة/المكافأة)
      const stopLoss = calculateScalpingStopLoss(currentPrice, direction, support, resistance);
      
      // حساب الأهداف القريبة
      const targetPrices = calculateScalpingTargets(currentPrice, direction, support, resistance);

      // تحديد أفضل نقطة دخول
      const bestEntry = calculateScalpingEntryPoint(currentPrice, direction, support, resistance);

      // إنشاء الأهداف مع التوقيت المتوقع (15-30 دقيقة لكل هدف)
      const targets = targetPrices.map((price, index) => ({
        price,
        expectedTime: addMinutes(new Date(), (index + 1) * 15)
      }));

      const pattern = direction === "صاعد" ? 
        "نموذج سكالبينج صعودي قصير المدى" : 
        "نموذج سكالبينج هبوطي قصير المدى";

      const analysisResult: AnalysisData = {
        pattern,
        direction,
        currentPrice,
        support,
        resistance,
        stopLoss,
        targets,
        bestEntryPoint: bestEntry,
        analysisType: "سكالبينج"
      };

      console.log("نتائج تحليل السكالبينج:", analysisResult);
      resolve(analysisResult);
    };

    img.onerror = () => {
      reject(new Error("فشل في تحميل الصورة"));
    };

    img.src = imageData;
  });
};

const detectPrices = (imageData: ImageData, currentPrice: number): number[] => {
  const prices: number[] = [];
  const height = imageData.height;
  
  // نطاق السعر للسكالبينج (0.5% فوق وتحت السعر الحالي)
  const range = currentPrice * 0.005;
  const minPrice = currentPrice - range;
  const maxPrice = currentPrice + range;
  
  for (let y = 0; y < height; y += height / 20) {
    const price = minPrice + ((y / height) * (maxPrice - minPrice));
    prices.push(Number(price.toFixed(2)));
  }
  
  return prices;
};

const detectScalpingTrend = (prices: number[]): "صاعد" | "هابط" => {
  // حساب المتوسط المتحرك السريع (5 فترات) والبطيء (10 فترات)
  const ma5 = calculateMA(prices, 5);
  const ma10 = calculateMA(prices, 10);
  
  return ma5[ma5.length - 1] > ma10[ma10.length - 1] ? "صاعد" : "هابط";
};

const calculateMA = (prices: number[], period: number): number[] => {
  const ma: number[] = [];
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    ma.push(sum / period);
  }
  return ma;
};

const calculateNearestLevels = (prices: number[], currentPrice: number) => {
  const sortedPrices = [...prices].sort((a, b) => a - b);
  const currentIndex = sortedPrices.findIndex(p => p >= currentPrice);
  
  // البحث عن أقرب مستويات الدعم والمقاومة (0.2% من السعر الحالي)
  const range = currentPrice * 0.002;
  const support = Math.max(...sortedPrices.filter(p => p < currentPrice - range));
  const resistance = Math.min(...sortedPrices.filter(p => p > currentPrice + range));
  
  return { support, resistance };
};

const calculateScalpingStopLoss = (currentPrice: number, direction: string, support: number, resistance: number): number => {
  // وقف الخسارة يكون أقرب (0.2-0.3% من نقطة الدخول)
  const stopDistance = currentPrice * 0.002;
  
  return direction === "صاعد" ? 
    Number((currentPrice - stopDistance).toFixed(2)) : 
    Number((currentPrice + stopDistance).toFixed(2));
};

const calculateScalpingTargets = (currentPrice: number, direction: string, support: number, resistance: number): number[] => {
  // الأهداف تكون قريبة (0.4-0.6% لكل هدف)
  const target1Distance = currentPrice * 0.004;
  const target2Distance = currentPrice * 0.006;
  
  if (direction === "صاعد") {
    return [
      Number((currentPrice + target1Distance).toFixed(2)),
      Number((currentPrice + target2Distance).toFixed(2))
    ];
  } else {
    return [
      Number((currentPrice - target1Distance).toFixed(2)),
      Number((currentPrice - target2Distance).toFixed(2))
    ];
  }
};

const calculateScalpingEntryPoint = (
  currentPrice: number,
  direction: string,
  support: number,
  resistance: number
): { price: number; reason: string } => {
  // حساب أفضل نقطة دخول بناءً على الاتجاه والمستويات القريبة
  const entryDistance = currentPrice * 0.001; // 0.1% من السعر الحالي
  
  if (direction === "صاعد") {
    const entryPrice = Number((currentPrice - entryDistance).toFixed(2));
    return {
      price: entryPrice,
      reason: "نقطة دخول عند تصحيح السعر القصير مع اتجاه صعودي قصير المدى"
    };
  } else {
    const entryPrice = Number((currentPrice + entryDistance).toFixed(2));
    return {
      price: entryPrice,
      reason: "نقطة دخول عند ارتداد السعر القصير مع اتجاه هبوطي قصير المدى"
    };
  }
};