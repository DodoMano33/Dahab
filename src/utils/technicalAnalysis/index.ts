
// تصدير جميع وحدات التحليل الفني من نقطة دخول واحدة
// ترتيب التصدير مهم لتجنب تضارب الاسماء

// تصدير المؤشرات الفنية بشكل مباشر
import * as indicators from './indicators';
export { indicators };

// تصدير النماذج والأنماط من وحدات الإطار الزمني
import * as timeframe from './timeframe';
export { timeframe };

// تصدير أدوات فيبوناتشي
import * as fibonacci from './fibonacci';
export { fibonacci };

// تصدير وحدات تحليل الأسعار
import * as priceAnalysis from './priceAnalysis';
export { priceAnalysis };

// تصدير وحدات الحسابات العامة
import * as calculations from './calculations';
export { calculations };

// تصدير وحدات الوقت
import * as timeUtils from './timeUtils';
export { timeUtils };

// تصدير وحدات التعلم الآلي والتنبؤ
import * as mlPrediction from './mlPrediction';
export { mlPrediction };

// تصدير بعض الدوال المهمة بشكل مباشر للاستخدام السهل
export { getExpectedTime } from './timeUtils';
export { getTimeframeMultipliers } from './timeframeMultipliers';

// تصدير بعض الفئات المهمة من وحدات المؤشرات للتوافق مع الكود القديم
export { 
  detectTrend,
  calculateSupportResistance,
  calculateFibonacciLevels
} from './indicators/PriceData';
