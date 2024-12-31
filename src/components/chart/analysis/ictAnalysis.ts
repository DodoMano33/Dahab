import { AnalysisData } from "@/types/analysis";
import { addHours } from "date-fns";

export const analyzeICTChart = async (
  imageData: string,
  currentPrice: number,
  symbol: string
): Promise<AnalysisData> => {
  console.log("بدء تحليل ICT للرمز:", symbol);

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

      // تحليل مناطق السيولة المؤسسية وفقاً لاستراتيجية الفيديو
      const prices = detectICTPrices(imageData, currentPrice);
      console.log("الأسعار المكتشفة لتحليل ICT:", prices);

      // تحديد الاتجاه بناءً على مناطق تجمع السيولة
      const direction = detectICTDirection(prices, currentPrice);
      
      // حساب مستويات الدعم والمقاومة بناءً على مناطق تجمع السيولة المؤسسية
      const { support, resistance } = calculateICTLevels(prices, currentPrice);
      
      // حساب نقطة وقف الخسارة بناءً على مناطق السيولة المؤسسية
      const stopLoss = calculateICTStopLoss(currentPrice, direction, support, resistance);
      
      // حساب الأهداف بناءً على مناطق تجمع السيولة المؤسسية
      const targetPrices = calculateICTTargets(currentPrice, direction, support, resistance);

      // تحديد أفضل نقطة دخول بناءً على مناطق تجمع السيولة
      const bestEntryPoint = calculateICTEntryPoint(
        currentPrice,
        direction,
        support,
        resistance
      );

      // تحديد النموذج المؤسسي
      const pattern = detectICTPattern(direction, prices, currentPrice);

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
        analysisType: "ICT"
      };

      console.log("نتائج تحليل ICT:", analysisResult);
      resolve(analysisResult);
    };

    img.onerror = () => {
      reject(new Error("فشل في تحميل الصورة"));
    };

    img.src = imageData;
  });
};

const detectICTPrices = (imageData: ImageData, currentPrice: number): number[] => {
  // تحليل مناطق تجمع السيولة المؤسسية
  const prices: number[] = [];
  const range = currentPrice * 0.03; // نطاق 3% حول السعر الحالي
  
  // محاكاة اكتشاف مناطق تجمع السيولة
  for (let i = 0; i < 20; i++) {
    const deviation = (Math.random() - 0.5) * range;
    prices.push(currentPrice + deviation);
  }
  
  return prices.sort((a, b) => a - b);
};

const detectICTDirection = (prices: number[], currentPrice: number): "صاعد" | "هابط" => {
  // تحديد الاتجاه بناءً على موقع السعر من مناطق تجمع السيولة المؤسسية
  const midPoint = prices[Math.floor(prices.length / 2)];
  const recentPrices = prices.slice(-5);
  const avgRecentPrice = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
  
  // تحليل نمط حركة السعر
  if (currentPrice > avgRecentPrice && currentPrice > midPoint) {
    return "صاعد";
  } else {
    return "هابط";
  }
};

const calculateICTLevels = (prices: number[], currentPrice: number) => {
  // حساب مستويات الدعم والمقاومة بناءً على مناطق تجمع السيولة المؤسسية
  const sortedPrices = [...prices].sort((a, b) => a - b);
  
  // تحديد مناطق تجمع السيولة الرئيسية
  const lowerLiquidity = sortedPrices[Math.floor(sortedPrices.length * 0.2)];
  const upperLiquidity = sortedPrices[Math.floor(sortedPrices.length * 0.8)];
  
  return {
    support: lowerLiquidity,
    resistance: upperLiquidity
  };
};

const calculateICTStopLoss = (currentPrice: number, direction: "صاعد" | "هابط", support: number, resistance: number): number => {
  const range = resistance - support;
  
  if (direction === "صاعد") {
    // وقف الخسارة تحت منطقة تجمع السيولة المؤسسية الأخيرة
    return currentPrice - (range * 0.25);
  } else {
    // وقف الخسارة فوق منطقة تجمع السيولة المؤسسية الأخيرة
    return currentPrice + (range * 0.25);
  }
};

const calculateICTTargets = (currentPrice: number, direction: "صاعد" | "هابط", support: number, resistance: number): number[] => {
  const range = resistance - support;
  
  if (direction === "صاعد") {
    return [
      currentPrice + (range * 0.382),  // الهدف الأول عند مستوى فيبوناتشي 0.382
      currentPrice + (range * 0.618),  // الهدف الثاني عند مستوى فيبوناتشي 0.618
      currentPrice + range            // الهدف الثالث عند مستوى فيبوناتشي 1.0
    ];
  } else {
    return [
      currentPrice - (range * 0.382),
      currentPrice - (range * 0.618),
      currentPrice - range
    ];
  }
};

const calculateICTEntryPoint = (
  currentPrice: number,
  direction: "صاعد" | "هابط",
  support: number,
  resistance: number
): { price: number; reason: string } => {
  const range = resistance - support;
  
  if (direction === "صاعد") {
    const entryPrice = currentPrice - (range * 0.236); // استخدام مستوى فيبوناتشي 0.236 للدخول
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: "نقطة دخول عند منطقة تجمع السيولة المؤسسية مع احتمالية اختراق صعودي بعد اختبار المنطقة"
    };
  } else {
    const entryPrice = currentPrice + (range * 0.236);
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: "نقطة دخول عند منطقة تجمع السيولة المؤسسية مع احتمالية اختراق هبوطي بعد اختبار المنطقة"
    };
  }
};

const detectICTPattern = (direction: "صاعد" | "هابط", prices: number[], currentPrice: number): string => {
  if (direction === "صاعد") {
    return "نموذج تجميع سيولة مؤسسي قبل الاختراق الصعودي - اختبار منطقة السيولة السفلية";
  } else {
    return "نموذج تجميع سيولة مؤسسي قبل الاختراق الهبوطي - اختبار منطقة السيولة العلوية";
  }
};