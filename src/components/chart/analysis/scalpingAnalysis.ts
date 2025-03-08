
import { AnalysisData } from "@/types/analysis";
import { 
  calculateSupportResistance, 
  detectTrend 
} from "@/utils/technicalAnalysis/calculations";
import { addMinutes, addHours } from "date-fns";

export const analyzeScalpingChart = async (
  imageData: string,
  currentPrice: number,
  timeframe: string = "5m"
): Promise<AnalysisData> => {
  console.log(`Starting Scalping analysis for timeframe: ${timeframe}`);
  
  // Create a canvas to analyze the chart image
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
      
      // Analyze price data
      const prices = extractPricesFromImage(imageData, currentPrice);
      console.log("Detected prices for Scalping analysis:", prices);
      
      // Determine trend and levels
      const direction = detectTrend(prices) as "صاعد" | "هابط";
      const { support, resistance } = calculateSupportResistance(prices, currentPrice, direction, timeframe);
      
      // Calculate stop loss (tighter for scalping)
      const volatility = calculateVolatility(prices);
      const stopLoss = calculateScalpingStopLoss(currentPrice, direction, volatility);
      
      // Calculate scalping-specific targets (shorter-term)
      const targetPrices = calculateScalpingTargets(currentPrice, direction, support, resistance, volatility);
      
      // Calculate the best entry point
      const bestEntryPoint = calculateScalpingEntryPoint(currentPrice, direction, support, resistance, prices);
      
      // Determine scalping pattern
      const pattern = determineScalpingPattern(prices, direction, timeframe);
      
      // Generate expected times based on timeframe (shorter for scalping)
      const getExpectedTime = (index: number) => {
        const now = new Date();
        switch (timeframe) {
          case "1m":
            return addMinutes(now, (index + 1) * 2);
          case "5m":
            return addMinutes(now, (index + 1) * 5);
          case "15m":
            return addMinutes(now, (index + 1) * 15);
          case "30m":
            return addMinutes(now, (index + 1) * 30);
          case "1h":
            return addHours(now, index + 1);
          default:
            return addMinutes(now, (index + 1) * 5);
        }
      };
      
      const targets = targetPrices.map((price, index) => ({
        price,
        expectedTime: getExpectedTime(index)
      }));
      
      // Create the final analysis result
      const analysisResult: AnalysisData = {
        pattern,
        direction,
        currentPrice,
        support,
        resistance,
        stopLoss,
        targets,
        bestEntryPoint,
        analysisType: "Scalping" // This is the exact format expected by the database
      };
      
      console.log("Scalping Analysis Results:", analysisResult);
      resolve(analysisResult);
    };
    
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    
    img.src = imageData;
  });
};

// Helper functions for scalping analysis
function extractPricesFromImage(imageData: ImageData, currentPrice: number): number[] {
  // Simplified implementation
  const priceRange = currentPrice * 0.01; // 1% range
  return [
    currentPrice - priceRange * 0.8,
    currentPrice - priceRange * 0.5,
    currentPrice - priceRange * 0.2,
    currentPrice,
    currentPrice + priceRange * 0.2,
    currentPrice + priceRange * 0.5,
    currentPrice + priceRange * 0.8
  ];
}

function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;
  
  // Calculate average price change
  let sumChanges = 0;
  for (let i = 1; i < prices.length; i++) {
    sumChanges += Math.abs(prices[i] - prices[i-1]);
  }
  
  return sumChanges / (prices.length - 1);
}

function calculateScalpingStopLoss(currentPrice: number, direction: string, volatility: number): number {
  // Scalping typically uses tighter stop losses
  const multiplier = 1.5;
  return direction === "صاعد" 
    ? currentPrice - (volatility * multiplier)
    : currentPrice + (volatility * multiplier);
}

function calculateScalpingTargets(
  currentPrice: number, 
  direction: string, 
  support: number, 
  resistance: number, 
  volatility: number
): number[] {
  // Create shorter-term targets for scalping
  const targets = [];
  const trendMultiplier = direction === "صاعد" ? 1 : -1;
  
  // Typically 3 price targets for scalping
  targets.push(currentPrice + (volatility * 1.0 * trendMultiplier));
  targets.push(currentPrice + (volatility * 2.0 * trendMultiplier));
  targets.push(currentPrice + (volatility * 3.0 * trendMultiplier));
  
  return targets;
}

function calculateScalpingEntryPoint(
  currentPrice: number, 
  direction: string, 
  support: number, 
  resistance: number, 
  prices: number[]
): { price: number, reason: string } {
  // For scalping, entry points are often closer to current price
  const entryOffset = (resistance - support) * 0.1;
  const entryPrice = direction === "صاعد"
    ? currentPrice - entryOffset
    : currentPrice + entryOffset;
    
  return {
    price: entryPrice,
    reason: direction === "صاعد"
      ? "دخول على انخفاض طفيف قبل استمرار الاتجاه الصاعد"
      : "دخول على ارتفاع طفيف قبل استمرار الاتجاه الهابط"
  };
}

function determineScalpingPattern(prices: number[], direction: string, timeframe: string): string {
  // Simplified pattern detection
  if (direction === "صاعد") {
    return "نمط سكالبينج صاعد";
  } else {
    return "نمط سكالبينج هابط";
  }
}
