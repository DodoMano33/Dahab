
/**
 * معالجة وتحسين الصور قبل استخدام OCR
 */

/**
 * تحسين وضوح الصورة لتسهيل قراءة النص منها
 * @param imageUrl رابط الصورة المراد تحسينها بصيغة base64
 * @returns وعد بالصورة المحسنة بصيغة base64
 */
export const enhanceImageForOcr = async (imageUrl: string): Promise<string> => {
  try {
    console.log('بدء تحسين الصورة...');
    
    if (!imageUrl || imageUrl.length < 100) {
      console.error('الصورة المدخلة غير صالحة للتحسين');
      return imageUrl;
    }
    
    // إنشاء عنصر صورة جديد لتحميل الصورة الأصلية
    const originalImage = new Image();
    
    // انتظار تحميل الصورة
    await new Promise<void>((resolve, reject) => {
      originalImage.onload = () => resolve();
      originalImage.onerror = (e) => {
        console.error('خطأ في تحميل الصورة:', e);
        reject(new Error('فشل تحميل الصورة'));
      };
      originalImage.src = imageUrl;
    });
    
    // إنشاء كانفاس لمعالجة الصورة
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('لم يتم العثور على سياق الرسم 2D');
      return imageUrl;
    }
    
    // تعيين أبعاد الكانفاس مع زيادة الدقة
    const scale = 2; // مضاعفة دقة الصورة
    canvas.width = originalImage.width * scale;
    canvas.height = originalImage.height * scale;
    
    // تكبير الصورة مع التنعيم
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    
    // تطبيق تحسينات التباين وزيادة حدة الصورة
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // تحسين التباين والحدة
    const contrast = 1.5; // زيادة التباين
    const brightness = 15; // زيادة السطوع قليلاً
    
    for (let i = 0; i < data.length; i += 4) {
      // تطبيق التباين والسطوع
      data[i] = Math.min(255, Math.max(0, (data[i] - 128) * contrast + 128 + brightness));
      data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * contrast + 128 + brightness));
      data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * contrast + 128 + brightness));
      
      // تبسيط الألوان لتسهيل قراءة النص
      // إذا كان لون البكسل قريبًا من اللون الأبيض، نجعله أبيض تمامًا
      if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200) {
        data[i] = data[i + 1] = data[i + 2] = 255;
      }
      
      // إذا كان لون البكسل داكنًا، نزيد التباين
      if (data[i] < 80 && data[i + 1] < 80 && data[i + 2] < 80) {
        data[i] = data[i + 1] = data[i + 2] = 0;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // تحويل الكانفاس إلى صورة base64
    const enhancedImageUrl = canvas.toDataURL('image/png', 1.0);
    console.log('تم تحسين الصورة بنجاح، طول البيانات:', enhancedImageUrl.length);
    
    return enhancedImageUrl;
  } catch (error) {
    console.error('خطأ في تحسين الصورة:', error);
    // في حالة فشل التحسين، نرجع الصورة الأصلية
    return imageUrl;
  }
};
