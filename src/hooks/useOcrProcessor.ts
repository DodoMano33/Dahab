
import { useState, useCallback } from 'react';
import { recognizeTextFromImage } from '@/utils/price/ocr/textRecognition';
import { extractPriceFromText } from '@/utils/price/extraction/priceExtractor';

interface UseOcrProcessorResult {
  recognizedText: string;
  extractedPrice: number | null;
  isProcessingOCR: boolean;
  processImageWithOCR: (imageUrl: string) => Promise<number | null>;
}

export const useOcrProcessor = (): UseOcrProcessorResult => {
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [extractedPrice, setExtractedPrice] = useState<number | null>(null);
  const [isProcessingOCR, setIsProcessingOCR] = useState<boolean>(false);

  const processImageWithOCR = useCallback(async (imageUrl: string): Promise<number | null> => {
    if (isProcessingOCR) return null;
    
    try {
      setIsProcessingOCR(true);
      
      // استخراج النص من الصورة
      const extractedText = await recognizeTextFromImage(imageUrl);
      setRecognizedText(extractedText);
      
      // استخراج السعر من النص
      const price = extractPriceFromText(extractedText);
      setExtractedPrice(price);
      
      // إذا تم العثور على سعر، قم بإرسال حدث
      if (price !== null) {
        window.dispatchEvent(
          new CustomEvent('global-price-update', {
            detail: {
              price: price,
              source: 'image-processing'
            }
          })
        );
      }
      
      return price;
    } catch (error) {
      console.error('خطأ في معالجة الصورة باستخدام OCR:', error);
      return null;
    } finally {
      setIsProcessingOCR(false);
    }
  }, [isProcessingOCR]);

  return {
    recognizedText,
    extractedPrice,
    isProcessingOCR,
    processImageWithOCR
  };
};
