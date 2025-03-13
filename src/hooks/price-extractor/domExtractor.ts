
import { PriceRecord } from '@/components/chart/price-extractor/types';
import { DEFAULT_PRICE_SELECTORS } from './types';
import { validatePriceWithHistory } from './utils/priceTextCleaner';
import { extractPriceElement } from './extractors/priceElementExtractor';
import { extractPriceWithConsensus } from './extractors/consensusExtractor';
import { extractPriceFromVisibleElements } from './extractors/visibleElementsExtractor';
import { handlePriceFound } from './utils/eventDispatcher';

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

    // الطريقة 1: استخراج عنصر السعر من DOM
    const { extractedPrice, foundSelector, foundPrices } = extractPriceElement(priceSelectors, debugMode);

    // تحقق إضافي 1: مقارنة السعر مع التاريخ السابق للتأكد من صحته
    if (extractedPrice !== null) {
      const validatedPrice = validatePriceWithHistory(extractedPrice, lastValidPrice, 5, debugMode);
      
      if (validatedPrice !== null) {
        if (debugMode) {
          console.log(`Successfully extracted and validated price: ${validatedPrice} from selector: ${foundSelector}`);
        }
        
        const source = `DOM Extraction (${foundSelector})`;
        handlePriceFound(validatedPrice, source, onPriceFound, onHistoryUpdate);
        
        return validatedPrice;
      } else if (debugMode) {
        console.warn(`Price ${extractedPrice} failed validation with history`);
      }
    }

    // الطريقة 2: استخراج السعر بطريقة "الإجماع" من خلال مقارنة عدة أسعار
    const { price: consensusPrice, method: consensusMethod } = extractPriceWithConsensus(
      foundPrices,
      lastValidPrice,
      debugMode
    );
    
    if (consensusPrice !== null) {
      const source = `DOM Extraction (${consensusMethod})`;
      handlePriceFound(consensusPrice, source, onPriceFound, onHistoryUpdate);
      
      return consensusPrice;
    }

    // الطريقة 3: استخراج السعر من العناصر المرئية في الصفحة
    const { price: visiblePrice, method: visibleMethod } = extractPriceFromVisibleElements(
      lastValidPrice,
      debugMode
    );
    
    if (visiblePrice !== null) {
      const source = `DOM Extraction (${visibleMethod})`;
      handlePriceFound(visiblePrice, source, onPriceFound, onHistoryUpdate);
      
      return visiblePrice;
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
