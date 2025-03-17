
import { ImageData } from "@/types/analysis";

export const detectPrices = (imageData: ImageData): number[] => {
  // قيم ثابتة بدلاً من استخراج الأسعار من الصورة
  const prices: number[] = [];
  const basePrice = 100;
  
  // إنشاء 10 قيم بناءً على القيمة الثابتة
  for (let i = 0; i < 10; i++) {
    const factor = 0.9 + (i * 0.02);
    prices.push(basePrice * factor);
  }
  
  console.log("قيم ثابتة بدلاً من الأسعار المكتشفة:", prices);
  return prices;
};
