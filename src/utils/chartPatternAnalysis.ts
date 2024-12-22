export interface ChartPattern {
  name: string;
  description: string;
  type: 'bullish' | 'bearish' | 'neutral';
}

export const chartPatterns: ChartPattern[] = [
  {
    name: "Head and Shoulders",
    description: "نموذج انعكاسي هبوطي يتكون من ثلاث قمم، الوسطى أعلى من الجانبيتين",
    type: "bearish"
  },
  {
    name: "Inverse Head and Shoulders",
    description: "نموذج انعكاسي صعودي يتكون من ثلاث قيعان، الوسطى أدنى من الجانبيتين",
    type: "bullish"
  },
  {
    name: "Double Top",
    description: "نموذج انعكاسي هبوطي يتكون من قمتين متساويتين تقريباً",
    type: "bearish"
  },
  {
    name: "Double Bottom",
    description: "نموذج انعكاسي صعودي يتكون من قاعين متساويين تقريباً",
    type: "bullish"
  },
  {
    name: "Triangle",
    description: "نموذج استمراري يتكون من خطي اتجاه متقاربين",
    type: "neutral"
  },
  {
    name: "Flag",
    description: "نموذج استمراري يظهر كتصحيح مؤقت للاتجاه الرئيسي",
    type: "neutral"
  },
  {
    name: "Cup and Handle",
    description: "نموذج صعودي يشبه الفنجان مع مقبض جانبي",
    type: "bullish"
  }
];

export const timeframes = [
  { value: "1m", label: "دقيقة" },
  { value: "5m", label: "5 دقائق" },
  { value: "15m", label: "15 دقيقة" },
  { value: "30m", label: "30 دقيقة" },
  { value: "1h", label: "ساعة" },
  { value: "4h", label: "4 ساعات" },
  { value: "1d", label: "يومي" },
  { value: "1w", label: "أسبوعي" },
];

export interface TradingViewConfig {
  symbol: string;
  timeframe: string;
}

export const getTradingViewUrl = (config: TradingViewConfig): string => {
  const baseUrl = "https://www.tradingview.com/chart/";
  const params = new URLSearchParams({
    symbol: config.symbol,
    interval: config.timeframe
  });
  return `${baseUrl}?${params.toString()}`;
};