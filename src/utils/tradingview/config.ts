
/**
 * Trading View widget configuration
 */
export const getTradingViewConfig = (symbol: string = "XAUUSD", provider: string = "CFI") => {
  return {
    autosize: true,
    symbol: `${provider}:${symbol}`, // تحديد مزود CFI بوضوح
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
    custom_css_url: ""
  };
};
