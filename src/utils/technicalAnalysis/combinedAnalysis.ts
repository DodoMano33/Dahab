
import { AnalysisData } from "@/types/analysis";
import { getStrategyName } from "./analysisTypeMap";
import { executeMultipleAnalyses } from "./analysisExecutor";
import { 
  calculateCombinedDirection, 
  combineAndSortTargets,
  calculateWeightedValues 
} from "./analysisAggregator";

export const combinedAnalysis = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  selectedTypes: string[]
): Promise<AnalysisData> => {
  console.log("Starting combined analysis with types:", selectedTypes);
  console.log("Display names for types:", selectedTypes.map(getStrategyName));

  // Early return for empty selection
  if (!selectedTypes.length) {
    console.error("No analysis types selected");
    throw new Error("No analysis types selected");
  }

  // Filter out the "normal" type if it exists (it's just a UI indicator for "select all")
  const actualTypes = selectedTypes.filter(type => type !== "normal");
  console.log("Actual analysis types (without 'normal'):", actualTypes);
  
  if (!actualTypes.length) {
    console.error("No valid analysis types selected after filtering");
    throw new Error("No valid analysis types selected");
  }

  try {
    // Get display names for the strategy types
    const strategyNames = actualTypes.map(getStrategyName);
    console.log("Strategy display names:", strategyNames);
    
    // Execute all requested analyses in parallel
    const analysisResults = await executeMultipleAnalyses(
      actualTypes, 
      chartImage, 
      currentPrice, 
      timeframe
    );
    
    if (!analysisResults.length) {
      console.error("No analysis results returned");
      throw new Error("Failed to generate analysis results");
    }

    console.log(`Got ${analysisResults.length} analysis results`);

    // إضافة تنوع إلى النتائج المشتركة
    // حساب نسبة كل نوع تحليل في النتائج المشتركة
    const typeWeights = calculateTypeWeights(actualTypes);
    
    // Calculate weighted values for important metrics with weights
    const weightedValues = calculateWeightedValues(analysisResults);
    console.log("Weighted values:", weightedValues);
    
    // Determine direction based on combined analysis
    const direction = calculateCombinedDirection(analysisResults);
    console.log("Combined direction:", direction);

    // Combine and sort targets with weights
    const combinedTargets = combineAndSortTargets(analysisResults);
    console.log("Combined targets:", combinedTargets);

    // إضافة التوقيت المتوقع لكل هدف إذا لم يكن موجودًا
    const now = new Date();
    const targetsWithDates = combinedTargets.slice(0, 3).map((target, index) => {
      // إذا كان الهدف لا يحتوي على وقت متوقع، نضيف له وقتًا افتراضيًا
      if (!target.expectedTime) {
        // جعل أوقات الأهداف متباعدة بناءً على الإطار الزمني
        const hoursToAdd = getHoursToAddBasedOnTimeframe(timeframe, index);
        const expectedTime = new Date(now);
        expectedTime.setHours(expectedTime.getHours() + hoursToAdd);
        return {
          ...target,
          expectedTime
        };
      }
      return target;
    });

    // تحسين وصف نقطة الدخول المثالية
    let analysisDescription = '';
    if (strategyNames.length > 3) {
      analysisDescription = `${strategyNames.length} استراتيجية مختلفة`;
    } else if (strategyNames.length > 0) {
      analysisDescription = strategyNames.join(', ');
    } else {
      analysisDescription = 'تحليل ذكي';
    }
    
    const bestEntryReason = `أفضل نقطة دخول محسوبة بناءً على ${analysisDescription} على الإطار الزمني ${timeframe}`;

    // إنشاء سعر لنقطة الدخول المثالية
    let bestEntryPrice = weightedValues.entryPrice;
    
    // طباعة تشخيصية
    console.log("Best entry price from weightedValues:", bestEntryPrice);
    
    // التأكد من أن سعر نقطة الدخول المثالية رقم صالح
    if (bestEntryPrice === undefined || bestEntryPrice === null || isNaN(Number(bestEntryPrice))) {
      console.log("Creating default entry price based on direction");
      
      // حساب سعر افتراضي بناء على الاتجاه
      if (direction === "صاعد") {
        bestEntryPrice = Number((currentPrice * 0.995).toFixed(4)); // أقل من السعر الحالي بنسبة 0.5% للاتجاه الصاعد
      } else {
        bestEntryPrice = Number((currentPrice * 1.005).toFixed(4)); // أعلى من السعر الحالي بنسبة 0.5% للاتجاه الهابط
      }
    }
    
    // تحويل السعر إلى رقم صحيح للتأكد من أنه ليس NaN
    bestEntryPrice = Number(bestEntryPrice);
    if (isNaN(bestEntryPrice)) {
      console.error("Best entry price is still NaN after conversion, using current price as fallback");
      bestEntryPrice = currentPrice;
    }
    
    // إضافة تنوع للنقاط السعرية حسب اتجاه السوق
    const priceVariance = currentPrice * 0.02; // 2% تنوع
    
    // حساب مستوى الدعم
    let support = weightedValues.support;
    if (isNaN(Number(support)) || support === undefined) {
      support = direction === "صاعد" 
        ? currentPrice * 0.97 
        : currentPrice * 0.94;
    }
    
    // حساب مستوى المقاومة
    let resistance = weightedValues.resistance;
    if (isNaN(Number(resistance)) || resistance === undefined) {
      resistance = direction === "صاعد" 
        ? currentPrice * 1.06 
        : currentPrice * 1.03;
    }
    
    // حساب وقف الخسارة
    let stopLoss = weightedValues.stopLoss;
    if (isNaN(Number(stopLoss)) || stopLoss === undefined) {
      stopLoss = direction === "صاعد" 
        ? support * 0.99 
        : resistance * 1.01;
    }
    
    // تأكد من أن كائن نقطة الدخول المثالية مُصاغ بشكل صحيح
    const bestEntryPoint = {
      price: bestEntryPrice,
      reason: bestEntryReason
    };

    // إنشاء مستويات فيبوناتشي إذا لم تكن موجودة في النتائج
    let fibonacciLevels = null;
    
    // البحث عن أول تحليل يحتوي على مستويات فيبوناتشي
    for (const analysis of analysisResults) {
      if (analysis.fibonacciLevels && analysis.fibonacciLevels.length > 0) {
        fibonacciLevels = analysis.fibonacciLevels;
        break;
      }
    }
    
    // إذا لم نجد مستويات فيبوناتشي، نقوم بإنشائها
    if (!fibonacciLevels) {
      const range = direction === "صاعد" 
        ? resistance - support 
        : resistance - support;
      
      const base = direction === "صاعد" ? support : resistance;
      const mult = direction === "صاعد" ? 1 : -1;
      
      fibonacciLevels = [
        { level: 0.236, price: Number((base + mult * range * 0.236).toFixed(2)) },
        { level: 0.382, price: Number((base + mult * range * 0.382).toFixed(2)) },
        { level: 0.5, price: Number((base + mult * range * 0.5).toFixed(2)) },
        { level: 0.618, price: Number((base + mult * range * 0.618).toFixed(2)) },
        { level: 0.786, price: Number((base + mult * range * 0.786).toFixed(2)) }
      ];
    }

    // Build the combined result
    const combinedResult: AnalysisData = {
      pattern: `تحليل ذكي (${strategyNames.length > 3 ? strategyNames.length + ' استراتيجية' : strategyNames.join(', ')})`,
      direction,
      currentPrice,
      support: Number(support.toFixed(2)),
      resistance: Number(resistance.toFixed(2)),
      stopLoss: Number(stopLoss.toFixed(2)),
      targets: targetsWithDates,
      bestEntryPoint,
      fibonacciLevels,
      analysisType: "ذكي",
      activation_type: "تلقائي",
      timeframe
    };

    console.log("Combined analysis result:", combinedResult);
    return combinedResult;
  } catch (error) {
    console.error("Error in combined analysis:", error);
    throw error;
  }
};

