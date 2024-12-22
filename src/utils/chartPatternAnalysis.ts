export interface ChartPattern {
  name: string;
  description: string;
  type: 'bullish' | 'bearish' | 'neutral';
  reliability: number; // 1-10 scale
  confirmation: string[];
}

export const chartPatterns: ChartPattern[] = [
  {
    name: "Island Reversal",
    description: "نموذج انعكاسي يتميز بفجوة سعرية في كلا الاتجاهين",
    type: "bearish",
    reliability: 8,
    confirmation: ["فجوة سعرية", "حجم تداول مرتفع", "اختراق مستوى الدعم"]
  },
  {
    name: "Head and Shoulders",
    description: "نموذج انعكاسي هبوطي يتكون من ثلاث قمم، الوسطى أعلى من الجانبيتين",
    type: "bearish",
    reliability: 7,
    confirmation: ["اختراق خط العنق", "زيادة حجم التداول عند الاختراق"]
  },
  {
    name: "Inverse Head and Shoulders",
    description: "نموذج انعكاسي صعودي يتكون من ثلاث قيعان، الوسطى أدنى من الجانبيتين",
    type: "bullish",
    reliability: 7,
    confirmation: ["اختراق خط العنق", "زيادة حجم التداول عند الاختراق"]
  },
  {
    name: "Double Top",
    description: "نموذج انعكاسي هبوطي يتكون من قمتين متساويتين تقريباً",
    type: "bearish",
    reliability: 6,
    confirmation: ["كسر مستوى الدعم", "زيادة حجم التداول"]
  },
  {
    name: "Double Bottom",
    description: "نموذج انعكاسي صعودي يتكون من قاعين متساويين تقريباً",
    type: "bullish",
    reliability: 6,
    confirmation: ["اختراق مستوى المقاومة", "زيادة حجم التداول"]
  },
  {
    name: "Triangle",
    description: "نموذج استمراري يتكون من خطي اتجاه متقاربين",
    type: "neutral",
    reliability: 5,
    confirmation: ["اختراق أحد خطي الاتجاه", "زيادة حجم التداول"]
  },
  {
    name: "Flag",
    description: "نموذج استمراري يظهر كتصحيح مؤقت للاتجاه الرئيسي",
    type: "neutral",
    reliability: 6,
    confirmation: ["اكتمال النموذج", "عودة حجم التداول للمستويات العادية"]
  },
  {
    name: "Cup and Handle",
    description: "نموذج صعودي يشبه الفنجان مع مقبض جانبي",
    type: "bullish",
    reliability: 7,
    confirmation: ["اكتمال تشكل المقبض", "اختراق مستوى المقاومة"]
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
  // Remove any trailing colons from the URL
  const baseUrl = "https://www.tradingview.com/chart";
  const cleanSymbol = config.symbol.replace(/:/g, '');
  
  // Construct URL with proper parameters
  const url = new URL(baseUrl);
  url.searchParams.append('symbol', cleanSymbol.toUpperCase());
  url.searchParams.append('interval', config.timeframe);
  
  console.log("Generated TradingView URL:", url.toString());
  return url.toString();
};

// New utility functions for enhanced analysis
export const calculateMovingAverage = (prices: number[], period: number): number[] => {
  const ma: number[] = [];
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    ma.push(sum / period);
  }
  return ma;
};

export const calculateFibonacciLevels = (high: number, low: number): number[] => {
  const diff = high - low;
  return [
    high,
    high - diff * 0.236,
    high - diff * 0.382,
    high - diff * 0.5,
    high - diff * 0.618,
    high - diff * 0.786,
    low
  ];
};

export const calculateShortInterestRatio = (shortVolume: number, avgDailyVolume: number): number => {
  return shortVolume / avgDailyVolume;
};

export const predictPriceMovement = (
  currentPrice: number,
  ma20: number,
  ma50: number,
  shortInterestRatio: number,
  pattern: ChartPattern
): {
  direction: 'صعود' | 'هبوط' | 'محايد';
  confidence: number;
  reasons: string[];
} => {
  const reasons: string[] = [];
  let confidence = 0;
  
  // Moving Average Analysis
  if (currentPrice > ma50 && ma20 > ma50) {
    confidence += 2;
    reasons.push("السعر وMA20 فوق MA50");
  } else if (currentPrice < ma50 && ma20 < ma50) {
    confidence -= 2;
    reasons.push("السعر وMA20 تحت MA50");
  }

  // Short Interest Analysis
  if (shortInterestRatio > 0.2) {
    confidence -= 1;
    reasons.push("نسبة البيع على المكشوف مرتفعة");
  }

  // Pattern Analysis
  confidence += pattern.reliability * 0.5;
  reasons.push(`نموذج ${pattern.name} تم اكتشافه`);

  // Determine Direction
  let direction: 'صعود' | 'هبوط' | 'محايد' = 'محايد';
  if (confidence > 3) {
    direction = 'صعود';
  } else if (confidence < -3) {
    direction = 'هبوط';
  }

  return {
    direction,
    confidence: Math.abs(confidence),
    reasons
  };
};
