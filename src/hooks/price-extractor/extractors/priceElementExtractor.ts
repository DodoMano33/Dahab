
import { DEFAULT_PRICE_SELECTORS } from '../types';
import { cleanPriceText } from '../utils/priceTextCleaner';

/**
 * استخراج عنصر السعر من DOM باستخدام محددات الأولوية
 */
export const extractPriceElement = (
  priceSelectors: string[],
  debugMode: boolean
): {
  extractedPrice: number | null;
  foundSelector: string;
  priceElement: Element | null;
  highestPriority: number;
  foundPrices: {price: number, selector: string, priority: number}[];
} => {
  let priceElement: Element | null = null;
  let foundSelector = '';
  let highestPriority = -1;
  let extractedPrice: number | null = null;
  let foundPrices: {price: number, selector: string, priority: number}[] = [];

  try {
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

    return {
      extractedPrice,
      foundSelector,
      priceElement,
      highestPriority,
      foundPrices
    };
  } catch (error) {
    console.error('Error extracting price elements:', error);
    return {
      extractedPrice: null,
      foundSelector: '',
      priceElement: null,
      highestPriority: -1,
      foundPrices: []
    };
  }
};
