
import { AnalysisData } from "@/types/analysis";

interface Target {
  price: number;
  expectedTime: Date;
}

export const processTargets = (analysis: AnalysisData, id: string, creationDate: Date): Target[] => {
  // طباعة تشخيصية
  console.log(`Processing targets for analysis ${id}:`, analysis.targets);
  
  if (!analysis.targets) {
    console.log(`No targets found for analysis ${id}, creating default targets`);
    
    // إنشاء أهداف افتراضية بناءً على الاتجاه والسعر الحالي
    if (analysis.direction && analysis.currentPrice) {
      const isUptrend = analysis.direction === "صاعد";
      const now = new Date();
      
      return [
        {
          price: isUptrend ? analysis.currentPrice * 1.01 : analysis.currentPrice * 0.99,
          expectedTime: new Date(now.getTime() + 24 * 60 * 60 * 1000) // بعد يوم
        },
        {
          price: isUptrend ? analysis.currentPrice * 1.02 : analysis.currentPrice * 0.98,
          expectedTime: new Date(now.getTime() + 48 * 60 * 60 * 1000) // بعد يومين
        }
      ];
    }
    
    return [];
  }
  
  if (!Array.isArray(analysis.targets)) {
    console.log(`Targets is not an array for analysis ${id}, converting to array`);
    
    // محاولة تحويل الهدف إلى مصفوفة إذا لم يكن مصفوفة
    const singleTarget = analysis.targets;
    if (typeof singleTarget === 'object' && singleTarget !== null) {
      return [normalizeTarget(singleTarget, creationDate)].filter(Boolean) as Target[];
    } else if (typeof singleTarget === 'number') {
      return [{
        price: singleTarget,
        expectedTime: new Date(creationDate.getTime() + 24 * 60 * 60 * 1000)
      }];
    }
    
    return [];
  }
  
  console.log(`Found ${analysis.targets.length} targets for analysis ${id}`);
  
  return analysis.targets
    .map(target => normalizeTarget(target, creationDate))
    .filter(Boolean) as Target[];
};

// وظيفة مساعدة لتوحيد تنسيق الهدف
function normalizeTarget(target: any, creationDate: Date): Target | null {
  // إذا كان الهدف رقمًا مباشرًا
  if (typeof target === 'number' && !isNaN(target)) {
    return {
      price: target,
      expectedTime: new Date(creationDate.getTime() + 24 * 60 * 60 * 1000) // افتراضيًا بعد 24 ساعة
    };
  }
  
  // إذا كان الهدف نصًا رقميًا
  if (typeof target === 'string' && !isNaN(Number(target))) {
    return {
      price: Number(target),
      expectedTime: new Date(creationDate.getTime() + 24 * 60 * 60 * 1000)
    };
  }
  
  // إذا كان الهدف ليس كائنًا صالحًا
  if (!target || typeof target !== 'object') {
    return null;
  }
  
  let price: number | undefined;
  let expectedTime: Date | undefined;
  
  // استخراج السعر
  if ('price' in target) {
    if (typeof target.price === 'number' && !isNaN(target.price)) {
      price = target.price;
    } else if (typeof target.price === 'string' && !isNaN(Number(target.price))) {
      price = Number(target.price);
    }
  }
  
  // إذا لم يكن هناك سعر صالح، تجاهل هذا الهدف
  if (price === undefined) {
    return null;
  }
  
  // استخراج الوقت المتوقع
  if ('expectedTime' in target && target.expectedTime) {
    if (target.expectedTime instanceof Date) {
      expectedTime = target.expectedTime;
    } else if (typeof target.expectedTime === 'string') {
      expectedTime = new Date(target.expectedTime);
      if (isNaN(expectedTime.getTime())) {
        expectedTime = new Date(creationDate.getTime() + 24 * 60 * 60 * 1000);
      }
    }
  }
  
  // إذا لم يكن هناك وقت متوقع، استخدم الافتراضي
  if (!expectedTime) {
    expectedTime = new Date(creationDate.getTime() + 24 * 60 * 60 * 1000);
  }
  
  return { price, expectedTime };
}
