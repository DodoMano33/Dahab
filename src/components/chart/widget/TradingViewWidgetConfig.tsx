
interface TradingViewWidgetConfigProps {
  symbol?: string;
  theme?: string;
  onLoad: () => void;
}

// تصدير وظيفة عادية وليس كمكون React
export const TradingViewWidgetConfig = (props: TradingViewWidgetConfigProps) => {
  const { symbol = 'XAUUSD', theme = 'light', onLoad } = props;
  
  // تهيئة الويدجيت وإعداده
  const initializeWidget = (widgetContainer: HTMLDivElement) => {
    // إنشاء div الويدجيت
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.width = '100%';
    widgetDiv.style.height = '100%';
    widgetContainer.appendChild(widgetDiv);

    // إنشاء سكريبت الويدجيت
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js';
    
    // تحسين التكوين لضمان ظهور الويدجيت
    const widgetConfig = {
      "symbol": `FX_IDC:${symbol}`,
      "width": "100%",
      "height": "100%",
      "colorTheme": theme,
      "isTransparent": false,
      "locale": "ar"
    };
    
    // تعيين محتوى السكريبت بتكوين الويدجيت
    script.innerHTML = JSON.stringify(widgetConfig);
    
    // معالج لتحميل الويدجيت
    script.onload = () => {
      console.log("تم تحميل سكريبت TradingView بنجاح");
      setTimeout(() => {
        onLoad();
      }, 1000);
    };
    
    // إضافة السكريبت إلى الحاوية
    widgetContainer.appendChild(script);
    
    return widgetDiv;
  };

  // إنشاء حاوية الويدجيت
  const createWidgetContainer = (): HTMLDivElement => {
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.width = '100%';
    widgetContainer.style.height = '100%';
    
    initializeWidget(widgetContainer);
    
    return widgetContainer;
  };

  // إرجاع كائن يحتوي على الدوال المطلوبة
  return { createWidgetContainer };
};
