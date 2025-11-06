/**
 * مفاتيح التخزين المحلي للأسعار
 */
const STORAGE_KEYS = {
  CURRENT_PRICE: 'gold_current_price',
  LAST_UPDATE: 'gold_price_last_update',
  PRICE_HISTORY: 'gold_price_history'
} as const;

/**
 * حفظ السعر الحالي في التخزين المحلي
 */
export const saveCurrentPrice = (price: number): void => {
  try {
    const timestamp = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.CURRENT_PRICE, price.toString());
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, timestamp);
    
    // حفظ في سجل الأسعار
    saveToPriceHistory(price, timestamp);
    
    console.log(`تم حفظ السعر ${price} في التخزين المحلي`);
  } catch (error) {
    console.error('خطأ في حفظ السعر في التخزين المحلي:', error);
  }
};

/**
 * استرجاع السعر الحالي من التخزين المحلي
 */
export const getCurrentPrice = (): { price: number | null; lastUpdate: string | null } => {
  try {
    const priceStr = localStorage.getItem(STORAGE_KEYS.CURRENT_PRICE);
    const lastUpdate = localStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
    
    if (priceStr) {
      const price = parseFloat(priceStr);
      if (!isNaN(price)) {
        console.log(`تم استرجاع السعر ${price} من التخزين المحلي`);
        return { price, lastUpdate };
      }
    }
    
    return { price: null, lastUpdate: null };
  } catch (error) {
    console.error('خطأ في استرجاع السعر من التخزين المحلي:', error);
    return { price: null, lastUpdate: null };
  }
};

/**
 * حفظ السعر في سجل الأسعار التاريخي (آخر 10 أسعار)
 */
const saveToPriceHistory = (price: number, timestamp: string): void => {
  try {
    const historyStr = localStorage.getItem(STORAGE_KEYS.PRICE_HISTORY);
    let history: Array<{ price: number; timestamp: string }> = [];
    
    if (historyStr) {
      history = JSON.parse(historyStr);
    }
    
    // إضافة السعر الجديد
    history.unshift({ price, timestamp });
    
    // الحفاظ على آخر 10 أسعار فقط
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
    
    localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('خطأ في حفظ سجل الأسعار:', error);
  }
};

/**
 * استرجاع سجل الأسعار التاريخي
 */
export const getPriceHistory = (): Array<{ price: number; timestamp: string }> => {
  try {
    const historyStr = localStorage.getItem(STORAGE_KEYS.PRICE_HISTORY);
    if (historyStr) {
      return JSON.parse(historyStr);
    }
    return [];
  } catch (error) {
    console.error('خطأ في استرجاع سجل الأسعار:', error);
    return [];
  }
};

/**
 * مسح جميع بيانات الأسعار من التخزين المحلي
 */
export const clearPriceStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PRICE);
    localStorage.removeItem(STORAGE_KEYS.LAST_UPDATE);
    localStorage.removeItem(STORAGE_KEYS.PRICE_HISTORY);
    console.log('تم مسح بيانات الأسعار من التخزين المحلي');
  } catch (error) {
    console.error('خطأ في مسح بيانات الأسعار:', error);
  }
};

/**
 * التحقق من صلاحية السعر المخزن (خلال 24 ساعة)
 */
export const isStoredPriceValid = (): boolean => {
  try {
    const lastUpdate = localStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
    if (!lastUpdate) return false;
    
    const lastUpdateTime = new Date(lastUpdate).getTime();
    const now = new Date().getTime();
    const hoursDiff = (now - lastUpdateTime) / (1000 * 60 * 60);
    
    // السعر صالح لمدة 24 ساعة
    return hoursDiff < 24;
  } catch (error) {
    console.error('خطأ في التحقق من صلاحية السعر:', error);
    return false;
  }
};
