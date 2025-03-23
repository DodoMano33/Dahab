
/**
 * حساب مستويات فيبوناتشي ريتريسمنت
 * @param high أعلى سعر في النطاق
 * @param low أدنى سعر في النطاق
 * @param direction اتجاه السوق
 * @returns مصفوفة تحتوي على مستويات فيبوناتشي
 */
export const calculateFibonacciLevels = (
  high: number,
  low: number,
  direction: "صاعد" | "هابط" | "محايد" = "صاعد"
): { level: number; price: number }[] => {
  // مستويات فيبوناتشي الأساسية
  const fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
  const results: { level: number; price: number }[] = [];
  
  try {
    // التأكد من أن القيم صحيحة
    if (isNaN(high) || isNaN(low) || high <= low) {
      console.warn("قيم غير صالحة لحساب مستويات فيبوناتشي", { high, low });
      return [];
    }
    
    const range = high - low;
    
    // حساب المستويات بناءً على الاتجاه
    if (direction === "صاعد") {
      // في الاتجاه الصاعد، نحسب المستويات من الأسفل إلى الأعلى
      for (const level of fibLevels) {
        const price = parseFloat((low + range * level).toFixed(2));
        results.push({ level, price });
      }
    } else {
      // في الاتجاه الهابط، نحسب المستويات من الأعلى إلى الأسفل
      for (const level of fibLevels) {
        const price = parseFloat((high - range * level).toFixed(2));
        results.push({ level, price });
      }
    }
    
    return results;
  } catch (error) {
    console.error("خطأ في حساب مستويات فيبوناتشي:", error);
    return [];
  }
};

/**
 * حساب مستويات فيبوناتشي إكستنشن
 * @param high أعلى سعر في الحركة الأولى
 * @param low أدنى سعر في الحركة الأولى
 * @param reversalPoint نقطة الانعكاس
 * @param direction اتجاه السوق
 * @returns مصفوفة تحتوي على مستويات فيبوناتشي إكستنشن
 */
export const calculateFibonacciExtensions = (
  high: number,
  low: number,
  reversalPoint: number,
  direction: "صاعد" | "هابط" | "محايد" = "صاعد"
): { level: number; price: number }[] => {
  // مستويات فيبوناتشي إكستنشن
  const extLevels = [0, 0.618, 1, 1.618, 2.618];
  const results: { level: number; price: number }[] = [];
  
  try {
    // التأكد من أن القيم صحيحة
    if (isNaN(high) || isNaN(low) || isNaN(reversalPoint) || high <= low) {
      console.warn("قيم غير صالحة لحساب امتدادات فيبوناتشي", { high, low, reversalPoint });
      return [];
    }
    
    const range = high - low;
    
    // حساب الامتدادات بناءً على الاتجاه
    if (direction === "صاعد") {
      // في الاتجاه الصاعد
      for (const level of extLevels) {
        const extension = range * level;
        const price = parseFloat((reversalPoint + extension).toFixed(2));
        results.push({ level, price });
      }
    } else {
      // في الاتجاه الهابط
      for (const level of extLevels) {
        const extension = range * level;
        const price = parseFloat((reversalPoint - extension).toFixed(2));
        results.push({ level, price });
      }
    }
    
    return results;
  } catch (error) {
    console.error("خطأ في حساب امتدادات فيبوناتشي:", error);
    return [];
  }
};
