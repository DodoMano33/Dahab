
import { useState, useEffect } from 'react';
import { MarketData } from '@/hooks/current-price/types';
import { getLastExtractedPrice } from '@/utils/price/capture/state';

export const useCurrentPrice = () => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(() => {
    // استخدام آخر سعر محفوظ كقيمة مبدئية إن وجد
    return getLastExtractedPrice();
  });
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);
  const [marketData, setMarketData] = useState<MarketData | undefined>(undefined);

  useEffect(() => {
    // الاستماع لأحداث تحديث السعر من TradingView
    const handlePriceUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ price: number }>;
      if (customEvent.detail?.price) {
        const newPrice = customEvent.detail.price;
        console.log('useCurrentPrice: تم استلام تحديث سعر:', newPrice);
        
        // فقط قم بتحديث السعر إذا كان مختلفًا عن القيمة الحالية
        if (currentPrice !== newPrice) {
          setCurrentPrice(newPrice);
          setPriceUpdateCount(prev => prev + 1);
          
          // تحديث بيانات السوق
          setMarketData({
            symbol: "XAUUSD",
            dayLow: Math.round(newPrice * 0.997),
            dayHigh: Math.round(newPrice * 1.003),
            weekLow: Math.round(newPrice * 0.95),
            weekHigh: Math.round(newPrice * 1.05),
            change: -3.785,
            changePercent: -0.13,
            recommendation: "Strong buy"
          });
          
          // تحديث عناصر السعر في واجهة المستخدم
          updateUIElements(newPrice);
        }
      }
    };
    
    // تحديث عناصر واجهة المستخدم بالسعر الجديد
    const updateUIElements = (price: number) => {
      // تحديث عنصر عرض السعر مباشرة إن وجد
      const priceDisplayElements = document.querySelectorAll(
        '#stats-price-display, #tradingview-price-display, .price-display'
      );
      
      priceDisplayElements.forEach(element => {
        if (element.tagName === 'INPUT') {
          (element as HTMLInputElement).value = price.toFixed(2);
        } else {
          element.textContent = price.toFixed(2);
        }
      });
    };
    
    // الاستماع لأحداث استجابة السعر الحالي
    const handleCurrentPriceResponse = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.price) {
        const newPrice = customEvent.detail.price;
        console.log('useCurrentPrice: تم استلام استجابة سعر:', newPrice);
        
        // فقط قم بتحديث السعر إذا كان مختلفًا عن القيمة الحالية
        if (currentPrice !== newPrice) {
          setCurrentPrice(newPrice);
          setPriceUpdateCount(prev => prev + 1);
          
          // تحديث بيانات السوق الكاملة إذا كانت متوفرة
          setMarketData({
            symbol: customEvent.detail.symbol,
            dayLow: customEvent.detail.dayLow,
            dayHigh: customEvent.detail.dayHigh,
            weekLow: customEvent.detail.weekLow,
            weekHigh: customEvent.detail.weekHigh,
            change: customEvent.detail.change,
            changePercent: customEvent.detail.changePercent,
            recommendation: customEvent.detail.recommendation
          });
          
          // تحديث عناصر السعر في واجهة المستخدم
          updateUIElements(newPrice);
        }
      }
    };
    
    // الاستماع لحدث السعر الجديد للتوافق مع المكونات الأخرى
    const handleNewPriceUpdated = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.price) {
        const newPrice = customEvent.detail.price;
        console.log('useCurrentPrice: تم استلام price-updated:', newPrice);
        
        // فقط قم بتحديث السعر إذا كان مختلفًا عن القيمة الحالية
        if (currentPrice !== newPrice) {
          setCurrentPrice(newPrice);
          setPriceUpdateCount(prev => prev + 1);
          
          // تحديث عناصر السعر في واجهة المستخدم
          updateUIElements(newPrice);
        }
      }
    };
    
    // البحث المباشر عن السعر في الصفحة
    const findPriceDirectly = () => {
      // البحث عن عناصر TradingView التي تحتوي على السعر
      const priceSelectors = [
        '.tv-symbol-price-quote__value',
        '.tv-symbol-header__first-line',
        '.js-symbol-last'
      ];
      
      for (const selector of priceSelectors) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
          const text = element.textContent?.trim();
          if (text && /\d+,\d+\.\d+|\d+\.\d+/.test(text)) {
            const matches = text.match(/\b\d+,\d+\.\d+\b|\b\d+\.\d+\b/);
            if (matches && matches[0]) {
              const price = parseFloat(matches[0].replace(/,/g, ''));
              if (!isNaN(price) && price > 0) {
                console.log(`useCurrentPrice: تم العثور على سعر مباشرة = ${price}`);
                
                // فقط قم بتحديث السعر إذا كان مختلفًا عن القيمة الحالية
                if (currentPrice !== price) {
                  setCurrentPrice(price);
                  setPriceUpdateCount(prev => prev + 1);
                  
                  // تحديث عناصر السعر في واجهة المستخدم
                  updateUIElements(price);
                  
                  // بث السعر المكتشف لباقي التطبيق
                  window.dispatchEvent(new CustomEvent('tradingview-price-update', {
                    detail: { price, symbol: 'CFI:XAUUSD', timestamp: Date.now() }
                  }));
                }
                
                return price;
              }
            }
          }
        }
      }
      
      return null;
    };
    
    // طلب تحديث السعر عند التهيئة
    window.dispatchEvent(new Event('request-current-price'));
    
    // البحث المباشر عن السعر
    findPriceDirectly();
    
    // تسجيل المستمعين
    window.addEventListener('tradingview-price-update', handlePriceUpdate);
    window.addEventListener('current-price-response', handleCurrentPriceResponse);
    window.addEventListener('price-updated', handleNewPriceUpdated);
    
    // البحث الدوري عن السعر (كل ثانية)
    const directPriceInterval = setInterval(findPriceDirectly, 1000);
    
    // طلب تحديث السعر الدوري (كل 5 ثوان)
    const requestInterval = setInterval(() => {
      window.dispatchEvent(new Event('request-current-price'));
    }, 5000);
    
    // تنظيف المستمعين عند إزالة المكوّن
    return () => {
      window.removeEventListener('tradingview-price-update', handlePriceUpdate);
      window.removeEventListener('current-price-response', handleCurrentPriceResponse);
      window.removeEventListener('price-updated', handleNewPriceUpdated);
      clearInterval(directPriceInterval);
      clearInterval(requestInterval);
    };
  }, [currentPrice]);

  return { currentPrice, priceUpdateCount, marketData };
};
