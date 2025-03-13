
import { validatePriceWithHistory } from '../utils/priceTextCleaner';

/**
 * استخراج السعر بطريقة "الإجماع" من خلال مقارنة عدة أسعار مستخرجة
 */
export const extractPriceWithConsensus = (
  foundPrices: {price: number, selector: string, priority: number}[],
  lastValidPrice: number | null,
  debugMode: boolean
): { price: number | null, method: string } => {
  
  if (foundPrices.length < 2) {
    return { price: null, method: '' };
  }
  
  // ترتيب الأسعار
  const sortedPrices = [...foundPrices].sort((a, b) => a.price - b.price);
  
  // استخدام متوسط الأسعار أو القيمة الوسطى
  if (sortedPrices.length % 2 === 0) {
    // متوسط القيمتين الوسطيتين إذا كان العدد زوجيًا
    const middle1 = sortedPrices[Math.floor(sortedPrices.length / 2) - 1].price;
    const middle2 = sortedPrices[Math.floor(sortedPrices.length / 2)].price;
    const consensusPrice = (middle1 + middle2) / 2;
    
    // التحقق من السعر مع التاريخ
    const validatedConsensus = validatePriceWithHistory(consensusPrice, lastValidPrice, 5, debugMode);
    
    if (validatedConsensus !== null) {
      if (debugMode) {
        console.log(`Using consensus price (even): ${validatedConsensus}`);
      }
      
      return { 
        price: validatedConsensus, 
        method: 'consensus'
      };
    }
  } else {
    // استخدام القيمة الوسطى إذا كان العدد فرديًا
    const medianPrice = sortedPrices[Math.floor(sortedPrices.length / 2)].price;
    
    // التحقق من السعر مع التاريخ
    const validatedMedian = validatePriceWithHistory(medianPrice, lastValidPrice, 5, debugMode);
    
    if (validatedMedian !== null) {
      if (debugMode) {
        console.log(`Using median price: ${validatedMedian}`);
      }
      
      return { 
        price: validatedMedian, 
        method: 'median'
      };
    }
  }
  
  return { price: null, method: '' };
};
