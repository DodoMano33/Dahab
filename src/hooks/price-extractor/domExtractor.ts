
import { PriceRecord } from '@/components/chart/price-extractor/types';
import { DEFAULT_PRICE_SELECTORS } from './types';
import { cleanPriceText, validatePriceWithHistory } from './utils/priceTextCleaner';

interface DOMExtractorOptions {
  priceSelectors: string[];
  debugMode: boolean;
  onPriceFound: (price: number, source: string) => void;
  maxHistorySize: number;
  onHistoryUpdate: (newRecord: PriceRecord, prevHistory: PriceRecord[]) => void;
  lastValidPrice?: number | null;
}

/**
 * وظيفة محسنة لاستخراج السعر من DOM
 * تتضمن تحققات متعددة من صحة السعر
 */
export const extractPriceFromDOM = (options: DOMExtractorOptions): number | null => {
  const { 
    priceSelectors, 
    debugMode, 
    onPriceFound, 
    maxHistorySize, 
    onHistoryUpdate,
    lastValidPrice = null
  } = options;

  try {
    if (debugMode) {
      console.log('Extracting price from DOM with selectors:', priceSelectors);
    }

    // البحث عن عنصر سعر الذهب في DOM
    let priceElement: Element | null = null;
    let foundSelector = '';
    let highestPriority = -1;
    let extractedPrice: number | null = null;
    let foundPrices: {price: number, selector: string, priority: number}[] = [];

    // أولاً نجرب المحددات ذات الأولوية
    for (let priority = 0; priority < priceSelectors.length; priority++) {
      const selector = priceSelectors[priority];
      const elements = document.querySelectorAll(selector);
      
      for (const element of Array.from(elements)) {
        const text = element.textContent;
        if (text && /\d+[,.]?\d*/.test(text)) {
          const tempPrice = cleanPriceText(text, debugMode);
          
          // نتحقق من صحة السعر المستخرج
          if (tempPrice !== null) {
            // نخزن جميع الأسعار المستخرجة مع معلوماتها لمعالجتها لاحقًا
            foundPrices.push({
              price: tempPrice,
              selector,
              priority
            });
            
            // تحديث أعلى أولوية فقط إذا كانت الأولوية الحالية أعلى
            if (priority > highestPriority) {
              priceElement = element;
              foundSelector = selector;
              highestPriority = priority;
              extractedPrice = tempPrice;
              
              if (debugMode) {
                console.log(`Found price element with selector: ${selector}, priority: ${priority}, price: ${tempPrice}`);
              }
            }
          }
        }
      }
    }

    // تحقق إضافي 1: مقارنة السعر مع التاريخ السابق للتأكد من صحته
    if (extractedPrice !== null) {
      const validatedPrice = validatePriceWithHistory(extractedPrice, lastValidPrice, 5, debugMode);
      
      if (validatedPrice !== null) {
        if (debugMode) {
          console.log(`Successfully extracted and validated price: ${validatedPrice} from selector: ${foundSelector}`);
        }
        
        const source = `DOM Extraction (${foundSelector})`;
        onPriceFound(validatedPrice, source);
        
        // إضافة السعر الجديد إلى سجل الأسعار
        const newRecord: PriceRecord = {
          price: validatedPrice,
          timestamp: new Date(),
          source: source
        };
        
        onHistoryUpdate(newRecord, []);
        
        // إرسال حدث بالسعر المستخرج
        window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
          detail: { 
            price: validatedPrice, 
            symbol: 'XAUUSD',
            source: source
          }
        }));
        
        return validatedPrice;
      } else if (debugMode) {
        console.warn(`Price ${extractedPrice} failed validation with history`);
      }
    }

    // تحقق إضافي 2: إذا فشل السعر الأول، نستخدم "الإجماع" من خلال مقارنة عدة أسعار
    if (foundPrices.length >= 2) {
      // ترتيب الأسعار
      foundPrices.sort((a, b) => a.price - b.price);
      
      // استخدام متوسط الأسعار أو القيمة الوسطى
      if (foundPrices.length % 2 === 0) {
        // متوسط القيمتين الوسطيتين إذا كان العدد زوجيًا
        const middle1 = foundPrices[Math.floor(foundPrices.length / 2) - 1].price;
        const middle2 = foundPrices[Math.floor(foundPrices.length / 2)].price;
        const consensusPrice = (middle1 + middle2) / 2;
        
        // التحقق من السعر مع التاريخ
        const validatedConsensus = validatePriceWithHistory(consensusPrice, lastValidPrice, 5, debugMode);
        
        if (validatedConsensus !== null) {
          if (debugMode) {
            console.log(`Using consensus price (even): ${validatedConsensus}`);
          }
          
          const source = `DOM Extraction (consensus)`;
          onPriceFound(validatedConsensus, source);
          
          const newRecord: PriceRecord = {
            price: validatedConsensus,
            timestamp: new Date(),
            source: source
          };
          
          onHistoryUpdate(newRecord, []);
          
          window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
            detail: { 
              price: validatedConsensus, 
              symbol: 'XAUUSD',
              source: source
            }
          }));
          
          return validatedConsensus;
        }
      } else {
        // استخدام القيمة الوسطى إذا كان العدد فرديًا
        const medianPrice = foundPrices[Math.floor(foundPrices.length / 2)].price;
        
        // التحقق من السعر مع التاريخ
        const validatedMedian = validatePriceWithHistory(medianPrice, lastValidPrice, 5, debugMode);
        
        if (validatedMedian !== null) {
          if (debugMode) {
            console.log(`Using median price: ${validatedMedian}`);
          }
          
          const source = `DOM Extraction (median)`;
          onPriceFound(validatedMedian, source);
          
          const newRecord: PriceRecord = {
            price: validatedMedian,
            timestamp: new Date(),
            source: source
          };
          
          onHistoryUpdate(newRecord, []);
          
          window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
            detail: { 
              price: validatedMedian, 
              symbol: 'XAUUSD',
              source: source
            }
          }));
          
          return validatedMedian;
        }
      }
    }

    // محاولة أخيرة: استخراج السعر من العناصر المرئية في الصفحة
    const visibleElements = Array.from(document.querySelectorAll('*'))
      .filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && 
                style.visibility !== 'hidden' && 
                style.opacity !== '0' &&
                el.textContent && 
                /\d+[,.]?\d*/.test(el.textContent) &&
                el.textContent.length < 30; // تجنب النصوص الطويلة
      });
    
    const visiblePrices: number[] = [];
    
    for (const element of visibleElements) {
      const text = element.textContent;
      if (text) {
        const tempPrice = cleanPriceText(text, false); // استخدام debugMode=false لتقليل السجلات
        if (tempPrice !== null) {
          visiblePrices.push(tempPrice);
        }
      }
    }
    
    if (visiblePrices.length > 0) {
      // ترتيب الأسعار
      visiblePrices.sort((a, b) => a - b);
      
      // استخدام القيمة الوسطى لتجنب القيم المتطرفة
      const medianVisiblePrice = visiblePrices[Math.floor(visiblePrices.length / 2)];
      
      // التحقق من السعر مع التاريخ
      const validatedVisiblePrice = validatePriceWithHistory(medianVisiblePrice, lastValidPrice, 5, debugMode);
      
      if (validatedVisiblePrice !== null) {
        if (debugMode) {
          console.log(`Found price in visible elements: ${validatedVisiblePrice}`);
        }
        
        const source = `DOM Extraction (visible elements)`;
        onPriceFound(validatedVisiblePrice, source);
        
        const newRecord: PriceRecord = {
          price: validatedVisiblePrice,
          timestamp: new Date(),
          source: source
        };
        
        onHistoryUpdate(newRecord, []);
        
        window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
          detail: { 
            price: validatedVisiblePrice, 
            symbol: 'XAUUSD',
            source: source
          }
        }));
        
        return validatedVisiblePrice;
      }
    }

    if (debugMode) {
      console.warn('No valid price found in DOM after all checks');
    }
    return null;
  } catch (error) {
    console.error('Error extracting price from DOM:', error);
    return null;
  }
};
