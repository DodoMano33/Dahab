
import { cleanPriceText, validatePriceWithHistory } from '../utils/priceTextCleaner';

/**
 * استخراج السعر من العناصر المرئية في الصفحة
 */
export const extractPriceFromVisibleElements = (
  lastValidPrice: number | null,
  debugMode: boolean
): { price: number | null, method: string } => {
  try {
    // البحث عن العناصر المرئية في الصفحة
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
        
        return { 
          price: validatedVisiblePrice, 
          method: 'visible elements'
        };
      }
    }
    
    return { price: null, method: '' };
  } catch (error) {
    console.error('Error extracting price from visible elements:', error);
    return { price: null, method: '' };
  }
};
