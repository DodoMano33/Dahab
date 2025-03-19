
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
      setRecognizedText(extractedText);
      
      // البحث عن أنماط خاصة بسعر الذهب
      // استخدام نمط مرن للعثور على سعر الذهب الحالي (حوالي 3000-3100)
      const currentGoldPriceRegex = /\b30[0-3][0-9]([.,]\d{1,2})?\b/g;
      const currentMatches = extractedText.match(currentGoldPriceRegex);
      
      if (currentMatches && currentMatches.length > 0) {
        console.log("تم العثور على أنماط سعر الذهب الحالي:", currentMatches);
        // نستخدم أول تطابق
        const priceText = currentMatches[0].replace(/,/g, '.');
        const price = parseFloat(priceText);
        
        if (!isNaN(price) && price >= 3000 && price <= 3100) {
          console.log("تم استخراج سعر الذهب الحالي من النص:", price);
          setExtractedPrice(price);
          
          // إصدار حدث لتحديث السعر في كل مكان
          window.dispatchEvent(
            new CustomEvent('tradingview-price-update', {
              detail: { price }
            })
          );
          
          return price;
        }
      }
      
      // البحث عن أنماط أوسع لسعر الذهب
      const goldPriceRegex = /\b([1-9]([\d,]{3}|[\d]{3})\.[\d]{1,2})\b/g;
      const matches = extractedText.match(goldPriceRegex);
      
      if (matches && matches.length > 0) {
        console.log("تم العثور على أنماط سعر الذهب:", matches);
        // نستخدم أول تطابق
        const priceText = matches[0].replace(/,/g, '');
        const price = parseFloat(priceText);
        
        if (!isNaN(price) && price > 1000 && price < 9000) {
          console.log("تم استخراج سعر الذهب من النص:", price);
          setExtractedPrice(price);
          
          // إصدار حدث لتحديث السعر في كل مكان
          window.dispatchEvent(
            new CustomEvent('tradingview-price-update', {
              detail: { price }
            })
          );
          
          return price;
        }
      }
      
      // استخراج السعر من النص إذا لم يتم العثور على تطابق مباشر
      const price = extractPriceFromText(extractedText);
      console.log("محاولة استخراج السعر عبر الدالة العامة:", price);
      setExtractedPrice(price);
      
      // إذا تم استخراج سعر صالح، نقوم بإصدار حدث
      if (price !== null && price > 1000 && price < 9000) {
        window.dispatchEvent(
          new CustomEvent('tradingview-price-update', {
            detail: { price }
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
