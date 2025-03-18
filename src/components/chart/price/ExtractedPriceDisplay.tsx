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
  const widgetRef = useRef<HTMLDivElement | null>(null);

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
  useEffect(() => {
    if (currentPrice !== null) {
      setLastUpdateTime(new Date());
      setIsExtracting(false);
    } else {
      setIsExtracting(true);
    }
  }, [currentPrice]);

  // طلب السعر الحالي عند تحميل المكون
  useEffect(() => {
    window.dispatchEvent(new Event('request-current-price'));

    // إضافة مستمع للتحديثات المستمرة
    const intervalId = setInterval(() => {
      window.dispatchEvent(new Event('request-current-price'));
    }, 1000); // طلب تحديث كل ثانية

    return () => clearInterval(intervalId);
  }, []);

  // معالجة نتائج OCR وتحديث السعر
  useEffect(() => {
    if (extractedPrice !== null) {
      updatePrice(extractedPrice);

      // إرسال حدث تحديث السعر
      window.dispatchEvent(new CustomEvent('image-price-update', {
        detail: {
          price: extractedPrice
        }
      }));
    }
  }, [extractedPrice, updatePrice]);

  // تنفيذ التقاط الصورة ومعالجتها
  const handleCaptureAndProcess = async () => {
    const imageUrl = await captureTradingViewWidget();
    if (imageUrl) {
      await processImageWithOCR(imageUrl);
    }
  };

  // تنفيذ التقاط الصورة وتحديثها بشكل دوري
  useEffect(() => {
    // تأخير أكبر للتأكد من تحميل TradingView بالكامل
    const initialDelay = setTimeout(() => {
      console.log('بدء محاولة التقاط الصورة الأولى...');
      handleCaptureAndProcess();

      // جدولة التقاط متكرر للصور مع فاصل زمني أطول
      const captureInterval = setInterval(() => {
        handleCaptureAndProcess();
      }, 2000); // التقاط كل 2 ثوان لتقليل الحمل وزيادة فرص نجاح الالتقاط

      // تنظيف عند إزالة المكون
      return () => {
        clearInterval(captureInterval);
      };
    }, 2500); // تأخير أولي 2.5 ثانية للسماح بتحميل الويدجت بالكامل

    return () => {
      clearTimeout(initialDelay);
    };
  }, []);

  // تحويل سنتيمتر إلى بكسل (تقريباً 38 بكسل للسنتيمتر الواحد في معظم الشاشات)
  const widthInPx = 5 * 38; // 5 سم - تعديل العرض
  const heightInPx = 2.5 * 38; // 2.5 سم - تحديث الارتفاع

  return <div className="w-full">
      <PriceDisplay currentPrice={extractedPrice !== null ? extractedPrice : currentPrice} priceUpdateCount={priceUpdateCount} lastUpdateTime={lastUpdateTime} />
      
      {isExtracting && <p className="text-center text-amber-500 text-sm mt-1">
          جاري استخراج السعر الحالي من الصورة...
        </p>}
      
      {isProcessingOCR}
      
      {/* عرض الصورة الملتقطة */}
      <CapturedImageDisplay capturedImage={capturedImage} captureAttempts={captureAttempts} widthInPx={widthInPx} heightInPx={heightInPx} onManualCapture={handleCaptureAndProcess} />
      
      {/* عرض النص المستخرج والسعر */}
      <RecognizedTextDisplay recognizedText={recognizedText} extractedPrice={extractedPrice} />
    </div>;
};