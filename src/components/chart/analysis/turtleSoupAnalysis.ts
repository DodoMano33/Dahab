import { AnalysisData } from "@/types/analysis";
import { addHours } from "date-fns";

export const analyzeTurtleSoupChart = async (
  imageData: string,
  currentPrice: number,
  symbol: string
): Promise<AnalysisData> => {
  console.log("بدء تحليل Turtle Soup للرمز:", symbol);

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

      // تحليل أنماط Turtle Soup
      const prices = detectTurtleSoupPrices(imageData, currentPrice);
      console.log("الأسعار المكتشفة لتحليل Turtle Soup:", prices);

      const direction = detectTurtleSoupDirection(prices, currentPrice);
      const { support, resistance } = calculateTurtleSoupLevels(prices, currentPrice);
      
      // حساب نقطة وقف الخسارة بناءً على استراتيجية Turtle Soup
      const stopLoss = calculateTurtleSoupStopLoss(currentPrice, direction, support, resistance);
      
      // حساب الأهداف بناءً على نسب Turtle Soup
      const targetPrices = calculateTurtleSoupTargets(currentPrice, direction, support, resistance);

      const bestEntryPoint = calculateTurtleSoupEntryPoint(
        currentPrice,
        direction,
        support,
        resistance
      );

      const pattern = detectTurtleSoupPattern(direction);

      // إنشاء الأهداف مع توقيتات متوقعة
      const targets = targetPrices.map((price, index) => ({
        price,
        expectedTime: addHours(new Date(), (index + 1) * 4)
      }));

      const analysisResult: AnalysisData = {
        pattern,
        direction,
        currentPrice,
        support,
        resistance,
        stopLoss,
        targets,
        bestEntryPoint,
        analysisType: "Turtle Soup"
      };

      console.log("نتائج تحليل Turtle Soup:", analysisResult);
      resolve(analysisResult);
    };

    img.onerror = () => {
      reject(new Error("فشل في تحميل الصورة"));
    };

    img.src = imageData;
  });
};

const detectTurtleSoupPrices = (imageData: ImageData, currentPrice: number): number[] => {
  // محاكاة اكتشاف الأسعار مع التركيز على نمط Turtle Soup
  const prices: number[] = [];
  const range = currentPrice * 0.01; // نطاق 1% حول السعر الحالي
  
  for (let i = 0; i < 20; i++) {
    const deviation = (Math.random() - 0.5) * range;
    prices.push(currentPrice + deviation);
  }
  
  return prices.sort((a, b) => a - b);
};

const detectTurtleSoupDirection = (prices: number[], currentPrice: number): "صاعد" | "هابط" => {
  // تحديد الاتجاه بناءً على نمط Turtle Soup
  const recentPrices = prices.slice(-5);
  const avgPrice = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
  return currentPrice < avgPrice ? "صاعد" : "هابط";
};

const calculateTurtleSoupLevels = (prices: number[], currentPrice: number) => {
  // حساب مستويات الدعم والمقاومة وفقاً لاستراتيجية Turtle Soup
  const sortedPrices = [...prices].sort((a, b) => a - b);
  const support = sortedPrices[Math.floor(sortedPrices.length * 0.2)];
  const resistance = sortedPrices[Math.floor(sortedPrices.length * 0.8)];
  
  return { support, resistance };
};

const calculateTurtleSoupStopLoss = (currentPrice: number, direction: "صاعد" | "هابط", support: number, resistance: number): number => {
  // حساب وقف الخسارة وفقاً لاستراتيجية Turtle Soup
  const range = resistance - support;
  const stopLossPercentage = 0.5; // 50% من المسافة بين الدعم والمقاومة
  
  if (direction === "صاعد") {
    return currentPrice - (range * stopLossPercentage);
  } else {
    return currentPrice + (range * stopLossPercentage);
  }
};

const calculateTurtleSoupTargets = (currentPrice: number, direction: "صاعد" | "هابط", support: number, resistance: number): number[] => {
  // حساب الأهداف وفقاً لاستراتيجية Turtle Soup
  const range = resistance - support;
  
  if (direction === "صاعد") {
    return [
      currentPrice + (range * 1),    // الهدف الأول: 100% من المدى
      currentPrice + (range * 1.5),  // الهدف الثاني: 150% من المدى
      currentPrice + (range * 2)     // الهدف الثالث: 200% من المدى
    ];
  } else {
    return [
      currentPrice - (range * 1),
      currentPrice - (range * 1.5),
      currentPrice - (range * 2)
    ];
  }
};

const calculateTurtleSoupEntryPoint = (
  currentPrice: number,
  direction: "صاعد" | "هابط",
  support: number,
  resistance: number
): { price: number; reason: string } => {
  const range = resistance - support;
  
  if (direction === "صاعد") {
    const entryPrice = support + (range * 0.2); // دخول عند 20% من المدى
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: "نقطة دخول Turtle Soup عند اختبار مستوى الدعم مع توقع ارتداد السعر"
    };
  } else {
    const entryPrice = resistance - (range * 0.2); // دخول عند 20% من المدى
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: "نقطة دخول Turtle Soup عند اختبار مستوى المقاومة مع توقع انعكاس السعر"
    };
  }
};

const detectTurtleSoupPattern = (direction: "صاعد" | "هابط"): string => {
  if (direction === "صاعد") {
    return "نموذج Turtle Soup صاعد - اختبار مستوى الدعم";
  } else {
    return "نموذج Turtle Soup هابط - اختبار مستوى المقاومة";
  }
};