
import React, { useState, useEffect, useRef } from 'react';
import { PriceDisplay } from '../backtest/components/PriceDisplay';
import { useCurrentPrice } from '@/hooks/useCurrentPrice';
import { useImageCapture } from '@/hooks/useImageCapture';
import { useOcrProcessor } from '@/hooks/useOcrProcessor';
import { CapturedImageDisplay } from './CapturedImageDisplay';
import { RecognizedTextDisplay } from './RecognizedTextDisplay';

export const ExtractedPriceDisplay: React.FC = () => {
  const {
    currentPrice,
    priceUpdateCount,
    updatePrice
  } = useCurrentPrice();
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const updateSuccessRef = useRef<boolean>(false);
  const [lastCapturedImage, setLastCapturedImage] = useState<string | null>(null);

  // استخدام الهوكات المخصصة
  const {
    capturedImage,
    captureAttempts,
    captureTradingViewWidget
  } = useImageCapture();
  const {
    recognizedText,
    extractedPrice,
    isProcessingOCR,
    enhancedImage,
    processImageWithOCR
  } = useOcrProcessor();
  
  // استماع لحدث التقاط صورة من الويدجيت
  useEffect(() => {
    const handleWidgetImageCaptured = (event: CustomEvent<{ imageUrl: string }>) => {
      if (event.detail && event.detail.imageUrl) {
        console.log("ExtractedPriceDisplay: تم استلام صورة من الويدجيت");
        setLastCapturedImage(event.detail.imageUrl);
        
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
    console.log("تفعيل استماع لأحداث السعر");
    
    const handlePriceResponse = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        console.log("ExtractedPriceDisplay: تم استلام استجابة سعر:", event.detail.price);
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
      console.log("ExtractedPriceDisplay: تم استخراج سعر من صورة:", extractedPrice);
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

  // التقاط الصورة ومعالجتها
  const handleCaptureAndProcess = async () => {
    setIsExtracting(true);
    
    // إرسال طلب لالتقاط صورة من LiveTradingViewChart
    window.dispatchEvent(new Event('request-capture-widget'));
    
    // كبديل، يمكننا أيضًا استخدام الطريقة القديمة
    const imageUrl = await captureTradingViewWidget();
    if (imageUrl) {
      console.log("ExtractedPriceDisplay: تم التقاط صورة بنجاح");
      await processImageWithOCR(imageUrl);
    }
    
    setTimeout(() => {
      if (!updateSuccessRef.current) {
        setIsExtracting(false);
      }
    }, 3000);
  };

  // بدء التقاط الصور عند تحميل المكون
  useEffect(() => {
    const initialDelay = setTimeout(() => {
      console.log('بدء محاولة التقاط الصورة الأولى...');
      handleCaptureAndProcess();

      const captureInterval = setInterval(() => {
        if (!updateSuccessRef.current || Date.now() - (lastUpdateTime?.getTime() || 0) > 10000) {
          console.log("ExtractedPriceDisplay: محاولة تحديث السعر تلقائيًا");
          handleCaptureAndProcess();
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

  const widthInPx = 5 * 38;
  const heightInPx = 2.5 * 38;

  return (
    <div className="w-full">
      <PriceDisplay 
        currentPrice={extractedPrice !== null ? extractedPrice : currentPrice} 
        priceUpdateCount={priceUpdateCount} 
        lastUpdateTime={lastUpdateTime} 
      />
      
      {isExtracting && <p className="text-center text-amber-500 text-sm mt-1">
        جاري استخراج السعر الحالي من الصورة...
      </p>}
      
      <CapturedImageDisplay 
        capturedImage={lastCapturedImage || capturedImage} 
        captureAttempts={captureAttempts} 
        widthInPx={widthInPx} 
        heightInPx={heightInPx} 
        onManualCapture={handleCaptureAndProcess} 
      />
      
      <RecognizedTextDisplay 
        recognizedText={recognizedText} 
        extractedPrice={extractedPrice}
        enhancedImage={enhancedImage}
      />
    </div>
  );
};
