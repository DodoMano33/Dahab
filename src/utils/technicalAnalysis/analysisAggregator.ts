
import { AnalysisData } from "@/types/analysis";

/**
 * Calculate a weighted average value from multiple analyses
 */
export const calculateWeightedValues = (analyses: AnalysisData[]) => {
  console.log("Calculating weighted values from", analyses.length, "analyses");
  
  // تجميع القيم من جميع التحليلات
  let totalSupport = 0;
  let totalResistance = 0;
  let totalStopLoss = 0;
  let totalEntryPrice = 0;
  let entryPointCount = 0;
  
  // معالجة قيم من جميع التحليلات
  for (const analysis of analyses) {
    totalSupport += analysis.support || 0;
    totalResistance += analysis.resistance || 0;
    totalStopLoss += analysis.stopLoss || 0;
    
    // جمع نقاط الدخول إذا كانت موجودة
    if (analysis.bestEntryPoint && analysis.bestEntryPoint.price) {
      console.log(`Analysis includes entry point: ${analysis.bestEntryPoint.price}`);
      totalEntryPrice += analysis.bestEntryPoint.price;
      entryPointCount++;
    } else {
      console.log("Analysis does not include a valid entry point");
    }
  }
  
  // حساب القيم المتوسطة
  const count = analyses.length;
  const support = Number((totalSupport / count).toFixed(4));
  const resistance = Number((totalResistance / count).toFixed(4));
  const stopLoss = Number((totalStopLoss / count).toFixed(4));
  
  // حساب سعر الدخول المثالي
  let entryPrice: number;
  
  if (entryPointCount > 0) {
    // إذا كان هناك نقاط دخول صالحة، استخدم متوسطها
    entryPrice = Number((totalEntryPrice / entryPointCount).toFixed(4));
    console.log(`Calculated best entry price from ${entryPointCount} points: ${entryPrice}`);
  } else {
    // إذا لم توجد نقاط دخول، استخدم السعر الحالي
    const currentPrice = analyses[0]?.currentPrice || 0;
    const direction = analyses[0]?.direction || "صاعد";
    
    // تعيين سعر الدخول بناءً على الاتجاه
    entryPrice = direction === "صاعد"
      ? Number((currentPrice * 0.995).toFixed(4)) // أقل من السعر الحالي بنسبة 0.5% للاتجاه الصاعد
      : Number((currentPrice * 1.005).toFixed(4)); // أعلى من السعر الحالي بنسبة 0.5% للاتجاه الهابط
    
    console.log(`No valid entry points found, using calculated price: ${entryPrice}`);
  }

  return {
    support,
    resistance,
    stopLoss,
    entryPrice
  };
};

/**
 * Combine targets from multiple analyses and sort them
 */
export const combineAndSortTargets = (analyses: AnalysisData[]) => {
  console.log("Combining targets from", analyses.length, "analyses");
  
  // جمع الأهداف من جميع التحليلات
  const allTargets = analyses.flatMap(analysis => {
    if (!analysis.targets || !Array.isArray(analysis.targets)) {
      console.log("Analysis has no valid targets", analysis.pattern);
      return [];
    }
    
    return analysis.targets.map(target => {
      // تحويل الأهداف الرقمية البسيطة إلى كائنات
      if (typeof target === 'number') {
        return { price: target };
      }
      
      // إرجاع الهدف كما هو إذا كان كائنًا
      if (target && typeof target === 'object' && 'price' in target) {
        return target;
      }
      
      return null;
    }).filter(Boolean);
  });
  
  console.log("All combined targets:", allTargets.length);
  
  // حساب متوسط القيم المتكررة (تجميع الأهداف المتقاربة)
  const uniqueTargets = [];
  const processedPrices = new Set();
  
  for (const target of allTargets) {
    if (!target) continue;
    
    // تجاهل الأهداف التي تم معالجتها بالفعل
    const roundedPrice = Math.round(target.price * 100) / 100;
    if (processedPrices.has(roundedPrice)) continue;
    
    processedPrices.add(roundedPrice);
    uniqueTargets.push(target);
  }
  
  // ترتيب الأهداف حسب السعر
  const direction = analyses[0]?.direction || "صاعد";
  const sortedTargets = uniqueTargets.sort((a, b) => {
    return direction === "صاعد" ? a.price - b.price : b.price - a.price;
  });
  
  console.log("Sorted unique targets:", sortedTargets.length);
  return sortedTargets;
};

/**
 * Calculate the most common direction from all analyses
 */
export const calculateCombinedDirection = (analyses: AnalysisData[]): "صاعد" | "هابط" => {
  console.log("Calculating combined direction from", analyses.length, "analyses");
  
  let upCount = 0;
  let downCount = 0;
  
  for (const analysis of analyses) {
    if (analysis.direction === "صاعد") {
      upCount++;
    } else if (analysis.direction === "هابط") {
      downCount++;
    }
  }
  
  console.log(`Direction counts: Up=${upCount}, Down=${downCount}`);
  return upCount >= downCount ? "صاعد" : "هابط";
};
