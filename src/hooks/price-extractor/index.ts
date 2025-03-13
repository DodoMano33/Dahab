
import { useState, useCallback, useRef } from 'react';
import { PriceRecord } from '@/components/chart/price-extractor/types';
import { PriceExtractionResult, PriceExtractorOptions, DEFAULT_PRICE_SELECTORS } from './types';
import { extractPriceFromDOM } from './domExtractor';
import { useExtractionTimer } from './hooks/useExtractionTimer';

/**
 * هوك محسن لاستخراج السعر
 * يتضمن عدة طرق للتحقق من صحة السعر
 */
export const usePriceExtractor = (
  options: PriceExtractorOptions = {}
): PriceExtractionResult => {
  // استخراج الخيارات مع القيم الافتراضية
  const {
    interval = 10000,
    enabled = true,
    maxHistorySize = 1000,
    customSelectors = [],
    extractOnMount = true,
    debugMode = false
  } = options;

  const [price, setPrice] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [source, setSource] = useState<string>('DOM Extraction');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [priceHistory, setPriceHistory] = useState<PriceRecord[]>([]);
  const [priceSelectors, setPriceSelectors] = useState<string[]>([
    ...DEFAULT_PRICE_SELECTORS,
    ...customSelectors
  ]);
  
  // إضافة مرجع للقيمة الأخيرة الصالحة للسعر للمساعدة في تصفية الأسعار غير المنطقية
  const lastValidPriceRef = useRef<number | null>(null);

  // وظيفة لتحديث المحددات المخصصة
  const setCustomSelectors = useCallback((selectors: string[]) => {
    setPriceSelectors([...DEFAULT_PRICE_SELECTORS, ...selectors]);
    if (debugMode) {
      console.log('Updated custom selectors:', selectors);
    }
  }, [debugMode]);

  // وظيفة لمسح سجل الأسعار
  const clearHistory = useCallback(() => {
    setPriceHistory([]);
  }, []);

  // معالج تحديث سجل الأسعار
  const handleHistoryUpdate = useCallback((newRecord: PriceRecord, prevHistory: PriceRecord[]) => {
    setPriceHistory(prevHistory => {
      const updatedHistory = [newRecord, ...prevHistory];
      return updatedHistory.slice(0, maxHistorySize);
    });
  }, [maxHistorySize]);

  // معالج محسن للعثور على سعر
  const handlePriceFound = useCallback((foundPrice: number, foundSource: string) => {
    // تحديث قيمة السعر الصالحة الأخيرة للمقارنات المستقبلية
    lastValidPriceRef.current = foundPrice;
    
    setPrice(foundPrice);
    setLastUpdated(new Date());
    setSource(foundSource);
    
    if (debugMode) {
      console.log(`Price updated to ${foundPrice} from ${foundSource}`);
    }
  }, [debugMode]);

  // وظيفة استخراج السعر الرئيسية المحسنة
  const extractPriceWrapper = useCallback(() => {
    setIsExtracting(true);
    
    // إضافة آخر سعر صالح للمساعدة في التحقق من صحة الأسعار الجديدة
    const result = extractPriceFromDOM({
      priceSelectors,
      debugMode,
      onPriceFound: handlePriceFound,
      maxHistorySize,
      onHistoryUpdate: handleHistoryUpdate,
      lastValidPrice: lastValidPriceRef.current
    });
    
    setIsExtracting(false);
    return result;
  }, [priceSelectors, debugMode, handlePriceFound, maxHistorySize, handleHistoryUpdate]);

  // استخدام هوك مؤقت الاستخراج
  useExtractionTimer({
    interval,
    enabled,
    extractOnMount,
    debugMode,
    extractFunction: extractPriceWrapper
  });

  return {
    price,
    lastUpdated,
    source,
    isExtracting,
    priceHistory,
    clearHistory,
    extractPriceFromDOM: extractPriceWrapper,
    setCustomSelectors
  };
};
