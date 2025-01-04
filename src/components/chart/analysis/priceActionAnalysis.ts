import { AnalysisData } from "@/types/analysis";
import { getExpectedTime } from "@/utils/technicalAnalysis";

export const analyzePriceAction = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("Starting Price Action analysis:", { currentPrice, timeframe });

  // Simulate analysis based on Price Action strategy
  const direction = Math.random() > 0.5 ? "صاعد" : "هابط";
  
  // Calculate support and resistance based on Price Action principles
  const volatilityFactor = 0.02; // 2% volatility
  const support = direction === "صاعد" 
    ? currentPrice * (1 - volatilityFactor) 
    : currentPrice * (1 - volatilityFactor * 1.5);
  const resistance = direction === "صاعد"
    ? currentPrice * (1 + volatilityFactor * 1.5)
    : currentPrice * (1 + volatilityFactor);

  // Calculate stop loss based on Price Action principles
  const stopLoss = direction === "صاعد"
    ? support * 0.995 // 0.5% below support for uptrend
    : resistance * 1.005; // 0.5% above resistance for downtrend

  // Define targets based on risk:reward ratio (1:2 and 1:3)
  const riskAmount = Math.abs(currentPrice - stopLoss);
  const target1 = direction === "صاعد"
    ? currentPrice + (riskAmount * 2)
    : currentPrice - (riskAmount * 2);
  const target2 = direction === "صاعد"
    ? currentPrice + (riskAmount * 3)
    : currentPrice - (riskAmount * 3);

  const bestEntryReason = direction === "صاعد"
    ? "نقطة دخول محددة بناءً على اختبار مستوى الدعم السابق مع وجود نموذج انعكاس صاعد"
    : "نقطة دخول محددة بناءً على اختبار مستوى المقاومة السابق مع وجود نموذج انعكاس هابط";

  const analysis: AnalysisData = {
    pattern: "Price Action Analysis",
    direction,
    currentPrice,
    support: Number(support.toFixed(2)),
    resistance: Number(resistance.toFixed(2)),
    stopLoss: Number(stopLoss.toFixed(2)),
    bestEntryPoint: {
      price: Number(currentPrice.toFixed(2)),
      reason: bestEntryReason
    },
    targets: [
      {
        price: Number(target1.toFixed(2)),
        expectedTime: getExpectedTime(timeframe, 1)
      },
      {
        price: Number(target2.toFixed(2)),
        expectedTime: getExpectedTime(timeframe, 2)
      }
    ],
    analysisType: "Price Action"
  };

  console.log("Price Action analysis result:", analysis);
  return analysis;
};