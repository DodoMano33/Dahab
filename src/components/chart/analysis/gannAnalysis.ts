import { addDays } from "date-fns";

interface GannLevels {
  price: number;
  angle: number;
  significance: string;
}

export const analyzeGannChart = async (chartImage: string, currentPrice: number, symbol: string) => {
  console.log("بدء تحليل Gann للرمز:", symbol);

  // حساب مستويات غان الرئيسية (1x1, 2x1, 3x1, 4x1)
  const gannLevels: GannLevels[] = calculateGannLevels(currentPrice);
  
  // تحديد الاتجاه بناءً على موقع السعر من خطوط غان
  const direction = determineGannDirection(currentPrice, gannLevels);
  
  // حساب نقاط الدعم والمقاومة باستخدام مستويات غان
  const { support, resistance } = calculateGannSupportResistance(currentPrice, gannLevels);
  
  // حساب وقف الخسارة باستخدام زاوية غان 1x1
  const stopLoss = calculateGannStopLoss(currentPrice, direction, gannLevels);
  
  // تحديد أفضل نقطة دخول
  const bestEntryPoint = calculateGannEntryPoint(currentPrice, direction, gannLevels);
  
  // حساب الأهداف المتوقعة باستخدام زوايا غان
  const targets = calculateGannTargets(currentPrice, direction, gannLevels);

  console.log("نتائج تحليل Gann:", {
    direction,
    support,
    resistance,
    stopLoss,
    bestEntryPoint,
    targets,
    gannLevels
  });

  return {
    pattern: `نموذج Gann ${direction === "صاعد" ? "صاعد" : "هابط"} - ${getGannPattern(currentPrice, gannLevels)}`,
    direction,
    currentPrice,
    support,
    resistance,
    stopLoss,
    bestEntryPoint,
    targets,
    analysisType: "Gann" as const
  };
};

function calculateGannLevels(currentPrice: number): GannLevels[] {
  return [
    { price: currentPrice * 1.125, angle: 45, significance: "1x1" },
    { price: currentPrice * 1.25, angle: 63.75, significance: "2x1" },
    { price: currentPrice * 1.375, angle: 75, significance: "3x1" },
    { price: currentPrice * 1.5, angle: 82.5, significance: "4x1" },
    { price: currentPrice * 0.875, angle: -45, significance: "1x1" },
    { price: currentPrice * 0.75, angle: -63.75, significance: "2x1" },
    { price: currentPrice * 0.625, angle: -75, significance: "3x1" },
    { price: currentPrice * 0.5, angle: -82.5, significance: "4x1" }
  ];
}

function determineGannDirection(currentPrice: number, levels: GannLevels[]): "صاعد" | "هابط" {
  const mainLevel = levels.find(l => l.significance === "1x1" && l.angle === 45);
  return currentPrice > (mainLevel?.price || currentPrice) ? "صاعد" : "هابط";
}

function calculateGannSupportResistance(currentPrice: number, levels: GannLevels[]) {
  const support = levels
    .filter(l => l.price < currentPrice)
    .reduce((closest, level) => 
      Math.abs(currentPrice - level.price) < Math.abs(currentPrice - closest) ? level.price : closest
    , currentPrice * 0.5);

  const resistance = levels
    .filter(l => l.price > currentPrice)
    .reduce((closest, level) => 
      Math.abs(currentPrice - level.price) < Math.abs(currentPrice - closest) ? level.price : closest
    , currentPrice * 1.5);

  return { support, resistance };
}

function calculateGannStopLoss(currentPrice: number, direction: string, levels: GannLevels[]) {
  const relevantLevels = levels.filter(l => 
    direction === "صاعد" ? l.price < currentPrice : l.price > currentPrice
  );

  return direction === "صاعد"
    ? Math.max(...relevantLevels.map(l => l.price))
    : Math.min(...relevantLevels.map(l => l.price));
}

function calculateGannEntryPoint(currentPrice: number, direction: string, levels: GannLevels[]) {
  const mainLevel = levels.find(l => l.significance === "1x1");
  const entryPrice = mainLevel ? mainLevel.price : currentPrice;

  return {
    price: Number(entryPrice.toFixed(2)),
    reason: `نقطة دخول محسوبة على أساس خط غان الرئيسي ${mainLevel?.significance} عند زاوية ${mainLevel?.angle}°`
  };
}

function calculateGannTargets(currentPrice: number, direction: string, levels: GannLevels[]) {
  return levels
    .filter(l => direction === "صاعد" ? l.price > currentPrice : l.price < currentPrice)
    .slice(0, 3)
    .map((level, index) => ({
      price: Number(level.price.toFixed(2)),
      expectedTime: addDays(new Date(), (index + 1) * 7) // كل هدف يتوقع تحقيقه خلال أسبوع إضافي
    }));
}

function getGannPattern(currentPrice: number, levels: GannLevels[]): string {
  const mainLevel = levels.find(l => l.significance === "1x1" && l.angle === 45);
  if (!mainLevel) return "تقاطع مع خط غان الرئيسي";
  
  const priceDiff = currentPrice - mainLevel.price;
  if (Math.abs(priceDiff) < currentPrice * 0.01) {
    return "تقاطع مع خط غان 1x1";
  } else if (priceDiff > 0) {
    return "فوق خط غان 1x1";
  } else {
    return "تحت خط غان 1x1";
  }
}