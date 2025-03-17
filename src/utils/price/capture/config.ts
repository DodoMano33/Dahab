
// تكوين التقاط السعر
export const CAPTURE_INTERVAL = 1000; // 1 ثانية

// محدد السعر الرئيسي بناءً على المعلومات المقدمة
export const PRICE_SELECTOR = '.tv-symbol-price-quote__value.js-symbol-last';

// قائمة بمحددات CSS البديلة للعثور على عنصر السعر
export const ALTERNATIVE_SELECTORS = [
  // محدد السعر الرئيسي في TradingView
  '.tv-symbol-price-quote__value',
  '.tv-symbol-price-quote__value.js-symbol-last',
  '.tv-symbol-header__first-line .tv-symbol-price-quote__value',
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
  '.js-symbol-last'
];

// الصفات المرئية لمساعدة التعرف على عنصر السعر
export const PRICE_ELEMENT_ATTRIBUTES = {
  minWidth: 30, // الحد الأدنى للعرض بالبكسل
  minHeight: 15, // الحد الأدنى للارتفاع بالبكسل
  minFontSize: 10, // الحد الأدنى لحجم الخط بالبكسل
  regexPattern: /^[\s$£€¥]*\d{1,5}([.,]\d{1,4})?[\s]*$/ // نمط أكثر مرونة للسعر
};
