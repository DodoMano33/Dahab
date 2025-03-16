
/**
 * مكون متخصص لبث أحداث تحديث الأسعار
 */

/**
 * بث تحديث سعر الذهب إلى جميع المستمعين
 */
export const broadcastGoldPriceUpdate = (price: number, symbol: string = 'CFI:XAUUSD', source: string = 'alphavantage') => {
  const timestamp = Date.now();
  
  // نشر السعر بجميع أنواع الأحداث المتاحة
  
  // 1. تحديث بمصدر محدد لإعطائه أولوية عالية
  window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
    detail: { 
      price,
      symbol,
      timestamp,
      source
    }
  }));
  
  // 2. تحديث كاستجابة للسعر الحالي
  window.dispatchEvent(new CustomEvent('current-price-response', { 
    detail: { 
      price,
      symbol,
      timestamp,
      source
    }
  }));
  
  // 3. تحديث كسعر مباشر من الشارت
  window.dispatchEvent(new CustomEvent('chart-price-update', { 
    detail: { 
      price,
      symbol,
      timestamp,
      source
    }
  }));
  
  // 4. إصدار حدث جديد مخصص لتحديث السعر المستخرج
  window.dispatchEvent(new CustomEvent('extracted-price-update', { 
    detail: { 
      price,
      symbol,
      timestamp,
      source
    }
  }));
  
  console.log(`تم بث تحديث سعر الذهب: ${price} لجميع المستمعين (المصدر: ${source})`);
};
