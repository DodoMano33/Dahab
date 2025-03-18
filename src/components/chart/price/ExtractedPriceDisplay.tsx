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

  useEffect(() => {
    window.dispatchEvent(new Event('request-current-price'));

    const intervalId = setInterval(() => {
      window.dispatchEvent(new Event('request-current-price'));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (extractedPrice !== null) {
      updatePrice(extractedPrice);

      window.dispatchEvent(new CustomEvent('image-price-update', {
        detail: {
          price: extractedPrice
        }
      }));
    }
  }, [extractedPrice, updatePrice]);

  const handleCaptureAndProcess = async () => {
    const imageUrl = await captureTradingViewWidget();
    if (imageUrl) {
      await processImageWithOCR(imageUrl);
    }
  };

  useEffect(() => {
    const initialDelay = setTimeout(() => {
      console.log('بدء محاولة التقاط الصورة الأولى...');
      handleCaptureAndProcess();

      const captureInterval = setInterval(() => {
        handleCaptureAndProcess();
      }, 2000);

      return () => {
        clearInterval(captureInterval);
      };
    }, 2500);

    return () => {
      clearTimeout(initialDelay);
    };
  }, []);

  const widthInPx = 5 * 38;
  const heightInPx = 2.5 * 38;

  return <div className="w-full">
      <PriceDisplay currentPrice={extractedPrice !== null ? extractedPrice : currentPrice} priceUpdateCount={priceUpdateCount} lastUpdateTime={lastUpdateTime} />
      
      {isExtracting && <p className="text-center text-amber-500 text-sm mt-1">
          جاري استخراج السعر الحالي من الصورة...
        </p>}
      
      {isProcessingOCR}
      
      <CapturedImageDisplay 
        capturedImage={capturedImage} 
        captureAttempts={captureAttempts} 
        widthInPx={widthInPx} 
        heightInPx={heightInPx} 
        onManualCapture={handleCaptureAndProcess} 
      />
      
      <RecognizedTextDisplay recognizedText={recognizedText} extractedPrice={extractedPrice} />
    </div>;
};
