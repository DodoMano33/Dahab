
import { PriceRecord } from '@/components/chart/price-extractor/types';
import { DEFAULT_PRICE_SELECTORS } from './types';
import { cleanPriceText } from './utils/priceTextCleaner';

interface DOMExtractorOptions {
  priceSelectors: string[];
  debugMode: boolean;
  onPriceFound: (price: number, source: string) => void;
  maxHistorySize: number;
  onHistoryUpdate: (newRecord: PriceRecord, prevHistory: PriceRecord[]) => void;
}

/**
 * وظيفة استخراج السعر من DOM
 */
export const extractPriceFromDOM = (options: DOMExtractorOptions): number | null => {
  const { 
    priceSelectors, 
    debugMode, 
    onPriceFound, 
    maxHistorySize, 
    onHistoryUpdate 
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

    // أولاً نجرب المحددات ذات الأولوية
    for (let priority = 0; priority < priceSelectors.length; priority++) {
      const selector = priceSelectors[priority];
      const elements = document.querySelectorAll(selector);
      
      for (const element of Array.from(elements)) {
        const text = element.textContent;
        if (text && /\d+[,.]?\d*/.test(text)) {
          const tempPrice = cleanPriceText(text, debugMode);
          if (tempPrice !== null) {
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

    // استخراج السعر من نص العنصر
    if (priceElement && extractedPrice !== null) {
      if (debugMode) {
        console.log(`Successfully extracted price: ${extractedPrice} from selector: ${foundSelector}`);
      }
      
      const source = `DOM Extraction (${foundSelector})`;
      onPriceFound(extractedPrice, source);
      
      // إضافة السعر الجديد إلى سجل الأسعار
      const newRecord: PriceRecord = {
        price: extractedPrice,
        timestamp: new Date(),
        source: source
      };
      
      onHistoryUpdate(newRecord, []);
      
      // إرسال حدث بالسعر المستخرج
      window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
        detail: { 
          price: extractedPrice, 
          symbol: 'XAUUSD',
          source: source
        }
      }));
      
      return extractedPrice;
    }

    // محاولة استخراج السعر من العناصر المرئية في الصفحة
    if (!priceElement) {
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
      
      for (const element of visibleElements) {
        const text = element.textContent;
        if (text) {
          const tempPrice = cleanPriceText(text, debugMode);
          if (tempPrice !== null) {
            if (debugMode) {
              console.log(`Found price in visible element: ${element.tagName}, price: ${tempPrice}`);
            }
            
            const source = `DOM Extraction (visible element)`;
            onPriceFound(tempPrice, source);
            
            // إضافة السعر الجديد إلى سجل الأسعار
            const newRecord: PriceRecord = {
              price: tempPrice,
              timestamp: new Date(),
              source: source
            };
            
            onHistoryUpdate(newRecord, []);
            
            window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
              detail: { 
                price: tempPrice, 
                symbol: 'XAUUSD',
                source: source
              }
            }));
            
            return tempPrice;
          }
        }
      }
    }

    if (debugMode) {
      console.warn('No price element found in DOM');
    }
    return null;
  } catch (error) {
    console.error('Error extracting price from DOM:', error);
    return null;
  }
};
