
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
    if (!imageUrl || imageUrl.length < 100) {
      console.log("صورة غير صالحة أو فارغة");
      return null;
    }
    
    if (isProcessingOCR) {
      console.log("جارٍ بالفعل معالجة صورة أخرى");
      return null;
    }
    
    try {
      setIsProcessingOCR(true);
      
      // استخراج النص من الصورة
      console.log("بدء استخراج النص من الصورة...");
      
      // معالجة الصورة باستخدام OCR
      const extractedText = await recognizeTextFromImage(imageUrl);
      console.log("النص المستخرج من الصورة:", extractedText);
      
      // تسجيل النص فقط إذا لم يكن فارغاً
      if (extractedText && extractedText.trim().length > 0) {
        setRecognizedText(extractedText);
        
        // استخراج السعر من النص المستخرج
        const price = extractPriceFromText(extractedText);
        console.log("السعر المستخرج من النص:", price);
        
        if (price !== null) {
          setExtractedPrice(price);
          
          // إذا تم استخراج سعر صالح، نقوم بإصدار حدث
          window.dispatchEvent(
            new CustomEvent('tradingview-price-update', {
              detail: { price }
            })
          );
          
          return price;
        } else {
          console.log("لم يتم العثور على سعر صالح في النص المستخرج");
        }
      } else {
        console.log("النص المستخرج فارغ، لا يمكن استخراج سعر");
      }
      
      return null;
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
