
import React, { useState, useEffect, useRef } from 'react';
import { PriceDisplay } from '../backtest/components/PriceDisplay';
import { useCurrentPrice } from '@/hooks/useCurrentPrice';
import { useImageCapture } from '@/hooks/useImageCapture';
import { useOcrProcessor } from '@/hooks/useOcrProcessor';

export const ExtractedPriceDisplay: React.FC = () => {
  const {
    currentPrice,
    priceUpdateCount,
    updatePrice
  } = useCurrentPrice();
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const updateSuccessRef = useRef<boolean>(false);

  // استخدام الهوكات المخصصة
  const {
    captureTradingViewWidget
  } = useImageCapture();
  const {
    extractedPrice,
    processImageWithOCR
  } = useOcrProcessor();
  
  // استماع لحدث التقاط صورة من الويدجيت
  useEffect(() => {
    const handleWidgetImageCaptured = (event: CustomEvent<{ imageUrl: string }>) => {
      if (event.detail && event.detail.imageUrl) {
        // معالجة الصورة باستخدام OCR
        processImageWithOCR(event.detail.imageUrl).then(price => {
          if (price !== null) {
            console.log("تم استخراج السعر من صورة الويدجيت:", price);
          }
        });
      }
    };
    
    window.addEventListener('widget-image-captured', handleWidgetImageCaptured as EventListener);
    
    return () => {
      window.removeEventListener('widget-image-captured', handleWidgetImageCaptured as EventListener);
    };
  }, [processImageWithOCR]);
  
  // تحديث الوقت عند تغير السعر
  useEffect(() => {
    if (currentPrice !== null) {
      setLastUpdateTime(new Date());
      setIsExtracting(false);
    } else {
      setIsExtracting(true);
    }
  }, [currentPrice]);

  // طلب تحديث السعر الحالي بشكل دوري
  useEffect(() => {
    const handlePriceResponse = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        updateSuccessRef.current = true;
      }
    };
    
    window.addEventListener('current-price-response', handlePriceResponse as EventListener);
    
    // طلب تحديث السعر بشكل فوري وبشكل دوري
    window.dispatchEvent(new Event('request-current-price'));
    window.dispatchEvent(new Event('request-capture-widget'));
    
    const intervalId = setInterval(() => {
      window.dispatchEvent(new Event('request-current-price'));
    }, 1000);

    return () => {
      window.removeEventListener('current-price-response', handlePriceResponse as EventListener);
      clearInterval(intervalId);
    };
  }, []);

  // تحديث السعر عند استخراجه من الصورة
  useEffect(() => {
    if (extractedPrice !== null) {
      updatePrice(extractedPrice);
      setLastUpdateTime(new Date());
      updateSuccessRef.current = true;

      // إرسال حدث لتحديث السعر في باقي التطبيق
      window.dispatchEvent(new CustomEvent('image-price-update', {
        detail: {
          price: extractedPrice
        }
      }));
    }
  }, [extractedPrice, updatePrice]);

  // بدء التقاط الصور عند تحميل المكون
  useEffect(() => {
    const initialDelay = setTimeout(() => {
      const captureInterval = setInterval(() => {
        if (!updateSuccessRef.current || Date.now() - (lastUpdateTime?.getTime() || 0) > 10000) {
          window.dispatchEvent(new Event('request-capture-widget'));
        }
      }, 5000); // تقليل تواتر التحديثات

      return () => {
        clearInterval(captureInterval);
      };
    }, 1500); // تقليل وقت التأخير الأولي

    return () => {
      clearTimeout(initialDelay);
    };
  }, [lastUpdateTime]);

  return (
    <div className="w-full">
      <PriceDisplay 
        currentPrice={extractedPrice !== null ? extractedPrice : currentPrice} 
        priceUpdateCount={priceUpdateCount} 
        lastUpdateTime={lastUpdateTime} 
      />
      
      {isExtracting && <p className="text-center text-amber-500 text-sm mt-1">
        جاري استخراج السعر الحالي...
      </p>}
    </div>
  );
};
