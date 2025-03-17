
/**
 * Trading View widget configuration
 */
export const getTradingViewConfig = (symbol: string = "XAUUSD", provider: string = "CFI") => {
  console.log(`تهيئة إعدادات TradingView لـ ${provider}:${symbol}`);
  
  return {
    autosize: true,
    symbol: `${provider}:${symbol}`,
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
    support_host: "https://www.tradingview.com",
    enabled_features: ["chart_property_page_trading"],
    disabled_features: [],
    charts_storage_url: "https://saveload.tradingview.com",
    charts_storage_api_version: "1.1",
    client_id: "tradingview.com",
    container_id: "tv_chart_container"
  };
};
