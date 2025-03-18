
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
    const scale = 3; // زيادة الدقة لتحسين قراءة النص
    canvas.width = originalImage.width * scale;
    canvas.height = originalImage.height * scale;
    
    // تكبير الصورة مع التنعيم
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    
    // تطبيق تحسينات التباين وزيادة حدة الصورة
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // تحسين التباين والحدة - تعديل قيم التباين والسطوع لتحسين التعرف على النص
    const contrast = 2.0; // زيادة التباين بشكل كبير
    const brightness = 20; // زيادة السطوع قليلاً
    
    for (let i = 0; i < data.length; i += 4) {
      // تطبيق التباين والسطوع
      data[i] = Math.min(255, Math.max(0, (data[i] - 128) * contrast + 128 + brightness));
      data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * contrast + 128 + brightness));
      data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * contrast + 128 + brightness));
      
      // تبييض الخلفية بشكل أكبر وتغميق النص بشكل أكبر للحصول على تباين أعلى
      const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (luminance > 190) {
        // إذا كان البكسل فاتحًا، نجعله أبيض تمامًا
        data[i] = data[i + 1] = data[i + 2] = 255;
      } else if (luminance < 100) {
        // إذا كان البكسل داكنًا، نجعله أسود تمامًا
        data[i] = data[i + 1] = data[i + 2] = 0;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // إضافة معالجة إضافية - رسم حدود حول الأرقام
    try {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      if (tempCtx) {
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        
        // نسخ الصورة المعالجة إلى الكانفاس المؤقت
        tempCtx.drawImage(canvas, 0, 0);
        
        // مسح الكانفاس الأصلي
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // تعبئة الكانفاس باللون الأبيض
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // رسم الصورة المعالجة مرة أخرى مع إضافة تأثير زيادة الحدة
        ctx.drawImage(tempCanvas, 0, 0);
      }
    } catch (enhanceError) {
      console.error('خطأ في المعالجة الإضافية للصورة:', enhanceError);
    }
    
    // تحويل الكانفاس إلى صورة base64 بأعلى جودة
    const enhancedImageUrl = canvas.toDataURL('image/png', 1.0);
    console.log('تم تحسين الصورة بنجاح، طول البيانات:', enhancedImageUrl.length);
    
    return enhancedImageUrl;
  } catch (error) {
    console.error('خطأ في تحسين الصورة:', error);
    // في حالة فشل التحسين، نرجع الصورة الأصلية
    return imageUrl;
  }
};
