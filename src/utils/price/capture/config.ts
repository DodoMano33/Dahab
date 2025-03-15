
// تكوين التقاط السعر
export const CAPTURE_INTERVAL = 1000; // 1 ثانية
export const PRICE_SELECTOR = '#tv_chart_container .pane-legend-line span.pane-legend-item-value-wrap';

// قائمة بمحددات CSS البديلة للعثور على عنصر السعر
export const ALTERNATIVE_SELECTORS = [
  '.pane-legend-line .pane-legend-item-value',
  '.chart-markup-table .price',
  '.chart-status-wrapper .chart-status-price',
  '#tv-chart-price-display',
  '.ts-price-display',
  '.price-value'
];
