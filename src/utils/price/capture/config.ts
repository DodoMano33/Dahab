
// تكوين التقاط السعر
export const CAPTURE_INTERVAL = 1000; // 1 ثانية

// محدد السعر الرئيسي الجديد بناءً على المعلومات المقدمة
export const PRICE_SELECTOR = '.last-price';

// قائمة بمحددات CSS البديلة للعثور على عنصر السعر
export const ALTERNATIVE_SELECTORS = [
  // استخدام المعرف المقدم مباشرة
  '#price-12345',
  // المسار الهيكلي الدقيق
  'div.chart-container > div.price-section > span.last-price',
  // محددات TradingView المحددة
  '.price-axis__last-value',
  '.pane-legend-item-value-wrap',
  '.chart-container [data-name="legend-values-item"] [data-name="value"]',
  // أمثلة أكثر دقة للمواقع المحتملة للسعر في TradingView
  '.tv-chart-view__header-symbol-price',
  '.tv-market-status__ticker-price',
  '.tv-symbol-price-quote__value',
  '.chart-status-price',
  '.tv-symbol-header__first-line .tv-symbol-price-quote__value',
  // الاحتفاظ بالمحددات القديمة
  '[data-name="legend-series-item"] span:first-child',
  '[data-name="legend-source-item"] span:first-child',
  '[data-name="legend-values-item"] [data-name="value"]',
  '.chart-markup-table .price',
  '.chart-status-wrapper .price',
  '.chart-toolbar-label .last-price',
  '.chart-status-wrapper .chart-status-price',
  '.header-chart-panel .chart-price',
  '.pane-legend-line .pane-legend-item-value',
  '.chart-status-wrapper .chart-status-price',
  '#tv-chart-price-display',
  '.ts-price-display',
  '.price-value',
  '.pane-legend-line span.pane-legend-item-value-wrap',
  '.js-last-price',
  '.dl-last-quote'
];

// الصفات المرئية لمساعدة التعرف على عنصر السعر
export const PRICE_ELEMENT_ATTRIBUTES = {
  minWidth: 30, // الحد الأدنى للعرض بالبكسل
  minHeight: 15, // الحد الأدنى للارتفاع بالبكسل
  minFontSize: 10, // الحد الأدنى لحجم الخط بالبكسل
  regexPattern: /^[\s$£€¥]*\d{1,5}([.,]\d{1,4})?[\s]*$/ // نمط أكثر مرونة للسعر
};
