
import React, { useState, useEffect, useRef } from 'react';
import { PriceDisplay } from '../backtest/components/PriceDisplay';
import { useCurrentPrice } from '@/hooks/useCurrentPrice';
import { useImageCapture } from '@/hooks/useImageCapture';
import { useOcrProcessor } from '@/hooks/useOcrProcessor';
import { CapturedImageDisplay } from './CapturedImageDisplay';
import { RecognizedTextDisplay } from './RecognizedTextDisplay';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

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
    capturedImage,
    captureAttempts,
    captureTradingViewWidget
  } = useImageCapture();
  const {
    recognizedText,
    extractedPrice,
    isProcessingOCR,
    processImageWithOCR
  } = useOcrProcessor();
  
  // تحديث الوقت عند تغير السعر
  useEffect(() => {
    if (currentPrice !== null) {
      setLastUpdateTime(new Date());
      setIsExtracting(false);
    } else {
      setIsExtracting(true);
    }
  }, [currentPrice]);

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
      
      // إرسال حدث عام لتحديث السعر مع تحديد المصدر
      window.dispatchEvent(new CustomEvent('global-price-update', {
        detail: {
          price: extractedPrice,
          source: 'image-processing'
        }
      }));
    }
  }, [extractedPrice, updatePrice]);

  // التقاط الصورة ومعالجتها
  const handleCaptureAndProcess = async () => {
    setIsExtracting(true);
    updateSuccessRef.current = false;
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
      }, 10000); // تقليل عدد المحاولات التلقائية إلى كل 10 ثوانٍ

      return () => {
        clearInterval(captureInterval);
      };
    }, 1500);

    return () => {
      clearTimeout(initialDelay);
    };
  }, [lastUpdateTime]);

  const widthInPx = 5 * 38;
  const heightInPx = 2.5 * 38;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">السعر المستخرج من الصورة</h3>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleCaptureAndProcess}
          disabled={isExtracting || isProcessingOCR}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          تحديث السعر
        </Button>
      </div>
      
      <PriceDisplay 
        currentPrice={currentPrice} 
        priceUpdateCount={priceUpdateCount} 
        lastUpdateTime={lastUpdateTime} 
      />
      
      {isExtracting && <p className="text-center text-amber-500 text-sm mt-1">
        جاري استخراج السعر الحالي من الصورة...
      </p>}
      
      <CapturedImageDisplay 
        capturedImage={capturedImage} 
        captureAttempts={captureAttempts} 
        widthInPx={widthInPx} 
        heightInPx={heightInPx} 
        onManualCapture={handleCaptureAndProcess} 
      />
      
      <RecognizedTextDisplay 
        recognizedText={recognizedText} 
        extractedPrice={extractedPrice} 
      />
    </div>
  );
};
