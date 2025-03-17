
/**
 * Helper functions for setting up the TradingView chart
 */
import { getTradingViewConfig } from "./config";

export const createTradingViewWidget = (container: HTMLElement) => {
  console.log(`إنشاء شارت TradingView للذهب`);
  
  // تنظيف الحاوية من أي محتوى سابق
  container.innerHTML = '';
  
  // إنشاء سكريبت لتحميل شارت TradingView
  const script = document.createElement('script');
  script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
  script.type = 'text/javascript';
  script.async = true;

  // الحصول على إعدادات الشارت
  const config = getTradingViewConfig();
  script.innerHTML = JSON.stringify(config);

  // إنشاء حاويات الشارت
  const widgetContainer = document.createElement('div');
  widgetContainer.className = 'tradingview-widget-container';
  widgetContainer.style.height = '100%';
  widgetContainer.style.width = '100%';

  const widgetDiv = document.createElement('div');
  widgetDiv.className = 'tradingview-widget-container__widget';
  widgetDiv.style.height = 'calc(100% - 32px)';
  widgetDiv.style.width = '100%';
  widgetDiv.id = 'tv_chart_container'; // معرف للعثور عليه لاحقًا

  const copyright = document.createElement('div');
  copyright.className = 'tradingview-widget-copyright';
  copyright.style.height = '32px';
  copyright.innerHTML = '';

  // إضافة العناصر للحاوية
  widgetContainer.appendChild(widgetDiv);
  widgetContainer.appendChild(copyright);
  widgetContainer.appendChild(script);

  // إضافة الحاوية للعنصر الأصلي
  container.appendChild(widgetContainer);
  
  console.log('تم إنشاء حاوية الشارت بنجاح');
  
  return { widgetContainer, widgetDiv };
};
