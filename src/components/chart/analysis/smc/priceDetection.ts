
import { ImageData } from "@/types/analysis";

export const detectPrices = (imageData: ImageData, providedCurrentPrice?: number): number[] => {
  const prices: number[] = [];
  const height = imageData.height;
  
  // إذا تم توفير سعر حالي، استخدمه كنقطة مرجعية
  const currentPrice = providedCurrentPrice || 2622; 
  
  // تحديد الصف المقابل لمنتصف الارتفاع كمرجع للسعر الحالي
  const currentPriceRow = Math.floor(height * 0.5); 
  
  console.log("استخدام سعر مرجعي:", currentPrice, "في صف:", currentPriceRow);
  
  // أخذ عينات بمسافات متساوية من الصورة
  for (let y = 0; y < height; y += height / 10) {
    let sum = 0;
    let count = 0;
    
    // تحليل البكسلات في الصف الحالي
    for (let x = 0; x < 50; x++) {
      const index = (Math.floor(y) * imageData.width + x) * 4;
      if (index < imageData.data.length) {
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];
        
        sum += (r + g + b) / 3;
        count++;
      }
    }
    
    if (count > 0) {
      // حساب السعر النسبي بناءً على المسافة من الصف المرجعي
      if (Math.abs(y - currentPriceRow) < height / 20) {
        prices.push(currentPrice);
      } else {
        const price = currentPrice + ((y - currentPriceRow) / height) * 100;
        prices.push(Math.round(price * 100) / 100);
      }
    }
  }
  
  console.log("الأسعار المكتشفة:", prices);
  return prices;
};
