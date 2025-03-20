
import { AnalysisData } from "@/types/analysis";

/**
 * Calculate combined direction from multiple analysis results
 */
export const calculateCombinedDirection = (results: AnalysisData[]): "صاعد" | "هابط" | "محايد" => {
  if (!results.length) return "محايد";
  
  const directions = results.map(r => r.direction);
  const upCount = directions.filter(d => d === "صاعد").length;
  const downCount = directions.filter(d => d === "هابط").length;
  
  if (upCount > downCount) return "صاعد";
  if (downCount > upCount) return "هابط";
  return "محايد";
};

/**
 * Combine and sort targets from multiple analyses
 */
export const combineAndSortTargets = (results: AnalysisData[]): { price: number; expectedTime: Date; }[] => {
  // جمع جميع الأهداف من جميع التحليلات
  const allTargets = results.flatMap(r => {
    // التحقق من وجود الأهداف ومعالجة الحالة إذا كانت غير موجودة
    if (!r.targets || !Array.isArray(r.targets) || r.targets.length === 0) {
      console.log(`No targets found for analysis: ${r.pattern}`, r);
      return [];
    }
    
    console.log(`Found ${r.targets.length} targets for analysis: ${r.pattern}`);
    
    // تحويل الأهداف إلى الصيغة المطلوبة
    return r.targets.map(target => {
      if (typeof target === 'number') {
        // إذا كان الهدف رقمًا فقط (النمط القديم)
        return {
          price: target,
          expectedTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // افتراضيًا بعد 24 ساعة
        };
      } else if (target && typeof target === 'object') {
        // إذا كان الهدف كائنًا (النمط الجديد)
        const price = typeof target.price === 'number' ? target.price : parseFloat(String(target.price));
        
        let expectedTime = target.expectedTime;
        // التحقق من صحة التاريخ وإنشاء تاريخ جديد إذا لزم الأمر
        if (!expectedTime || !(expectedTime instanceof Date)) {
          expectedTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }
        
        return {
          price,
          expectedTime
        };
      }
      // إرجاع قيمة افتراضية إذا كان الهدف في هيكل غير متوقع
      return null;
    }).filter(Boolean); // حذف القيم الفارغة
  });
  
  console.log("All targets before grouping:", allTargets);
  
  if (!allTargets.length) {
    console.log("No valid targets found in any analysis");
    return [];
  }

  // تجميع الأهداف المتشابهة
  const groupedTargets = allTargets.reduce((groups: any[], target) => {
    const existingGroup = groups.find(g => 
      Math.abs(g.price - target.price) / target.price < 0.01
    );
    
    if (existingGroup) {
      existingGroup.prices.push(target.price);
      existingGroup.times.push(target.expectedTime);
    } else {
      groups.push({
        prices: [target.price],
        times: [target.expectedTime]
      });
    }
    return groups;
  }, []);

  // تحويل المجموعات إلى أهداف نهائية وترتيبها
  const finalTargets = groupedTargets
    .map(group => ({
      price: Number((group.prices.reduce((a: number, b: number) => a + b, 0) / group.prices.length).toFixed(2)),
      expectedTime: new Date(Math.max(...group.times.map((t: Date) => t.getTime())))
    }))
    .sort((a, b) => Math.abs(a.price) - Math.abs(b.price));
  
  console.log("Final grouped and sorted targets:", finalTargets);
  
  return finalTargets;
};

/**
 * Calculate weighted averages for important values
 */
export const calculateWeightedValues = (results: AnalysisData[]): {
  support: number;
  resistance: number;
  stopLoss: number;
  entryPrice: number;
} => {
  if (!results.length) {
    return { support: 0, resistance: 0, stopLoss: 0, entryPrice: 0 };
  }
  
  const weightedValues = results.reduce((acc, result, index) => {
    const weight = (results.length - index) / results.length;
    return {
      support: acc.support + (result.support * weight),
      resistance: acc.resistance + (result.resistance * weight),
      stopLoss: acc.stopLoss + (result.stopLoss * weight),
      entryPrice: acc.entryPrice + ((result.bestEntryPoint?.price || result.currentPrice) * weight),
      totalWeight: acc.totalWeight + weight
    };
  }, { support: 0, resistance: 0, stopLoss: 0, entryPrice: 0, totalWeight: 0 });

  return {
    support: Number((weightedValues.support / weightedValues.totalWeight).toFixed(2)),
    resistance: Number((weightedValues.resistance / weightedValues.totalWeight).toFixed(2)),
    stopLoss: Number((weightedValues.stopLoss / weightedValues.totalWeight).toFixed(2)),
    entryPrice: Number((weightedValues.entryPrice / weightedValues.totalWeight).toFixed(2))
  };
};
