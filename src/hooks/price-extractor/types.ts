
import { PriceRecord } from '@/components/chart/price-extractor/types';

export interface PriceExtractionResult {
  price: number | null;
  lastUpdated: Date | null;
  source: string;
  isExtracting: boolean;
  priceHistory: PriceRecord[];
  clearHistory: () => void;
  extractPriceFromDOM: () => number | null;
  setCustomSelectors: (selectors: string[]) => void;
}

export interface PriceExtractorOptions {
  interval?: number;
  enabled?: boolean;
  maxHistorySize?: number;
  customSelectors?: string[];
  extractOnMount?: boolean;
  debugMode?: boolean;
}

// القيم المنطقية لسعر الذهب (XAUUSD) - قيم محدثة ومحسنة
export const MIN_VALID_GOLD_PRICE = 1500;  // أقل سعر منطقي للذهب حسب الأسعار الحالية (بالدولار)
export const MAX_VALID_GOLD_PRICE = 3000;  // أعلى سعر منطقي للذهب حسب الأسعار الحالية (بالدولار)

// محددات لاستخراج السعر من DOM
export const DEFAULT_PRICE_SELECTORS = [
  // محددات أساسية للسعر - أعلى أولوية
  '.tv-symbol-price-quote__value',
  '.js-symbol-last',
  '.chart-page-price',
  '.pane-legend-line__value',
  '.onchart-info-top-right',
  
  // تحديد أكثر تفصيلًا بناءً على الموقع في الشاشة
  'div[data-name="legend-source-item"] .js-symbol-last',
  'div[data-name="legend-series-item"] .js-symbol-last',
  
  // العناصر الخاصة بمنطقة السعر المحاطة بدائرة
  '.chart-status-wrapper .price',
  '.chart-info-price-text',
  '.chart-container .price-value',
  '.chart-container .big-price',
  
  // محددات العناصر التي تعرض أسعار حالية
  '.price-value', 
  '.price-display',
  '.current-price',
  '.chart-overlay-price',
  '.price-indicator',
  
  // محددات إضافية ذات أولوية منخفضة
  '.last-price',
  '.market-price',
  '.gold-price',
  '.xauusd-price',
  '.live-price',
  'div[data-field="last"]',
  'span[data-symbol="XAUUSD"]',
  'span[data-field="last"]'
];
