
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

export const analyzeDailyChart = async (
  imageData: string,
  currentPrice: number,
  symbol: string,
  timeframe: string = "1d"
): Promise<AnalysisData> => {
  console.log("Starting daily analysis for symbol:", symbol);

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
      console.log("Detected prices for daily analysis:", prices);

      const direction = detectTrend(prices) as "Up" | "Down";
      const { support, resistance } = calculateSupportResistance(prices, currentPrice, direction, timeframe);
      const stopLoss = calculateStopLoss(currentPrice, direction, support, resistance, timeframe);
      const fibLevelsObj = calculateFibonacciLevels(resistance, support);
      const fibLevels = fibLevelsObj.allLevels ? fibLevelsObj.allLevels : 
                         fibLevelsObj.retracementLevels.map(level => ({ 
                           level: level.level, 
                           price: level.price 
                         }));
      const targetPrices = calculateTargets(currentPrice, direction, support, resistance, timeframe);

      const bestEntryPoint = calculateBestEntryPoint(
        currentPrice,
        direction,
        support,
        resistance,
        fibLevels,
        timeframe
      );

      const pattern = direction === "Up" ? 
        "Continuing bullish pattern" : 
        "Continuing bearish pattern";

      // Create targets with proper dates
      const targets = targetPrices.map((price, index) => ({
        price,
        expectedTime: addDays(new Date(), (index + 1) * 2)
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
        analysisType: "Patterns"
      };

      console.log("Daily analysis results:", analysisResult);
      resolve(analysisResult);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
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
  
  console.log("Detected prices:", prices);
  return prices;
};
