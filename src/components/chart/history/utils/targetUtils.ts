
import { AnalysisData } from "@/types/analysis";

interface Target {
  price: number;
  expectedTime: Date;
}

export const processTargets = (analysis: AnalysisData, id: string, creationDate: Date): Target[] => {
  // طباعة تشخيصية
  console.log(`Processing targets for analysis ${id}:`, analysis.targets);
  
  // حالة 1: إذا كانت الأهداف غير موجودة أو فارغة
  if (!analysis.targets || 
     (Array.isArray(analysis.targets) && analysis.targets.length === 0) ||
     (typeof analysis.targets === 'object' && Object.keys(analysis.targets).length === 0)) {
    console.log(`No targets found for analysis ${id}, creating default targets`);
    
    // إنشاء أهداف افتراضية بناءً على الاتجاه والسعر الحالي
    if (analysis.direction && analysis.currentPrice) {
      const isUptrend = analysis.direction === "صاعد";
      const currentPrice = analysis.currentPrice;
      const now = new Date();
      
      console.log(`Creating default targets based on direction: ${analysis.direction} and price: ${currentPrice}`);
      
      return [
        {
          price: isUptrend ? currentPrice * 1.01 : currentPrice * 0.99,
          expectedTime: new Date(now.getTime() + 24 * 60 * 60 * 1000) // بعد يوم
        },
        {
          price: isUptrend ? currentPrice * 1.02 : currentPrice * 0.98,
          expectedTime: new Date(now.getTime() + 48 * 60 * 60 * 1000) // بعد يومين
        },
        {
          price: isUptrend ? currentPrice * 1.03 : currentPrice * 0.97,
          expectedTime: new Date(now.getTime() + 72 * 60 * 60 * 1000) // بعد 3 أيام
        }
      ];
    }
    
    return createFallbackTargets(analysis.currentPrice || 0, creationDate);
  }
  
  // حالة 2: إذا كان الهدف ليس مصفوفة (مثل رقم واحد أو كائن واحد)
  if (!Array.isArray(analysis.targets)) {
    console.log(`Targets is not an array for analysis ${id}, converting to array`);
    
    // إذا كان الهدف رقم بسيط
    if (typeof analysis.targets === 'number' || typeof analysis.targets === 'string') {
      const targetPrice = Number(analysis.targets);
      if (!isNaN(targetPrice)) {
        return [{
          price: targetPrice,
          expectedTime: new Date(creationDate.getTime() + 24 * 60 * 60 * 1000)
        }];
      }
    }
    
    // محاولة تحويل الهدف إلى مصفوفة إذا كان كائن
    if (typeof analysis.targets === 'object' && analysis.targets !== null) {
      const normalizedTarget = normalizeTarget(analysis.targets, creationDate);
      if (normalizedTarget) {
        return [normalizedTarget];
      }
    }
    
    return createFallbackTargets(analysis.currentPrice || 0, creationDate);
  }
  
  // حالة 3: الأهداف موجودة كمصفوفة - معالجة كل هدف
  console.log(`Found ${analysis.targets.length} targets for analysis ${id}`);
  
  const processedTargets = analysis.targets
    .map(target => normalizeTarget(target, creationDate))
    .filter(Boolean) as Target[];
  
  // إذا لم تنتج أي أهداف صالحة بعد المعالجة، استخدم أهداف افتراضية
  if (processedTargets.length === 0) {
    console.log(`No valid targets after processing for analysis ${id}, creating fallback targets`);
    return createFallbackTargets(analysis.currentPrice || 0, creationDate);
  }
  
  return processedTargets;
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
  
  // استخراج السعر بغض النظر عن المسار (price أو target أو value)
  let price: number | undefined;
  
  if ('price' in target && (typeof target.price === 'number' || typeof target.price === 'string')) {
    price = Number(target.price);
  } else if ('target' in target && (typeof target.target === 'number' || typeof target.target === 'string')) {
    price = Number(target.target);
  } else if ('value' in target && (typeof target.value === 'number' || typeof target.value === 'string')) {
    price = Number(target.value);
  }
  
  // إذا لم يكن هناك سعر صالح، تجاهل هذا الهدف
  if (price === undefined || isNaN(price)) {
    return null;
  }
  
  // استخراج الوقت المتوقع أو استخدام وقت افتراضي
  let expectedTime: Date;
  
  if ('expectedTime' in target && target.expectedTime) {
    if (target.expectedTime instanceof Date) {
      expectedTime = target.expectedTime;
    } else if (typeof target.expectedTime === 'string') {
      const parsedDate = new Date(target.expectedTime);
      expectedTime = isNaN(parsedDate.getTime()) 
        ? new Date(creationDate.getTime() + 24 * 60 * 60 * 1000)
        : parsedDate;
    } else {
      expectedTime = new Date(creationDate.getTime() + 24 * 60 * 60 * 1000);
    }
  } else if ('time' in target && target.time) {
    if (target.time instanceof Date) {
      expectedTime = target.time;
    } else if (typeof target.time === 'string') {
      const parsedDate = new Date(target.time);
      expectedTime = isNaN(parsedDate.getTime()) 
        ? new Date(creationDate.getTime() + 24 * 60 * 60 * 1000)
        : parsedDate;
    } else {
      expectedTime = new Date(creationDate.getTime() + 24 * 60 * 60 * 1000);
    }
  } else {
    expectedTime = new Date(creationDate.getTime() + 24 * 60 * 60 * 1000);
  }
  
  return { price, expectedTime };
}

// وظيفة لإنشاء أهداف افتراضية
function createFallbackTargets(currentPrice: number, creationDate: Date): Target[] {
  if (!currentPrice || isNaN(currentPrice) || currentPrice === 0) {
    console.log("Cannot create fallback targets with invalid current price");
    return [];
  }
  
  const now = new Date();
  
  return [
    {
      price: Number((currentPrice * 1.01).toFixed(2)),
      expectedTime: new Date(now.getTime() + 24 * 60 * 60 * 1000) // بعد يوم
    },
    {
      price: Number((currentPrice * 1.02).toFixed(2)),
      expectedTime: new Date(now.getTime() + 48 * 60 * 60 * 1000) // بعد يومين
    },
    {
      price: Number((currentPrice * 1.03).toFixed(2)),
      expectedTime: new Date(now.getTime() + 72 * 60 * 60 * 1000) // بعد 3 أيام
    }
  ];
}
