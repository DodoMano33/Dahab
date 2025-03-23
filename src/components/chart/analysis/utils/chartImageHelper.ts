
import { toast } from "sonner";
import { getTradingViewChartImage } from "@/utils/tradingViewUtils";

export const getChartImage = async (
  existingImage: string | null,
  symbol: string,
  timeframe: string,
  price: number
): Promise<string> => {
  // If we already have an image, use it
  if (existingImage) return existingImage;
  
  try {
    // Try to get a chart image from TradingView
    const chartImage = await getTradingViewChartImage(symbol, timeframe, price);
    console.log("Generated chart image automatically");
    return chartImage;
  } catch (error) {
    console.error("Failed to generate chart image:", error);
    toast.warning("جاري التحليل بدون صورة الشارت. قد تكون النتائج أقل دقة.");
    
    // Create a fallback chart image
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f5f5f5"/>
        <text x="50%" y="50%" font-family="Arial" font-size="20" text-anchor="middle" fill="#666">
          تحليل ${symbol} على الإطار الزمني ${timeframe}
        </text>
      </svg>
    `)}`;
  }
};
