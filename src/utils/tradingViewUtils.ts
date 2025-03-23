
export const getTradingViewChartImage = async (
  symbol: string,
  timeframe: string,
  currentPrice: number
): Promise<string> => {
  try {
    console.log("Generating TradingView chart for:", { symbol, timeframe, currentPrice });
    
    // محاولة التقاط الشارت من العنصر الموجود في الصفحة
    const chartElement = document.getElementById('tradingview_chart');
    
    if (chartElement) {
      try {
        // استخدام html2canvas لالتقاط الشارت (سيتم تحميله ديناميكيًا)
        const html2canvas = (window as any).html2canvas || 
          await import('html2canvas').then(module => {
            (window as any).html2canvas = module.default;
            return module.default;
          });
        
        console.log("Capturing chart from DOM element");
        const canvas = await html2canvas(chartElement);
        const dataUrl = canvas.toDataURL('image/png');
        console.log("Chart captured successfully");
        return dataUrl;
      } catch (e) {
        console.error("Failed to capture chart:", e);
        // استخدام الطريقة الاحتياطية في حالة الفشل
      }
    }
    
    // إذا فشل التقاط الشارت، استخدم شارت بديل
    console.log("Using fallback chart generation");
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" font-family="Arial" font-size="20" text-anchor="middle">
          Chart Preview for ${symbol} - ${timeframe} - Price: ${currentPrice}
        </text>
      </svg>
    `)}`;
  } catch (error) {
    console.error("Error generating TradingView chart:", error);
    throw new Error("فشل في إنشاء صورة الشارت");
  }
};
