import { AnalysisData } from "@/types/analysis";
import {
  calculateFibonacciLevels,
  calculateSupportResistance,
  detectTrend,
} from "@/utils/technicalAnalysis";
import { addDays } from "date-fns";
import { detectPrices } from "./smc/priceDetection";
import { 
  calculateSMCStopLoss, 
  calculateSMCTargets, 
  calculateSMCEntryPoint,
  detectSMCPattern 
} from "./smc/smcCalculations";

export const analyzeSMCChart = async (
  imageData: string,
  currentPrice: number,
  symbol: string,
  timeframe: string = "1d"
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
      const { support, resistance } = calculateSupportResistance(prices, currentPrice, direction, timeframe);
      
      const stopLoss = calculateSMCStopLoss(currentPrice, direction, support, resistance, timeframe);
      const fibLevels = calculateFibonacciLevels(resistance, support);
      const targetPrices = calculateSMCTargets(currentPrice, direction, support, resistance, timeframe);
      const bestEntryPoint = calculateSMCEntryPoint(
        currentPrice,
        direction,
        support,
        resistance,
        fibLevels,
        timeframe
      );

      const pattern = detectSMCPattern(direction, prices, currentPrice);

      const targets = targetPrices.map((price, index) => ({
        price,
        expectedTime: addDays(new Date(), (index + 1) * 3)
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