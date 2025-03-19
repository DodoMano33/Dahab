
// ملف وسيط للحفاظ على التوافق مع الشيفرة الحالية

// تصدير الوظائف من الوحدات المتخصصة
export { getCachedPrice, setCachedPrice } from './cache';
export { fetchCryptoPrice } from './crypto';
export { fetchForexPrice } from './forex';
export { fetchPreciousMetalPrice } from './preciousMetals';
export { fetchPriceFromMetalPriceApi } from './metalPriceApi';
