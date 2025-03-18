
import React from 'react';

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
    
    // تعيين التكوين مع تحديث لاستخدام سعر الذهب العالمي
    script.innerHTML = JSON.stringify({
      symbol: `FX_IDC:${symbol}`, // استخدام مصدر بيانات أكثر دقة للذهب
      width: "100%",
      colorTheme: theme,
      isTransparent: false,
      locale: "en"
    });
    
    // معالج لتحميل الويدجيت
    script.onload = () => {
      console.log("تم تحميل سكريبت TradingView بنجاح");
      setTimeout(() => {
        onLoad();
      }, 500);
    };
    
    // إضافة السكريبت إلى الحاوية
    widgetContainer.appendChild(script);
    
    return widgetDiv;
  };

  // إنشاء حاوية الويدجيت
  const createWidgetContainer = (): HTMLDivElement => {
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.width = '187.5px';
    widgetContainer.style.height = '95px';
    
    initializeWidget(widgetContainer);
    
    return widgetContainer;
  };

  // إرجاع كائن يحتوي على الدوال المطلوبة
  return { createWidgetContainer };
};
