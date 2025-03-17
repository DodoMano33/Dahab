
// تكوين التقاط السعر
export const CAPTURE_INTERVAL = 1000; // 1 ثانية

// محدد السعر الرئيسي بناءً على المعلومات المقدمة
export const PRICE_SELECTOR = '.tv-symbol-price-quote__value, .price-value, .chart-status-price';

// قائمة بمحددات CSS البديلة للعثور على عنصر السعر
export const ALTERNATIVE_SELECTORS = [
  // محددات السعر الرئيسية في TradingView
  '.tv-symbol-price-quote__value',
  '.tv-symbol-price-quote__value.js-symbol-last',
  '.tv-symbol-header__first-line .tv-symbol-price-quote__value',
  '[data-name="legend-series-item"] .price-value',
  '.chart-status-price',
  // عناصر العرض المختلفة للسعر
  '.chart-toolbar-price-value',
  '.price-axis__last-value',
  '.pane-legend-item-value-wrap',
  '.chart-container [data-name="legend-values-item"] [data-name="value"]',
  // عناصر أخرى قد تحتوي على السعر
  '[data-name="legend-series-item"] span:first-child',
  '[data-name="legend-values-item"] [data-name="value"]',
  '.chart-status-wrapper .price',
  '.pane-legend-line .pane-legend-item-value',
  '.js-last-price',
  '.js-symbol-last',
  // محدد إضافي خاص بنمط السعر الموجود في الصورة
  '.large-price-value',
  '.price-line-price-label'
];

// الصفات المرئية لمساعدة التعرف على عنصر السعر
export const PRICE_ELEMENT_ATTRIBUTES = {
  minWidth: 30, // الحد الأدنى للعرض بالبكسل
  minHeight: 15, // الحد الأدنى للارتفاع بالبكسل
  minFontSize: 10, // الحد الأدنى لحجم الخط بالبكسل
  regexPattern: /\b[1-3][\d,]{3,6}\.\d{1,3}\b/ // نمط أكثر مرونة للسعر مطابق للصورة
};
