
import React, { useEffect, useState } from 'react';
import { ScreenshotPriceExtractor } from '../ScreenshotPriceExtractor';

interface CurrentPriceListenerProps {
  children: (currentPrice: number) => React.ReactNode;
}

export const CurrentPriceListener: React.FC<CurrentPriceListenerProps> = ({ children }) => {
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [usingScreenshot, setUsingScreenshot] = useState<boolean>(true);

  // استخدام قارئ لقطات الشاشة
  const handlePriceFromScreenshot = (price: number) => {
    if (price > 0) {
      setCurrentPrice(price);
      console.log('CurrentPriceListener - تم تحديث السعر من لقطة الشاشة:', price);
    }
  };

  useEffect(() => {
    // طريقة احتياطية في حال فشل استخراج السعر من لقطة الشاشة
    const fallbackExtractPrice = () => {
      try {
        // استخراج السعر من عنصر القيمة الرئيسي ذو الخط الأكبر
        const priceElement = document.querySelector('.tv-symbol-price-quote__value');
        if (priceElement) {
          const priceText = priceElement.textContent || '';
          const price = parseFloat(priceText.replace(',', ''));
          if (!isNaN(price)) {
            setCurrentPrice(price);
            console.log('CurrentPriceListener - Gold price:', price);
          } else {
            console.log('CurrentPriceListener - Could not parse price:', priceText);
            
            // محاولة بديلة للعثور على السعر
            const alternativePriceElement = document.querySelector('.tv-ticker-item-last__last');
            if (alternativePriceElement) {
              const alternativePriceText = alternativePriceElement.textContent || '';
              const alternativePrice = parseFloat(alternativePriceText.replace(',', ''));
              if (!isNaN(alternativePrice)) {
                setCurrentPrice(alternativePrice);
                console.log('CurrentPriceListener - Gold price (alternative):', alternativePrice);
              }
            } else {
              console.log('CurrentPriceListener - Alternative price element not found, using default value');
              setCurrentPrice(100); // Default value if element not found
            }
          }
        } else {
          console.log('CurrentPriceListener - Price element not found, trying alternative...');
          
          // محاولة بديلة للعثور على السعر
          const alternativePriceElement = document.querySelector('.tv-ticker-item-last__last');
          if (alternativePriceElement) {
            const alternativePriceText = alternativePriceElement.textContent || '';
            const alternativePrice = parseFloat(alternativePriceText.replace(',', ''));
            if (!isNaN(alternativePrice)) {
              setCurrentPrice(alternativePrice);
              console.log('CurrentPriceListener - Gold price (alternative):', alternativePrice);
            } else {
              console.log('CurrentPriceListener - Could not parse alternative price');
              setCurrentPrice(100); // Default value if parsing fails
            }
          } else {
            console.log('CurrentPriceListener - Alternative price element not found, using default value');
            setCurrentPrice(100); // Default value if element not found
          }
        }
      } catch (error) {
        console.error('CurrentPriceListener - Error extracting price:', error);
        setCurrentPrice(100); // Default value on error
      }
    };

    // طريقة احتياطية تعمل في حالة عدم نجاح طريقة لقطات الشاشة
    if (!usingScreenshot) {
      fallbackExtractPrice();
      
      // Set up interval for periodic updates using fallback method
      const interval = setInterval(fallbackExtractPrice, 5000);
      return () => clearInterval(interval);
    }
    
    // لا نحتاج للفاصل الزمني هنا لأن ScreenshotPriceExtractor سيقوم بذلك
    return () => {
      // تنظيف إذا لزم الأمر
    };
  }, [usingScreenshot]);

  return (
    <>
      {/* استخدام مكون ScreenshotPriceExtractor لقراءة السعر من لقطات الشاشة */}
      {usingScreenshot && (
        <ScreenshotPriceExtractor 
          targetSelector=".tradingview-widget-container" 
          onPriceExtracted={handlePriceFromScreenshot} 
          intervalMs={1000} // التقاط صورة كل ثانية
        />
      )}
      {children(currentPrice)}
    </>
  );
};
