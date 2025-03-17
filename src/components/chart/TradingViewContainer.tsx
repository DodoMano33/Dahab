
import React, { useEffect, useRef } from 'react';
import { createTradingViewWidget } from '@/utils/tradingview/chartSetup';
import { extractPriceFromChart } from '@/utils/price/capture/priceExtractor';

interface TradingViewContainerProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
}

export const TradingViewContainer: React.FC<TradingViewContainerProps> = ({
  symbol = "XAUUSD",
  onSymbolChange,
  onPriceUpdate
}) => {
  // استخدام رمز ثابت مع مزود السعر المحدد
  const forcedSymbol = "XAUUSD"; 
  const priceProvider = "CFI";
  const containerRef = useRef<HTMLDivElement>(null);
  const currentPriceRef = useRef<number | null>(null);
  
  // دالة مساعدة لتحديث السعر من العنصر المخصص
  const updatePriceFromCustomElement = () => {
    const tradingViewPriceElement = document.querySelector('.tv-symbol-price-quote__value.js-symbol-last');
    if (tradingViewPriceElement) {
      const priceText = tradingViewPriceElement.textContent?.trim();
      if (priceText) {
        const extractedPrice = parseFloat(priceText.replace(/[^\d.]/g, ''));
        if (!isNaN(extractedPrice) && extractedPrice >= 1800 && extractedPrice <= 3500) {
          console.log(`تم العثور على سعر في عنصر TradingView المخصص: ${extractedPrice}`);
          currentPriceRef.current = extractedPrice;
          onPriceUpdate?.(extractedPrice);
          return true;
        }
      }
    }
    return false;
  };
  
  // تهيئة الشارت عند تحميل المكون
  useEffect(() => {
    if (!containerRef.current) return;
    
    console.log('إنشاء شارت TradingView للرمز:', forcedSymbol, 'مع المزود:', priceProvider);
    
    // إنشاء شارت TradingView داخل الحاوية
    const { widgetDiv } = createTradingViewWidget(containerRef.current, forcedSymbol, priceProvider);
    
    // تأخير قصير لضمان تحميل الشارت ثم محاولة استخراج السعر
    const initialTimeout = setTimeout(() => {
      console.log('محاولة استخراج السعر المبدئي بعد تحميل الشارت...');
      extractInitialPrice();
    }, 3000);
    
    // استخراج السعر الأولي
    const extractInitialPrice = async () => {
      // محاولة الحصول على السعر من العنصر المخصص أولاً
      if (updatePriceFromCustomElement()) {
        return;
      }
      
      // إذا لم ينجح، استخدم الطريقة العامة
      const price = await extractPriceFromChart();
      if (price !== null) {
        console.log('تم استخراج السعر المبدئي:', price);
        currentPriceRef.current = price;
        onPriceUpdate?.(price);
      } else {
        console.log('فشل في استخراج السعر المبدئي، سيتم المحاولة مرة أخرى...');
      }
    };
    
    // تحديث السعر دوريًا من العنصر المخصص
    const customElementInterval = setInterval(() => {
      updatePriceFromCustomElement();
    }, 1000);
    
    // جدولة استخراج متكرر للسعر بالطريقة العامة كاحتياطي
    const extractionInterval = setInterval(async () => {
      // إذا لم يتم تحديث السعر من العنصر المخصص، استخدم الطريقة العامة
      const price = await extractPriceFromChart();
      if (price !== null && price !== currentPriceRef.current) {
        console.log('تم استخراج سعر جديد:', price);
        currentPriceRef.current = price;
        onPriceUpdate?.(price);
      }
    }, 3000);
    
    // التنظيف عند إلغاء تحميل المكون
    return () => {
      clearInterval(customElementInterval);
      clearInterval(extractionInterval);
      clearTimeout(initialTimeout);
      
      // تنظيف الحاوية
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [forcedSymbol, priceProvider, onPriceUpdate]);

  return (
    <div 
      ref={containerRef}
      style={{ height: "100%", width: "100%" }}
      data-provider={priceProvider}
      className="tradingview-chart-container"
    />
  );
};
