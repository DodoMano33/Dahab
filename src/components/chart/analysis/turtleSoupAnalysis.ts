
import { AnalysisData } from "@/types/analysis";
import { addHours } from "date-fns";

export const analyzeTurtleSoupChart = async (
  imageData: string,
  currentPrice: number,
  symbol: string
): Promise<AnalysisData> => {
  console.log("Starting Turtle Soup analysis for symbol:", symbol);

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

      // Analyze Turtle Soup patterns
      const prices = detectTurtleSoupPrices(imageData, currentPrice);
      console.log("Detected prices for Turtle Soup analysis:", prices);

      const direction = detectTurtleSoupDirection(prices, currentPrice);
      const { support, resistance } = calculateTurtleSoupLevels(prices, currentPrice);
      
      // Calculate stop loss based on Turtle Soup strategy
      const stopLoss = calculateTurtleSoupStopLoss(currentPrice, direction, support, resistance);
      
      // Calculate targets based on Turtle Soup ratios
      const targetPrices = calculateTurtleSoupTargets(currentPrice, direction, support, resistance);

      const bestEntryPoint = calculateTurtleSoupEntryPoint(
        currentPrice,
        direction,
        support,
        resistance
      );

      const pattern = detectTurtleSoupPattern(direction);

      // Create targets with expected timelines
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

      console.log("Turtle Soup analysis results:", analysisResult);
      resolve(analysisResult);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = imageData;
  });
};

const detectTurtleSoupPrices = (imageData: ImageData, currentPrice: number): number[] => {
  // Simulate price detection with focus on Turtle Soup pattern
  const prices: number[] = [];
  const range = currentPrice * 0.01; // 1% range around current price
  
  for (let i = 0; i < 20; i++) {
    const deviation = (Math.random() - 0.5) * range;
    prices.push(currentPrice + deviation);
  }
  
  return prices.sort((a, b) => a - b);
};

const detectTurtleSoupDirection = (prices: number[], currentPrice: number): "Up" | "Down" => {
  // Determine direction based on Turtle Soup pattern
  const recentPrices = prices.slice(-5);
  const avgPrice = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
  return currentPrice < avgPrice ? "Up" : "Down";
};

const calculateTurtleSoupLevels = (prices: number[], currentPrice: number) => {
  // Calculate support and resistance levels according to Turtle Soup strategy
  const sortedPrices = [...prices].sort((a, b) => a - b);
  const support = sortedPrices[Math.floor(sortedPrices.length * 0.2)];
  const resistance = sortedPrices[Math.floor(sortedPrices.length * 0.8)];
  
  return { support, resistance };
};

const calculateTurtleSoupStopLoss = (currentPrice: number, direction: "Up" | "Down", support: number, resistance: number): number => {
  // Calculate stop loss according to Turtle Soup strategy
  const range = resistance - support;
  const stopLossPercentage = 0.5; // 50% of the range between support and resistance
  
  if (direction === "Up") {
    return currentPrice - (range * stopLossPercentage);
  } else {
    return currentPrice + (range * stopLossPercentage);
  }
};

const calculateTurtleSoupTargets = (currentPrice: number, direction: "Up" | "Down", support: number, resistance: number): number[] => {
  // Calculate targets according to Turtle Soup strategy
  const range = resistance - support;
  
  if (direction === "Up") {
    return [
      currentPrice + (range * 1),    // First target: 100% of range
      currentPrice + (range * 1.5),  // Second target: 150% of range
      currentPrice + (range * 2)     // Third target: 200% of range
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
  direction: "Up" | "Down",
  support: number,
  resistance: number
): { price: number; reason: string } => {
  const range = resistance - support;
  
  if (direction === "Up") {
    const entryPrice = support + (range * 0.2); // Entry at 20% of range
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: "Turtle Soup entry point at support test with expected price bounce"
    };
  } else {
    const entryPrice = resistance - (range * 0.2); // Entry at 20% of range
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: "Turtle Soup entry point at resistance test with expected price reversal"
    };
  }
};

const detectTurtleSoupPattern = (direction: "Up" | "Down"): string => {
  if (direction === "Up") {
    return "Bullish Turtle Soup Pattern - Support Test";
  } else {
    return "Bearish Turtle Soup Pattern - Resistance Test";
  }
};
