
import React, { useEffect, useState } from 'react';

interface CurrentPriceListenerProps {
  children: (currentPrice: number) => React.ReactNode;
}

export const CurrentPriceListener: React.FC<CurrentPriceListenerProps> = ({ children }) => {
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  useEffect(() => {
    // Function to extract price from the TradingView widget
    const extractPrice = () => {
      try {
        // البحث عن عنصر السعر ذو الخط الأكبر حجماً (tv-symbol-price-quote__value)
        const priceElement = document.querySelector('.tv-symbol-price-quote__value');
        
        if (priceElement) {
          const priceText = priceElement.textContent || '';
          const price = parseFloat(priceText.replace(',', ''));
          
          if (!isNaN(price)) {
            setCurrentPrice(price);
            console.log('CurrentPriceListener - تم العثور على سعر الذهب من العنصر الأساسي:', price);
          } else {
            console.log('CurrentPriceListener - لم يتم التعرف على السعر من العنصر الأساسي:', priceText);
            // البحث في عنصر بديل إذا فشل التعرف على السعر من العنصر الأساسي
            fallbackPriceExtraction();
          }
        } else {
          console.log('CurrentPriceListener - لم يتم العثور على عنصر السعر الأساسي، جاري البحث في العناصر البديلة');
          // البحث في عناصر بديلة إذا لم يتم العثور على العنصر الأساسي
          fallbackPriceExtraction();
        }
      } catch (error) {
        console.error('CurrentPriceListener - خطأ أثناء استخراج السعر:', error);
        // محاولة البحث في عناصر بديلة في حالة حدوث خطأ
        fallbackPriceExtraction();
      }
    };

    // دالة بديلة للبحث عن السعر في عناصر أخرى
    const fallbackPriceExtraction = () => {
      try {
        // محاولة البحث عن عنصر السعر البديل (tv-ticker-item-last__last)
        const altPriceElement = document.querySelector('.tv-ticker-item-last__last');
        
        if (altPriceElement) {
          const priceText = altPriceElement.textContent || '';
          const price = parseFloat(priceText.replace(',', ''));
          
          if (!isNaN(price)) {
            setCurrentPrice(price);
            console.log('CurrentPriceListener - تم العثور على سعر الذهب من العنصر البديل:', price);
          } else {
            console.log('CurrentPriceListener - لم يتم التعرف على السعر من العنصر البديل، استخدام القيمة الافتراضية');
            setCurrentPrice(100); // قيمة افتراضية إذا لم يتم العثور على سعر صالح
          }
        } else {
          // محاولة البحث عن أي عنصر يحتوي على رقم كبير في الصفحة
          const allElements = document.querySelectorAll('span, div');
          let found = false;
          
          for (const element of allElements) {
            // البحث عن العناصر التي تحتوي على أرقام فقط أو أرقام مع فاصلة
            const text = element.textContent || '';
            if (/^\d+(\.\d+)?$/.test(text.replace(',', '')) || /^\d{1,3}(,\d{3})*(\.\d+)?$/.test(text)) {
              const priceCandidate = parseFloat(text.replace(',', ''));
              
              // التحقق من أن الرقم منطقي لسعر الذهب (بين 500 و 5000)
              if (!isNaN(priceCandidate) && priceCandidate > 500 && priceCandidate < 5000) {
                // التحقق من أن العنصر مرئي وله حجم خط كبير نسبياً
                const style = window.getComputedStyle(element);
                const fontSize = parseInt(style.fontSize);
                
                if (fontSize > 14) { // البحث عن النصوص ذات الخط الكبير
                  setCurrentPrice(priceCandidate);
                  console.log('CurrentPriceListener - تم العثور على سعر محتمل للذهب من عنصر عام:', priceCandidate);
                  found = true;
                  break;
                }
              }
            }
          }
          
          if (!found) {
            console.log('CurrentPriceListener - لم يتم العثور على أي عنصر سعر، استخدام القيمة الافتراضية');
            setCurrentPrice(100); // قيمة افتراضية إذا لم يتم العثور على سعر صالح
          }
        }
      } catch (error) {
        console.error('CurrentPriceListener - خطأ أثناء استخراج السعر البديل:', error);
        setCurrentPrice(100); // قيمة افتراضية في حالة حدوث خطأ
      }
    };

    // استخراج السعر عند التحميل
    extractPrice();
    
    // إعداد فاصل زمني للتحديثات الدورية
    const interval = setInterval(extractPrice, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return <>{children(currentPrice)}</>;
};
