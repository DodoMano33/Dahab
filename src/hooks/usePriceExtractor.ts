
import { useState, useEffect, useRef, useCallback } from 'react';
import { PriceRecord, PriceExtractorOptions } from '@/components/chart/price-extractor/types';

interface PriceExtractionResult {
  price: number | null;
  lastUpdated: Date | null;
  source: string;
  isExtracting: boolean;
  priceHistory: PriceRecord[];
  clearHistory: () => void;
  extractPriceFromDOM: () => number | null;
  setCustomSelectors: (selectors: string[]) => void;
}

// محددات لاستخراج السعر من DOM
const DEFAULT_PRICE_SELECTORS = [
  // سعر كبير في الزاوية اليمنى
  '.tv-symbol-price-quote__value',
  '.js-symbol-last',
  '.chart-page-price',
  '.pane-legend-line__value',
  '.onchart-info-top-right',
  // تحديد أكثر تفصيلًا بناءً على الموقع في الشاشة
  'div[data-name="legend-source-item"] .js-symbol-last',
  'div[data-name="legend-series-item"] .js-symbol-last',
  // العناصر الخاصة بمنطقة السعر المحاطة بدائرة
  '.chart-status-wrapper .price',
  '.chart-info-price-text',
  '.chart-container .price-value',
  '.chart-container .big-price',
  // محددات إضافية للعناصر التي قد تحتوي على السعر
  '.price-value', 
  '.price-display',
  '.current-price',
  '.chart-overlay-price',
  '.price-indicator'
];

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
  const extractionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [priceSelectors, setPriceSelectors] = useState<string[]>([
    ...DEFAULT_PRICE_SELECTORS,
    ...customSelectors
  ]);

  // وظيفة لتحديث المحددات المخصصة
  const setCustomSelectors = useCallback((selectors: string[]) => {
    setPriceSelectors([...DEFAULT_PRICE_SELECTORS, ...selectors]);
    if (debugMode) {
      console.log('Updated custom selectors:', selectors);
    }
  }, [debugMode]);

  const clearHistory = useCallback(() => {
    setPriceHistory([]);
  }, []);

  // وظيفة لتنظيف النص واستخراج السعر
  const cleanPriceText = useCallback((text: string): number | null => {
    try {
      // إزالة أي نص غير رقمي ماعدا النقطة والفاصلة
      let cleanedText = text.replace(/[^\d.,]/g, '');
      
      // استبدال الفواصل بنقاط للحصول على رقم صالح
      cleanedText = cleanedText.replace(/,/g, '.');
      
      // الحصول على الرقم الأول في النص (في حالة وجود أكثر من رقم)
      const match = cleanedText.match(/\d+\.\d+/);
      if (match) {
        const extractedPrice = parseFloat(match[0]);
        if (!isNaN(extractedPrice) && extractedPrice > 0) {
          return extractedPrice;
        }
      } else {
        // محاولة تحويل النص بالكامل إلى رقم إذا لم يكن هناك تطابق
        const fullNumber = parseFloat(cleanedText);
        if (!isNaN(fullNumber) && fullNumber > 0) {
          return fullNumber;
        }
      }
    } catch (error) {
      if (debugMode) {
        console.error('Error cleaning price text:', error, text);
      }
    }
    
    return null;
  }, [debugMode]);

  // وظيفة استخراج السعر من DOM
  const extractPriceFromDOM = useCallback(() => {
    try {
      setIsExtracting(true);
      if (debugMode) {
        console.log('Extracting price from DOM with selectors:', priceSelectors);
      }

      // البحث عن عنصر سعر الذهب في DOM
      let priceElement: Element | null = null;
      let foundSelector = '';
      let highestPriority = -1;

      // أولاً نجرب المحددات ذات الأولوية
      for (let priority = 0; priority < priceSelectors.length; priority++) {
        const selector = priceSelectors[priority];
        const elements = document.querySelectorAll(selector);
        
        for (const element of Array.from(elements)) {
          const text = element.textContent;
          if (text && /\d+[,.]?\d*/.test(text)) {
            const extractedPrice = cleanPriceText(text);
            if (extractedPrice !== null) {
              // تحديث أعلى أولوية فقط إذا كانت الأولوية الحالية أعلى
              if (priority > highestPriority) {
                priceElement = element;
                foundSelector = selector;
                highestPriority = priority;
                
                if (debugMode) {
                  console.log(`Found price element with selector: ${selector}, priority: ${priority}, price: ${extractedPrice}`);
                }
                
                // لا نقوم بالخروج فوراً، بل نواصل البحث عن محدد ذو أولوية أعلى
              }
            }
          }
        }
      }

      // استخراج السعر من نص العنصر
      if (priceElement && priceElement.textContent) {
        const extractedPrice = cleanPriceText(priceElement.textContent);
        
        if (extractedPrice !== null) {
          if (debugMode) {
            console.log(`Successfully extracted price: ${extractedPrice} from selector: ${foundSelector}`);
          }
          
          setPrice(extractedPrice);
          setLastUpdated(new Date());
          setSource(`DOM Extraction (${foundSelector})`);
          
          // إضافة السعر الجديد إلى سجل الأسعار
          const newRecord: PriceRecord = {
            price: extractedPrice,
            timestamp: new Date(),
            source: `DOM Extraction (${foundSelector})`
          };
          
          setPriceHistory(prevHistory => {
            // حذف أقدم السجلات إذا تجاوز العدد الحد الأقصى
            const updatedHistory = [newRecord, ...prevHistory];
            return updatedHistory.slice(0, maxHistorySize);
          });
          
          // إرسال حدث بالسعر المستخرج
          window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
            detail: { 
              price: extractedPrice, 
              symbol: 'XAUUSD',
              source: `DOM Extraction (${foundSelector})`
            }
          }));
          
          setIsExtracting(false);
          return extractedPrice;
        }
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
                   /\d+[,.]?\d*/.test(el.textContent);
          });
        
        for (const element of visibleElements) {
          const text = element.textContent;
          if (text) {
            const extractedPrice = cleanPriceText(text);
            if (extractedPrice !== null) {
              if (debugMode) {
                console.log(`Found price in visible element: ${element.tagName}, price: ${extractedPrice}`);
              }
              
              setPrice(extractedPrice);
              setLastUpdated(new Date());
              setSource(`DOM Extraction (visible element)`);
              
              // إضافة السعر الجديد إلى سجل الأسعار
              const newRecord: PriceRecord = {
                price: extractedPrice,
                timestamp: new Date(),
                source: `DOM Extraction (visible element)`
              };
              
              setPriceHistory(prevHistory => {
                const updatedHistory = [newRecord, ...prevHistory];
                return updatedHistory.slice(0, maxHistorySize);
              });
              
              window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
                detail: { 
                  price: extractedPrice, 
                  symbol: 'XAUUSD',
                  source: `DOM Extraction (visible element)`
                }
              }));
              
              setIsExtracting(false);
              return extractedPrice;
            }
          }
        }
      }

      if (debugMode) {
        console.warn('No price element found in DOM');
      }
      setIsExtracting(false);
      return null;
    } catch (error) {
      console.error('Error extracting price from DOM:', error);
      setIsExtracting(false);
      return null;
    }
  }, [priceSelectors, cleanPriceText, debugMode, maxHistorySize]);

  // تشغيل استخراج السعر على فترات منتظمة
  useEffect(() => {
    if (!enabled) return;

    if (debugMode) {
      console.log(`Setting up price extraction interval: ${interval}ms`);
    }
    
    // استخراج السعر فورًا عند التحميل
    if (extractOnMount) {
      extractPriceFromDOM();
    }
    
    // إعداد استخراج السعر على فترات منتظمة
    extractionTimerRef.current = setInterval(extractPriceFromDOM, interval);
    
    return () => {
      if (extractionTimerRef.current) {
        clearInterval(extractionTimerRef.current);
        extractionTimerRef.current = null;
      }
    };
  }, [interval, enabled, extractPriceFromDOM, extractOnMount, debugMode]);

  return {
    price,
    lastUpdated,
    source,
    isExtracting,
    priceHistory,
    clearHistory,
    extractPriceFromDOM,
    setCustomSelectors
  };
};
