
/**
 * TradingView advanced chart configuration
 */
export interface TradingViewConfig {
  autosize: boolean;
  symbol: string;
  interval: string;
  timezone: string;
  theme: string;
  style: string;
  locale: string;
  hide_legend: boolean;
  allow_symbol_change: boolean;
  save_image: boolean;
  calendar: boolean;
  hide_volume: boolean;
  support_host: string;
  enabled_features: string[];
  charts_storage_url: string;
  charts_storage_api_version: string;
  client_id: string;
  custom_css_url: string;
  hide_top_toolbar: boolean;
  hide_side_toolbar: boolean;
  toolbar_bg: string;
}

/**
 * Create TradingView config based on device type
 */
export const createTradingViewConfig = (
  symbol: string = "XAUUSD",
  isMobile: boolean = false
): TradingViewConfig => {
  return {
    autosize: true,
    symbol: symbol,
    interval: "1",
    timezone: "Asia/Jerusalem",
    theme: "dark",
    style: "1",
    locale: "en",
    hide_legend: true,
    allow_symbol_change: false, // تعطيل تغيير الرمز
    save_image: false,
    calendar: false,
    hide_volume: true,
    support_host: "https://www.tradingview.com",
    enabled_features: ["chart_property_page_trading"],
    charts_storage_url: "https://saveload.tradingview.com",
    charts_storage_api_version: "1.1",
    client_id: "tradingview.com",
    custom_css_url: "",
    hide_top_toolbar: isMobile, // إخفاء شريط الأدوات العلوي في وضع الموبايل
    hide_side_toolbar: isMobile, // إخفاء شريط الأدوات الجانبي في وضع الموبايل
    toolbar_bg: "#000000", // خلفية داكنة للشريط
  };
};

/**
 * Custom script to inject into TradingView iframe for price extraction
 */
export const createPriceExtractionScript = (): string => {
  return `
    // مستمع لطلبات السعر الحالي من التطبيق الرئيسي
    window.addEventListener('message', function(event) {
      if (event.data && event.data.command === 'get-current-price') {
        try {
          // محاولة الوصول إلى كائن TradingView
          if (window.TradingView && window.TradingView.activeChart) {
            const price = window.TradingView.activeChart().crosshairPrice();
            // إرسال السعر للتطبيق الرئيسي
            window.parent.postMessage({
              type: 'current-price-response',
              price: price
            }, '*');
          } else {
            console.log('TradingView chart not accessible yet');
          }
        } catch(e) {
          console.error('Error getting TradingView price:', e);
        }
      }
    });
    
    // محاولة إعداد مراقب للسعر
    try {
      setInterval(function() {
        if (window.TradingView && window.TradingView.activeChart) {
          const price = window.TradingView.activeChart().crosshairPrice();
          if (price) {
            window.parent.postMessage({
              type: 'current-price-response',
              price: price
            }, '*');
          }
        }
      }, 500);
    } catch(e) {
      console.error('Error setting up price monitor:', e);
    }
  `;
};
