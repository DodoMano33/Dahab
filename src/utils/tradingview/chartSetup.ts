
/**
 * Helper functions for setting up the TradingView chart
 */
import { getTradingViewConfig } from "./config";

export const createTradingViewWidget = (container: HTMLElement, symbol: string = "XAUUSD", provider: string = "CFI") => {
  const script = document.createElement('script');
  script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
  script.type = 'text/javascript';
  script.async = true;

  const config = getTradingViewConfig(symbol, provider);
  script.innerHTML = JSON.stringify(config);

  const widgetContainer = document.createElement('div');
  widgetContainer.className = 'tradingview-widget-container';
  widgetContainer.style.height = '100%';
  widgetContainer.style.width = '100%';

  const widgetDiv = document.createElement('div');
  widgetDiv.className = 'tradingview-widget-container__widget';
  widgetDiv.style.height = 'calc(100% - 32px)';
  widgetDiv.style.width = '100%';
  widgetDiv.id = 'tv_chart_container'; // إضافة معرف للعثور عليه لاحقًا
  // إضافة سمة data للمصدر
  widgetDiv.setAttribute('data-provider', provider);

  const copyright = document.createElement('div');
  copyright.className = 'tradingview-widget-copyright';
  copyright.innerHTML = '<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a>';

  widgetContainer.appendChild(widgetDiv);
  widgetContainer.appendChild(copyright);
  widgetContainer.appendChild(script);

  container.innerHTML = '';
  container.appendChild(widgetContainer);
  
  return { widgetContainer, widgetDiv };
};
