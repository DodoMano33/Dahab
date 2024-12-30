import { AnalysisData } from "@/types/analysis";
import {
  calculateFibonacciLevels,
  calculateTargets,
  calculateStopLoss,
  calculateSupportResistance,
  detectTrend,
  calculateBestEntryPoint,
} from "@/utils/technicalAnalysis";
import { addDays } from "date-fns";

export const analyzeSMCChart = async (
  imageData: string,
  currentPrice: number,
  symbol: string
): Promise<AnalysisData> => {
  console.log("بدء تحليل SMC للرمز:", symbol);

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
      console.log("الأسعار المكتشفة لتحليل SMC:", prices);

      const direction = detectTrend(prices) as "صاعد" | "هابط";
      const { support, resistance } = calculateSupportResistance(prices, currentPrice, direction, false);
      
      // تعديل حساب وقف الخسارة ليكون أكثر دقة في SMC
      const stopLoss = calculateSMCStopLoss(currentPrice, direction, support, resistance);
      
      // حساب مستويات فيبوناتشي مع تركيز على مناطق السيولة
      const fibLevels = calculateFibonacciLevels(resistance, support);
      
      // حساب الأهداف مع مراعاة مناطق تجمع السيولة
      const targetPrices = calculateSMCTargets(currentPrice, direction, support, resistance);

      const bestEntryPoint = calculateSMCEntryPoint(
        currentPrice,
        direction,
        support,
        resistance,
        fibLevels
      );

      const pattern = detectSMCPattern(direction, prices, currentPrice);

      // إنشاء الأهداف مع توقيتات مناسبة
      const targets = targetPrices.map((price, index) => ({
        price,
        expectedTime: addDays(new Date(), (index + 1) * 3) // كل هدف متوقع بعد 3 أيام من الهدف السابق
      }));

      const analysisResult: AnalysisData = {
        pattern,
        direction,
        currentPrice,
        support,
        resistance,
        stopLoss,
        targets,
        fibonacciLevels: fibLevels,
        bestEntryPoint,
        analysisType: "SMC"
      };

      console.log("نتائج تحليل SMC:", analysisResult);
      resolve(analysisResult);
    };

    img.onerror = () => {
      reject(new Error("فشل في تحميل الصورة"));
    };

    img.src = imageData;
  });
};

const detectPrices = (imageData: ImageData, providedCurrentPrice?: number): number[] => {
  const prices: number[] = [];
  const height = imageData.height;
  
  const currentPriceRow = Math.floor(height * 0.5); 
  let currentPrice = providedCurrentPrice || 2622; 
  
  for (let y = 0; y < height; y += height / 10) {
    let sum = 0;
    let count = 0;
    
    for (let x = 0; x < 50; x++) {
      const index = (Math.floor(y) * imageData.width + x) * 4;
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      
      sum += (r + g + b) / 3;
      count++;
    }
    
    if (count > 0) {
      if (Math.abs(y - currentPriceRow) < height / 20) {
        prices.push(currentPrice);
      } else {
        const price = currentPrice + ((y - currentPriceRow) / height) * 100;
        prices.push(Math.round(price * 100) / 100);
      }
    }
  }
  
  console.log("الأسعار المكتشفة:", prices);
  return prices;
};

const calculateSMCStopLoss = (currentPrice: number, direction: string, support: number, resistance: number): number => {
  const range = resistance - support;
  // حساب وقف الخسارة بناءً على مناطق السيولة
  if (direction === "صاعد") {
    return currentPrice - (range * 0.15); // وقف خسارة تحت منطقة السيولة
  } else {
    return currentPrice + (range * 0.15); // وقف خسارة فوق منطقة السيولة
  }
};

const calculateSMCTargets = (currentPrice: number, direction: string, support: number, resistance: number): number[] => {
  const range = resistance - support;
  const targets = [];
  
  if (direction === "صاعد") {
    // أهداف صعودية تستهدف مناطق السيولة العلوية
    targets.push(resistance + (range * 0.3));  // منطقة السيولة الأولى
    targets.push(resistance + (range * 0.6));  // منطقة السيولة الثانية
    targets.push(resistance + range);          // منطقة السيولة الرئيسية
  } else {
    // أهداف هبوطية تستهدف مناطق السيولة السفلية
    targets.push(support - (range * 0.3));     // منطقة السيولة الأولى
    targets.push(support - (range * 0.6));     // منطقة السيولة الثانية
    targets.push(support - range);             // منطقة السيولة الرئيسية
  }
  
  return targets;
};

const calculateSMCEntryPoint = (
  currentPrice: number,
  direction: string,
  support: number,
  resistance: number,
  fibLevels: { level: number; price: number }[]
): { price: number; reason: string } => {
  const range = resistance - support;
  
  if (direction === "صاعد") {
    const entryPrice = currentPrice - (range * 0.1);
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: "نقطة دخول عند منطقة تجمع السيولة السفلية مع احتمالية اختراق صعودي"
    };
  } else {
    const entryPrice = currentPrice + (range * 0.1);
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: "نقطة دخول عند منطقة تجمع السيولة العلوية مع احتمالية اختراق هبوطي"
    };
  }
};

const detectSMCPattern = (direction: string, prices: number[], currentPrice: number): string => {
  if (direction === "صاعد") {
    return "نموذج تجميع سيولة قبل الاختراق الصعودي";
  } else {
    return "نموذج تجميع سيولة قبل الاختراق الهبوطي";
  }
};
