
import { useState, useCallback, useRef } from 'react';
import { recognizeTextFromImage } from '@/utils/price/ocr/textRecognition';
import { extractPriceFromText } from '@/utils/price/extraction/priceExtractor';

interface UseOcrProcessorResult {
  recognizedText: string;
  extractedPrice: number | null;
  isProcessingOCR: boolean;
  enhancedImage: string | null;
  processImageWithOCR: (imageUrl: string) => Promise<number | null>;
}

export const useOcrProcessor = (): UseOcrProcessorResult => {
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [extractedPrice, setExtractedPrice] = useState<number | null>(null);
  const [isProcessingOCR, setIsProcessingOCR] = useState<boolean>(false);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const processingRef = useRef<boolean>(false);

  const processImageWithOCR = useCallback(async (imageUrl: string): Promise<number | null> => {
    if (!imageUrl || imageUrl.length < 100) {
      console.log("صورة غير صالحة أو فارغة");
      return null;
    }
    
    if (processingRef.current) {
      console.log("جارٍ بالفعل معالجة صورة أخرى");
      return null;
    }
    
    try {
      setIsProcessingOCR(true);
      processingRef.current = true;
      
      // استخراج النص من الصورة
      console.log("بدء استخراج النص من الصورة...");
      
      // استماع لحدث تحسين الصورة
      const enhancedImagePromise = new Promise<string | null>((resolve) => {
        const handleImageEnhanced = ((event: CustomEvent) => {
          if (event.detail && event.detail.enhancedImageUrl) {
            console.log("تم استلام الصورة المحسنة");
            setEnhancedImage(event.detail.enhancedImageUrl);
            resolve(event.detail.enhancedImageUrl);
          } else {
            resolve(null);
          }
        }) as EventListener;
        
        window.addEventListener('image-enhanced', handleImageEnhanced, { once: true });
        
        // تنظيف المستمع إذا لم يتم استلام حدث خلال 5 ثوانٍ
        setTimeout(() => {
          window.removeEventListener('image-enhanced', handleImageEnhanced);
          resolve(null);
        }, 5000);
      });
      
      // معالجة الصورة باستخدام OCR
      const extractedText = await recognizeTextFromImage(imageUrl);
      await enhancedImagePromise; // الانتظار لاستلام الصورة المحسنة
      
      console.log("النص المستخرج من الصورة:", extractedText);
      setRecognizedText(extractedText);
      
      // البحث عن أنماط سعر الذهب المباشرة
      const goldPriceRegexes = [
        /XAUUSD[^0-9]*([123][0-9]{3}\.?[0-9]{0,2})/i,
        /Gold[^0-9]*([123][0-9]{3}\.?[0-9]{0,2})/i,
        /\b([123][0-9]{3}\.?[0-9]{0,2})\b/
      ];
      
      for (const regex of goldPriceRegexes) {
        const matches = extractedText.match(regex);
        if (matches && matches[1]) {
          const priceText = matches[1].replace(/,/g, '');
          const price = parseFloat(priceText);
          
          if (!isNaN(price) && price > 1000 && price < 5000) {
            console.log(`تم استخراج سعر الذهب من النمط ${regex}:`, price);
            setExtractedPrice(price);
            
            // إصدار حدث لتحديث السعر في كل مكان
            window.dispatchEvent(
              new CustomEvent('tradingview-price-update', {
                detail: { price, source: 'ocr-direct-pattern' }
              })
            );
            
            return price;
          }
        }
      }
      
      // استخراج السعر من النص إذا لم يتم العثور على تطابق مباشر
      const price = extractPriceFromText(extractedText);
      console.log("محاولة استخراج السعر عبر الدالة العامة:", price);
      
      if (price !== null) {
        setExtractedPrice(price);
        
        // إذا تم استخراج سعر صالح، نقوم بإصدار حدث
        if (price > 1000 && price < 5000) {
          window.dispatchEvent(
            new CustomEvent('tradingview-price-update', {
              detail: { price, source: 'ocr-general-extraction' }
            })
          );
          return price;
        }
      }
      
      // محاولة استخراج سعر باستخدام نمط أرقام معين
      const numericMatches = extractedText.match(/\b\d+\.\d+\b/g);
      if (numericMatches && numericMatches.length > 0) {
        for (const numStr of numericMatches) {
          const numPrice = parseFloat(numStr);
          if (!isNaN(numPrice) && numPrice > 1000 && numPrice < 5000) {
            console.log("تم استخراج سعر محتمل من الأرقام:", numPrice);
            setExtractedPrice(numPrice);
            
            window.dispatchEvent(
              new CustomEvent('tradingview-price-update', {
                detail: { price: numPrice, source: 'ocr-numeric-match' }
              })
            );
            
            return numPrice;
          }
        }
      }
      
      return price;
    } catch (error) {
      console.error('خطأ في معالجة الصورة باستخدام OCR:', error);
      return null;
    } finally {
      setIsProcessingOCR(false);
      processingRef.current = false;
    }
  }, []);

  return {
    recognizedText,
    extractedPrice,
    isProcessingOCR,
    enhancedImage,
    processImageWithOCR
  };
};
