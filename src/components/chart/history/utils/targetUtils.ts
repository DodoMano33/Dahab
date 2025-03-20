
import { AnalysisData } from "@/types/analysis";

interface Target {
  price: number;
  expectedTime: Date;
}

export const processTargets = (analysis: AnalysisData, id: string, creationDate: Date): Target[] => {
  if (!analysis.targets) {
    console.log(`No targets found for analysis ${id}, creating default empty array`);
    return [];
  }
  
  if (!Array.isArray(analysis.targets)) {
    console.log(`Targets is not an array for analysis ${id}, converting to array`);
    return [];
  }
  
  console.log(`Found ${analysis.targets.length} targets for analysis ${id}`);
  
  return analysis.targets
    .map(target => {
      if (typeof target === 'number') {
        // تحويل الرقم إلى كائن هدف
        return {
          price: target,
          expectedTime: new Date(creationDate.getTime() + 24 * 60 * 60 * 1000) // افتراضيًا بعد 24 ساعة
        };
      }
      
      if (!target || typeof target !== 'object') {
        return null;
      }
      
      // التأكد من وجود سعر
      if (target.price === undefined || target.price === null) {
        return null;
      }
      
      // التأكد من وجود تاريخ متوقع
      if (!target.expectedTime) {
        return {
          ...target,
          expectedTime: new Date(creationDate.getTime() + 24 * 60 * 60 * 1000)
        };
      }
      
      return target;
    })
    .filter(Boolean) as Target[];
};
