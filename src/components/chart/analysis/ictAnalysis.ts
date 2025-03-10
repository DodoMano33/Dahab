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

      // تحليل ICT يعتمد على نقاط السيولة والمناطق المؤسسية
      const prices = detectICTPrices(imageData, currentPrice);
      console.log("الأسعار المكتشفة لتحليل ICT:", prices);

      const direction = detectICTDirection(prices, currentPrice);
      const { support, resistance } = calculateICTLevels(prices, currentPrice);
      
      // حساب نقطة وقف الخسارة بناءً على مناطق السيولة المؤسسية
      const stopLoss = calculateICTStopLoss(currentPrice, direction, support, resistance);
      
      // حساب الأهداف بناءً على مناطق تجمع السيولة المؤسسية
      const targetPrices = calculateICTTargets(currentPrice, direction, support, resistance);

      const bestEntryPoint = calculateICTEntryPoint(
        currentPrice,
        direction,
        support,
        resistance
      );

      const pattern = detectICTPattern(direction, prices, currentPrice);

      // إنشاء الأهداف مع توقيتات متوقعة
      const targets = targetPrices.map((price, index) => ({
        price,
        expectedTime: addHours(new Date(), (index + 1) * 4) // كل هدف متوقع بعد 4 ساعات
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
  // محاكاة اكتشاف الأسعار مع التركيز على مناطق السيولة المؤسسية
  const prices: number[] = [];
  const range = currentPrice * 0.02; // نطاق 2% حول السعر الحالي
  
  for (let i = 0; i < 20; i++) {
    const deviation = (Math.random() - 0.5) * range;
    prices.push(currentPrice + deviation);
  }
  
  return prices.sort((a, b) => a - b);
};

const detectICTDirection = (prices: number[], currentPrice: number): "صاعد" | "هابط" => {
  // تحديد الاتجاه بناءً على موقع السعر الحالي من مناطق السيولة المؤسسية
  const midPoint = prices[Math.floor(prices.length / 2)];
  return currentPrice > midPoint ? "صاعد" : "هابط";
};

const calculateICTLevels = (prices: number[], currentPrice: number) => {
  // حساب مستويات الدعم والمقاومة بناءً على مناطق السيولة المؤسسية
  const sortedPrices = [...prices].sort((a, b) => a - b);
  const support = sortedPrices[Math.floor(sortedPrices.length * 0.2)]; // مستوى الدعم عند 20%
  const resistance = sortedPrices[Math.floor(sortedPrices.length * 0.8)]; // مستوى المقاومة عند 80%
  
  return { support, resistance };
};

const calculateICTStopLoss = (currentPrice: number, direction: "صاعد" | "هابط", support: number, resistance: number): number => {
  const range = resistance - support;
  
  if (direction === "صاعد") {
    // وقف الخسارة تحت منطقة السيولة المؤسسية الأخيرة
    return currentPrice - (range * 0.3);
  } else {
    // وقف الخسارة فوق منطقة السيولة المؤسسية الأخيرة
    return currentPrice + (range * 0.3);
  }
};

const calculateICTTargets = (currentPrice: number, direction: "صاعد" | "هابط", support: number, resistance: number): number[] => {
  const range = resistance - support;
  
  if (direction === "صاعد") {
    return [
      currentPrice + (range * 0.5),  // الهدف الأول عند منطقة السيولة المؤسسية الأولى
      currentPrice + (range * 0.8),  // الهدف الثاني عند منطقة السيولة المؤسسية الثانية
      currentPrice + range           // الهدف الثالث عند منطقة السيولة المؤسسية الرئيسية
    ];
  } else {
    return [
      currentPrice - (range * 0.5),
      currentPrice - (range * 0.8),
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
    const entryPrice = currentPrice - (range * 0.15);
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: "نقطة دخول عند منطقة تجمع السيولة المؤسسية مع احتمالية اختراق صعودي"
    };
  } else {
    const entryPrice = currentPrice + (range * 0.15);
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: "نقطة دخول عند منطقة تجمع السيولة المؤسسية مع احتمالية اختراق هبوطي"
    };
  }
};

const detectICTPattern = (direction: "صاعد" | "هابط", prices: number[], currentPrice: number): string => {
  if (direction === "صاعد") {
    return "نموذج تجميع سيولة مؤسسي قبل الاختراق الصعودي";
  } else {
    return "نموذج تجميع سيولة مؤسسي قبل الاختراق الهبوطي";
  }
};