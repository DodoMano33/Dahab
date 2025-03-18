
interface TradingViewWidgetConfigProps {
  symbol?: string;
  theme?: string;
  onLoad: () => void;
}

export const TradingViewWidgetConfig = ({
  symbol = 'XAUUSD',
  theme = 'light',
  onLoad
}: TradingViewWidgetConfigProps) => {
  // تهيئة الويدجيت وإعداده
  const initializeWidget = (widgetContainer: HTMLDivElement) => {
    // إنشاء div الويدجيت إذا لم يكن موجوداً
    let widgetDiv = widgetContainer.querySelector('.tradingview-widget-container__widget');
    if (!widgetDiv) {
      widgetDiv = document.createElement('div');
      widgetDiv.className = 'tradingview-widget-container__widget';
      (widgetDiv as HTMLElement).style.width = '100%';
      (widgetDiv as HTMLElement).style.height = '100%';
      widgetContainer.appendChild(widgetDiv);
    } else {
      // تنظيف المحتوى الحالي إذا كان موجوداً
      widgetDiv.innerHTML = '';
    }
    
    // إنشاء سكريبت الويدجيت
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js';
    
    // تعيين التكوين بالضبط كما تم طلبه
    script.innerHTML = JSON.stringify({
      symbol: `CFI:${symbol}`,
      width: "100%",
      colorTheme: theme,
      isTransparent: false,
      locale: "en"
    });
    
    // معالج لتحميل الويدجيت - تأكد من استدعاءه مرة واحدة فقط
    let isLoaded = false;
    script.onload = () => {
      if (!isLoaded) {
        console.log("تم تحميل سكريبت TradingView بنجاح");
        isLoaded = true;
        setTimeout(() => {
          onLoad();
        }, 1000); // تأخير صغير لضمان تحميل الواجهة
      }
    };
    
    // إضافة السكريبت إلى الويدجيت فقط إذا لم يكن مضافًا بالفعل
    if (!widgetDiv.querySelector('script')) {
      widgetDiv.appendChild(script);
    }
  };

  // إنشاء حاوية الويدجيت
  const createWidgetContainer = (): HTMLDivElement => {
    // التحقق مما إذا كانت الحاوية موجودة بالفعل
    let existingContainer = document.querySelector('.tradingview-widget-container') as HTMLDivElement;
    
    if (existingContainer) {
      // إذا كانت موجودة، نعيد استخدامها
      initializeWidget(existingContainer);
      return existingContainer;
    }
    
    // إنشاء حاوية جديدة إذا لم تكن موجودة
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.width = '187.5px';
    widgetContainer.style.height = '95px';
    widgetContainer.style.overflow = 'hidden';
    
    initializeWidget(widgetContainer);
    
    return widgetContainer;
  };

  return { createWidgetContainer };
};
