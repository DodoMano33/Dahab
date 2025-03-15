
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
  // الاحتفاظ بالمحددات القديمة كاحتياط
  '.pane-legend-line .pane-legend-item-value',
  '.chart-markup-table .price',
  '.chart-status-wrapper .chart-status-price',
  '#tv-chart-price-display',
  '.ts-price-display',
  '.price-value',
  // إضافة محددات إضافية شائعة في TradingView
  '.pane-legend-line span.pane-legend-item-value-wrap',
  '.price-axis__last-value',
  '.js-last-price',
  '.tv-symbol-price-quote__value',
  '.dl-last-quote'
];