/**
 * حساب وزن كل نوع تحليل في النتائج المشتركة
 */
function calculateTypeWeights(types: string[]): {[key: string]: number} {
  const weights: {[key: string]: number} = {};
  const baseWeight = 1 / types.length;
  
  // تخصيص وزن لكل نوع تحليل
  types.forEach(type => {
    // تحديد أنواع معينة ذات أهمية أكبر
    const normalizedType = type.toLowerCase().replace(/[_\s]/g, '');
    
    if (normalizedType.includes('fibonacci') || normalizedType.includes('فيبوناتشي')) {
      weights[type] = baseWeight * 1.2; // زيادة وزن تحليل فيبوناتشي
    } else if (normalizedType.includes('ict') || normalizedType.includes('smc')) {
      weights[type] = baseWeight * 1.3; // زيادة وزن تحليلات ICT و SMC
    } else if (normalizedType.includes('neural') || normalizedType.includes('عصبية') || normalizedType.includes('ml')) {
      weights[type] = baseWeight * 1.4; // زيادة وزن تحليلات الشبكات العصبية والتعلم الآلي
    } else {
      weights[type] = baseWeight;
    }
  });
  
  // تطبيع الأوزان للتأكد من أن مجموعها يساوي 1
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  Object.keys(weights).forEach(type => {
    weights[type] = weights[type] / totalWeight;
  });
  
  return weights;
}

/**
 * تحديد ساعات الإضافة للأهداف بناءً على الإطار الزمني
 */
function getHoursToAddBasedOnTimeframe(timeframe: string, targetIndex: number): number {
  // ضرب التأخير بمؤشر الهدف (0, 1, 2) للحصول على تباعد متزايد
  const baseMultiplier = targetIndex + 1;
  
  // تعديل الساعات بناءً على الإطار الزمني
  switch (timeframe) {
    case "1m":
      return baseMultiplier * 2; // كل هدف بعد 2 ساعات من الآخر
    case "5m":
      return baseMultiplier * 4; // كل هدف بعد 4 ساعات من الآخر
    case "15m":
      return baseMultiplier * 6; // كل هدف بعد 6 ساعات من الآخر
    case "30m":
      return baseMultiplier * 8; // كل هدف بعد 8 ساعات من الآخر
    case "1h":
      return baseMultiplier * 12; // كل هدف بعد 12 ساعة من الآخر
    case "4h":
      return baseMultiplier * 24; // كل هدف بعد 24 ساعة من الآخر
    case "1d":
      return baseMultiplier * 48; // كل هدف بعد يومين من الآخر
    default:
      return baseMultiplier * 24; // افتراضي - كل هدف بعد 24 ساعة من الآخر
  }
}
