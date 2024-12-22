import { toast } from "sonner";

// For development, we'll use a mock chart image until the backend is ready
const MOCK_CHART_IMAGES = {
  "1m": "/charts/1m-chart.png",
  "5m": "/charts/5m-chart.png",
  "15m": "/charts/15m-chart.png",
  "1h": "/charts/1h-chart.png",
  "4h": "/charts/4h-chart.png",
  "1d": "/charts/1d-chart.png",
  "1w": "/charts/1w-chart.png",
  "1M": "/charts/1M-chart.png",
};

export const getTradingViewChartImage = async (symbol: string, timeframe: string): Promise<string> => {
  console.log("محاولة جلب صورة الشارت:", { symbol, timeframe });
  
  try {
    // التحقق من صحة المدخلات
    if (!symbol || !timeframe) {
      throw new Error("يجب تحديد الرمز والإطار الزمني");
    }

    // في بيئة التطوير، نستخدم صورة تجريبية
    const mockChartUrl = MOCK_CHART_IMAGES[timeframe as keyof typeof MOCK_CHART_IMAGES] || MOCK_CHART_IMAGES["1d"];
    console.log("استخدام الصورة التجريبية:", mockChartUrl);
    
    // التحقق من وجود الصورة
    const response = await fetch(mockChartUrl);
    if (!response.ok) {
      console.error("خطأ في جلب الصورة:", response.status, response.statusText);
      throw new Error(`فشل في تحميل الصورة: ${response.statusText || 'خطأ غير معروف'}`);
    }

    const imageBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageBlob);
    
    console.log("تم جلب صورة الشارت بنجاح:", imageUrl);
    return imageUrl;
    
  } catch (error) {
    console.error("خطأ في جلب صورة الشارت:", error);
    toast.error("فشل في تحميل صورة الشارت");
    throw error;
  }
};