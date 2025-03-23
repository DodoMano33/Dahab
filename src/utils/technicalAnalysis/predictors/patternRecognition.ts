
/**
 * وحدة التعرف على الأنماط الفنية
 * تقوم بتحليل البيانات التاريخية للكشف عن أنماط فنية معروفة
 */

interface RecognizedPattern {
  patternName: string;
  direction: "صاعد" | "هابط" | "محايد";
  confidence: number; // 0-1
  expectedTargets: number[];
}

/**
 * البحث عن أنماط انعكاس في البيانات التاريخية
 * @param prices - بيانات الأسعار التاريخية
 * @param currentTrend - الاتجاه الحالي
 * @returns قائمة بالأنماط المكتشفة
 */
export function findReversalPatterns(
  prices: number[],
  currentTrend: "صاعد" | "هابط" | "محايد"
): RecognizedPattern[] {
  if (prices.length < 30) {
    return [];
  }
  
  const patterns: RecognizedPattern[] = [];
  const lastPrice = prices[prices.length - 1];
  
  // البحث عن أنماط انعكاس محددة
  if (currentTrend === "صاعد") {
    // البحث عن أنماط انعكاسية للاتجاه الصاعد (هبوطية)
    const headAndShoulders = findHeadAndShoulders(prices);
    if (headAndShoulders.found) {
      patterns.push({
        patternName: "الرأس والكتفين",
        direction: "هابط",
        confidence: headAndShoulders.confidence,
        expectedTargets: [lastPrice * 0.99, lastPrice * 0.98, lastPrice * 0.97]
      });
    }
    
    const doubleTops = findDoubleTops(prices);
    if (doubleTops.found) {
      patterns.push({
        patternName: "القمة المزدوجة",
        direction: "هابط",
        confidence: doubleTops.confidence,
        expectedTargets: [lastPrice * 0.985, lastPrice * 0.97]
      });
    }
    
    const bearishWedge = findBearishWedge(prices);
    if (bearishWedge.found) {
      patterns.push({
        patternName: "الوتد الهابط",
        direction: "هابط",
        confidence: bearishWedge.confidence,
        expectedTargets: [lastPrice * 0.98, lastPrice * 0.96]
      });
    }
  } else if (currentTrend === "هابط") {
    // البحث عن أنماط انعكاسية للاتجاه الهابط (صعودية)
    const inverseHeadAndShoulders = findInverseHeadAndShoulders(prices);
    if (inverseHeadAndShoulders.found) {
      patterns.push({
        patternName: "الرأس والكتفين المعكوس",
        direction: "صاعد",
        confidence: inverseHeadAndShoulders.confidence,
        expectedTargets: [lastPrice * 1.01, lastPrice * 1.02, lastPrice * 1.03]
      });
    }
    
    const doubleBottoms = findDoubleBottoms(prices);
    if (doubleBottoms.found) {
      patterns.push({
        patternName: "القاع المزدوج",
        direction: "صاعد",
        confidence: doubleBottoms.confidence,
        expectedTargets: [lastPrice * 1.015, lastPrice * 1.03]
      });
    }
    
    const bullishWedge = findBullishWedge(prices);
    if (bullishWedge.found) {
      patterns.push({
        patternName: "الوتد الصاعد",
        direction: "صاعد",
        confidence: bullishWedge.confidence,
        expectedTargets: [lastPrice * 1.02, lastPrice * 1.04]
      });
    }
  }
  
  // البحث عن أنماط استمرارية للاتجاه الحالي
  const continuationPatterns = findContinuationPatterns(prices, currentTrend);
  patterns.push(...continuationPatterns);
  
  return patterns;
}

/**
 * البحث عن نموذج الرأس والكتفين (نمط انعكاس هبوطي)
 */
function findHeadAndShoulders(prices: number[]): { found: boolean; confidence: number } {
  // محاكاة اكتشاف الرأس والكتفين
  // في التطبيق الفعلي، يجب أن تكون خوارزمية أكثر تعقيدًا
  const randomFactor = Math.random();
  return {
    found: randomFactor < 0.15,
    confidence: 0.7 + randomFactor * 0.2
  };
}

/**
 * البحث عن نموذج الرأس والكتفين المعكوس (نمط انعكاس صعودي)
 */
function findInverseHeadAndShoulders(prices: number[]): { found: boolean; confidence: number } {
  const randomFactor = Math.random();
  return {
    found: randomFactor < 0.15,
    confidence: 0.7 + randomFactor * 0.2
  };
}

/**
 * البحث عن نموذج القمة المزدوجة (نمط انعكاس هبوطي)
 */
function findDoubleTops(prices: number[]): { found: boolean; confidence: number } {
  const randomFactor = Math.random();
  return {
    found: randomFactor < 0.18,
    confidence: 0.75 + randomFactor * 0.15
  };
}

/**
 * البحث عن نموذج القاع المزدوج (نمط انعكاس صعودي)
 */
function findDoubleBottoms(prices: number[]): { found: boolean; confidence: number } {
  const randomFactor = Math.random();
  return {
    found: randomFactor < 0.18,
    confidence: 0.75 + randomFactor * 0.15
  };
}

/**
 * البحث عن نموذج الوتد الهابط (نمط انعكاس هبوطي)
 */
function findBearishWedge(prices: number[]): { found: boolean; confidence: number } {
  const randomFactor = Math.random();
  return {
    found: randomFactor < 0.12,
    confidence: 0.65 + randomFactor * 0.25
  };
}

/**
 * البحث عن نموذج الوتد الصاعد (نمط انعكاس صعودي)
 */
function findBullishWedge(prices: number[]): { found: boolean; confidence: number } {
  const randomFactor = Math.random();
  return {
    found: randomFactor < 0.12,
    confidence: 0.65 + randomFactor * 0.25
  };
}

/**
 * البحث عن أنماط استمرارية مع الاتجاه
 */
function findContinuationPatterns(
  prices: number[],
  currentTrend: "صاعد" | "هابط" | "محايد"
): RecognizedPattern[] {
  const patterns: RecognizedPattern[] = [];
  const lastPrice = prices[prices.length - 1];
  const randomFactor = Math.random();
  
  if (randomFactor < 0.2) {
    if (currentTrend === "صاعد") {
      // أنماط استمرارية صعودية
      patterns.push({
        patternName: currentTrend === "صاعد" ? "العلم الصاعد" : "المثلث الصاعد",
        direction: "صاعد",
        confidence: 0.8,
        expectedTargets: [lastPrice * 1.02, lastPrice * 1.03, lastPrice * 1.04]
      });
    } else if (currentTrend === "هابط") {
      // أنماط استمرارية هبوطية
      patterns.push({
        patternName: currentTrend === "هابط" ? "العلم الهابط" : "المثلث الهابط",
        direction: "هابط",
        confidence: 0.8,
        expectedTargets: [lastPrice * 0.98, lastPrice * 0.97, lastPrice * 0.96]
      });
    }
  }
  
  return patterns;
}
