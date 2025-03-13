
import { useState, useEffect, useRef } from 'react';

interface PriceExtractionResult {
  price: number | null;
  lastUpdated: Date | null;
  source: string;
  isExtracting: boolean;
}

export const usePriceExtractor = (
  interval: number = 10000, // الفاصل الزمني بالمللي ثانية (10 ثوانٍ افتراضيًا)
  enabled: boolean = true
): PriceExtractionResult => {
  const [price, setPrice] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [source, setSource] = useState<string>('DOM Extraction');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const extractionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // وظيفة استخراج السعر من DOM
  const extractPriceFromDOM = () => {
    try {
      setIsExtracting(true);
      console.log('Extracting price from DOM...');

      // البحث عن عنصر سعر الذهب في DOM (محددات مختلفة للعثور على العنصر الصحيح)
      const priceSelectors = [
        // سعر كبير في الزاوية اليمنى (كما في الصورة)
        '.tv-symbol-price-quote__value',
        '.js-symbol-last',
        '.chart-page-price',
        '.pane-legend-line__value',
        '.onchart-info-top-right',
        // تحديد أكثر تفصيلًا بناءً على الموقع في الشاشة
        'div[data-name="legend-source-item"] .js-symbol-last',
        'div[data-name="legend-series-item"] .js-symbol-last',
        // العناصر الخاصة بمنطقة السعر المحاطة بدائرة في الصورة
        '.chart-status-wrapper .price',
        '.chart-info-price-text',
        '.chart-container .price-value',
        '.chart-container .big-price'
      ];

      // تجربة جميع المحددات حتى نعثر على عنصر السعر
      let priceElement: Element | null = null;
      let foundSelector = '';

      for (const selector of priceSelectors) {
        const elements = document.querySelectorAll(selector);
        for (const element of Array.from(elements)) {
          const text = element.textContent;
          if (text && /\d+[,.]?\d*/.test(text)) {
            priceElement = element;
            foundSelector = selector;
            break;
          }
        }
        if (priceElement) break;
      }

      // استخراج السعر من نص العنصر
      if (priceElement && priceElement.textContent) {
        let priceText = priceElement.textContent.trim();
        
        // إزالة أي نص غير رقمي ماعدا النقطة والفاصلة
        priceText = priceText.replace(/[^\d.,]/g, '');
        
        // استبدال الفواصل بنقاط للحصول على رقم صالح
        priceText = priceText.replace(/,/g, '.');
        
        // الحصول على الرقم الأول في النص (في حالة وجود أكثر من رقم)
        const match = priceText.match(/\d+\.\d+/);
        const extractedPrice = match ? parseFloat(match[0]) : null;
        
        if (extractedPrice && !isNaN(extractedPrice)) {
          console.log(`Successfully extracted price: ${extractedPrice} from selector: ${foundSelector}`);
          setPrice(extractedPrice);
          setLastUpdated(new Date());
          setSource(`DOM Extraction (${foundSelector})`);
          
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

      console.warn('No price element found in DOM');
      setIsExtracting(false);
      return null;
    } catch (error) {
      console.error('Error extracting price from DOM:', error);
      setIsExtracting(false);
      return null;
    }
  };

  // تشغيل استخراج السعر على فترات منتظمة
  useEffect(() => {
    if (!enabled) return;

    console.log(`Setting up price extraction interval: ${interval}ms`);
    
    // استخراج السعر فورًا عند التحميل
    extractPriceFromDOM();
    
    // إعداد استخراج السعر على فترات منتظمة
    extractionTimerRef.current = setInterval(extractPriceFromDOM, interval);
    
    return () => {
      if (extractionTimerRef.current) {
        clearInterval(extractionTimerRef.current);
        extractionTimerRef.current = null;
      }
    };
  }, [interval, enabled]);

  return {
    price,
    lastUpdated,
    source,
    isExtracting
  };
};
