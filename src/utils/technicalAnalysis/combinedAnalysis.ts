
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

    // Calculate weighted values for important metrics
    const weightedValues = calculateWeightedValues(analysisResults);
    console.log("Weighted values:", weightedValues);
    
    // Determine direction based on combined analysis
    const direction = calculateCombinedDirection(analysisResults);

    // Combine and sort targets
    const combinedTargets = combineAndSortTargets(analysisResults);
    console.log("Combined targets:", combinedTargets);

    // إضافة التوقيت المتوقع لكل هدف إذا لم يكن موجودًا
    const now = new Date();
    const targetsWithDates = combinedTargets.slice(0, 3).map((target, index) => {
      // إذا كان الهدف لا يحتوي على وقت متوقع، نضيف له وقتًا افتراضيًا
      if (!target.expectedTime) {
        const expectedTime = new Date(now);
        expectedTime.setHours(expectedTime.getHours() + (index + 1) * 24); // كل هدف بعد 24 ساعة من السابق
        return {
          ...target,
          expectedTime
        };
      }
      return target;
    });

    // تحسين وصف نقطة الدخول المثالية
    const bestEntryReason = `أفضل نقطة دخول محسوبة بناءً على تحليل ${actualTypes.length} استراتيجية (${strategyNames.join(', ')})`;

    // إنشاء سعر لنقطة الدخول المثالية إذا لم يوجد
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
    
    console.log("Final best entry price:", bestEntryPrice);

    // Build the combined result
    const combinedResult: AnalysisData = {
      pattern: `Smart Analysis (${strategyNames.join(', ')})`,
      direction,
      currentPrice,
      support: weightedValues.support,
      resistance: weightedValues.resistance,
      stopLoss: weightedValues.stopLoss,
      targets: targetsWithDates,
      bestEntryPoint: {
        price: bestEntryPrice,
        reason: bestEntryReason
      },
      analysisType: "ذكي",
      activation_type: "تلقائي"
    };

    console.log("Combined analysis result:", combinedResult);
    return combinedResult;
  } catch (error) {
    console.error("Error in combined analysis:", error);
    throw error;
  }
};
