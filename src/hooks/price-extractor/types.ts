
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

// القيم المنطقية لسعر الذهب (XAUUSD)
export const MIN_VALID_GOLD_PRICE = 500;   // أقل سعر منطقي للذهب (بالدولار)
export const MAX_VALID_GOLD_PRICE = 5000;  // أعلى سعر منطقي للذهب (بالدولار)

// محددات لاستخراج السعر من DOM
export const DEFAULT_PRICE_SELECTORS = [
  // سعر كبير في الزاوية اليمنى
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
  // محددات إضافية للعناصر التي قد تحتوي على السعر
  '.price-value', 
  '.price-display',
  '.current-price',
  '.chart-overlay-price',
  '.price-indicator'
];
