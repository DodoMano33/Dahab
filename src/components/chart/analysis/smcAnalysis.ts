import { AnalysisData } from "@/types/analysis";
import {
  calculateFibonacciLevels,
  calculateSupportResistance,
  detectTrend,
} from "@/utils/technicalAnalysis/calculations";
import { addDays, addHours, addMinutes } from "date-fns";
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
  timeframe: string = "1d"
): Promise<AnalysisData> => {
  console.log(`Starting SMC analysis for timeframe: ${timeframe}`);

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
        reject(new Error("Failed to process image"));
        return;
      }

      const prices = detectPrices(imageData, currentPrice);
      console.log("Detected prices for SMC analysis:", prices);

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
        timeframe
      );

      const pattern = detectSMCPattern(direction, timeframe);

      const getExpectedTime = (index: number) => {
        const now = new Date();
        switch (timeframe) {
          case "1m":
            return addMinutes(now, (index + 1) * 5);
          case "5m":
            return addMinutes(now, (index + 1) * 15);
          case "30m":
            return addMinutes(now, (index + 1) * 60);
          case "1h":
            return addHours(now, index + 1);
          case "4h":
            return addHours(now, (index + 1) * 4);
          case "1d":
            return addDays(now, index + 3);
          default:
            return addDays(now, index + 3);
        }
      };

      const targets = targetPrices.map((price, index) => ({
        price,
        expectedTime: getExpectedTime(index)
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

      console.log("SMC Analysis Results:", analysisResult);
      resolve(analysisResult);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = imageData;
  });
};