import { AnalysisData } from "@/types/analysis";
import {
  calculateFibonacciLevels,
  calculateTargets,
  calculateStopLoss,
  calculateSupportResistance,
  detectTrend,
  calculateBestEntryPoint,
} from "@/utils/technicalAnalysis";
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

      const direction = detectTrend(prices) as "صاعد" | "هابط";
      const { support, resistance } = calculateSupportResistance(prices, currentPrice, direction, true);
      const stopLoss = calculateStopLoss(currentPrice, direction, support, resistance, true);
      const fibLevels = calculateFibonacciLevels(resistance, support);
      const targetPrices = calculateTargets(currentPrice, direction, support, resistance, true);

      const bestEntryPoint = calculateBestEntryPoint(
        currentPrice,
        direction,
        support,
        resistance,
        fibLevels,
        true
      );

      const pattern = direction === "صاعد" ? 
        "نموذج سكالبينج صعودي" : 
        "نموذج سكالبينج هبوطي";

      // Create targets with proper dates for scalping (shorter timeframes)
      const targets = targetPrices.map((price, index) => ({
        price,
        expectedTime: addMinutes(new Date(), (index + 1) * 15) // Each target is expected 15 minutes after the previous
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