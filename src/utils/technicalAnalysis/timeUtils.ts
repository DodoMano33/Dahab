
/**
 * وحدة حساب الوقت المتوقع للأهداف
 */

/**
 * الحصول على الوقت المتوقع للوصول إلى الهدف بناءً على الإطار الزمني ومؤشر الهدف
 */
export const getExpectedTime = (timeframe: string, targetIndex: number): Date => {
  const now = new Date();
  const lowerTimeframe = timeframe.toLowerCase();
  
  let daysToAdd = 1;
  
  // تحديد مدة الانتظار بناءً على الإطار الزمني
  if (lowerTimeframe.includes("m")) {
    // الإطار الزمني بالدقائق
    const minutes = parseInt(lowerTimeframe) || 5;
    if (minutes <= 1) {
      daysToAdd = (targetIndex + 1) * 1/24; // ساعات
    } else if (minutes <= 5) {
      daysToAdd = (targetIndex + 1) * 2/24; // ساعات
    } else if (minutes <= 15) {
      daysToAdd = (targetIndex + 1) * 6/24; // ساعات
    } else if (minutes <= 30) {
      daysToAdd = (targetIndex + 1) * 10/24; // ساعات
    } else {
      daysToAdd = targetIndex + 1; // يوم لكل هدف
    }
  } else if (lowerTimeframe.includes("h")) {
    // الإطار الزمني بالساعات
    const hours = parseInt(lowerTimeframe) || 1;
    if (hours <= 1) {
      daysToAdd = targetIndex + 1; // يوم لكل هدف
    } else if (hours <= 4) {
      daysToAdd = (targetIndex + 1) * 2; // يومين لكل هدف
    } else {
      daysToAdd = (targetIndex + 1) * 3; // 3 أيام لكل هدف
    }
  } else if (lowerTimeframe.includes("d") || lowerTimeframe === "daily" || lowerTimeframe === "يومي") {
    // الإطار الزمني اليومي
    daysToAdd = (targetIndex + 1) * 5; // 5 أيام لكل هدف
  } else if (lowerTimeframe.includes("w") || lowerTimeframe === "weekly" || lowerTimeframe === "أسبوعي") {
    // الإطار الزمني الأسبوعي
    daysToAdd = (targetIndex + 1) * 14; // أسبوعين لكل هدف
  } else {
    // الافتراضي
    daysToAdd = targetIndex + 1;
  }
  
  // إضافة عشوائية طفيفة لتنويع النتائج
  const randomOffset = Math.random() * 0.4 - 0.2; // -0.2 إلى +0.2
  daysToAdd = daysToAdd * (1 + randomOffset);
  
  // إضافة الوقت المناسب
  now.setDate(now.getDate() + daysToAdd);
  
  return now;
};

