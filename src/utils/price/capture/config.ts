
// تكوين التقاط السعر
export const CAPTURE_INTERVAL = 1000; // 1 ثانية

// محدد السعر الرئيسي الجديد بناءً على المعلومات المقدمة
export const PRICE_SELECTOR = '.last-price';

// قائمة بمحددات CSS البديلة للعثور على عنصر السعر
export const ALTERNATIVE_SELECTORS = [
  // إضافة المعرف المقدم
  '#price-12345',
  // إضافة المسار الهيكلي
  'div.chart-container > div.price-section > span.last-price',
  // إضافة محددات من TradingView
  '.chart-page .chart-container span.last-price',
  '.tv-chart-container .last-price',
  '.js-rootresizer__contents .last-price',
  // محددات دقيقة للمحتويات الديناميكية
  '[data-name="legend-series-item"] span:first-child',
  '[data-name="legend-source-item"] span:first-child',
  '[data-name="legend-values-item"] [data-name="value"]',
  '.chart-markup-table .price',
  // محددات التحديثات الأخيرة
  '.chart-status-wrapper .price',
  '.chart-toolbar-label .last-price',
  '.chart-status-wrapper .chart-status-price',
  '.header-chart-panel .chart-price',
  '.chart-status-price',
  // الاحتفاظ بالمحددات القديمة كاحتياط
  '.pane-legend-line .pane-legend-item-value',
  '.chart-status-wrapper .chart-status-price',
  '#tv-chart-price-display',
  '.ts-price-display',
  '.price-value',
  '.pane-legend-line span.pane-legend-item-value-wrap',
  '.price-axis__last-value',
  '.js-last-price',
  '.tv-symbol-price-quote__value',
  '.dl-last-quote'
];

// الصفات المرئية لمساعدة التعرف على عنصر السعر
export const PRICE_ELEMENT_ATTRIBUTES = {
  minWidth: 40, // الحد الأدنى للعرض بالبكسل
  minHeight: 15, // الحد الأدنى للارتفاع بالبكسل
  minFontSize: 10, // الحد الأدنى لحجم الخط بالبكسل
  regexPattern: /^\s*\d{1,6}(\.\d{1,4})?\s*$/ // نمط التعبير العادي للسعر
};
