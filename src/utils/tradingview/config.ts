
/**
 * Trading View widget configuration
 */
export const getTradingViewConfig = () => {
  console.log(`تهيئة إعدادات TradingView للذهب`);
  
  return {
    autosize: true,
    symbol: "CFI:XAUUSD",
    interval: "1",
    timezone: "Asia/Jerusalem",
    theme: "dark",
    style: "1",
    locale: "ar",
    toolbar_bg: "#f1f3f6",
    hide_legend: false,
    enable_publishing: false,
    allow_symbol_change: false,
    save_image: true,
    calendar: false,
    hide_volume: false,
    hide_price_scale: true, // إضافة هذا الخيار لإخفاء عمود الأسعار في اليسار
    support_host: "https://www.tradingview.com",
    enabled_features: ["chart_property_page_trading"],
    disabled_features: [
      "header_symbol_search", 
      "header_compare", 
      "left_toolbar",
      "header_indicators",
      "use_localstorage_for_settings",
      "header_fullscreen_button",
      "volume_force_overlay",
      "show_left_price_scale" // إضافة هذه الخاصية لإخفاء مقياس الأسعار على اليسار
    ],
    charts_storage_url: "https://saveload.tradingview.com",
    charts_storage_api_version: "1.1",
    client_id: "tradingview.com",
    container_id: "tv_chart_container"
  };
};
