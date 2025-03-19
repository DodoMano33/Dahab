
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
    
    // رسم خلفية بيضاء للتأكد من وضوح النص
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // تكبير الصورة مع التنعيم
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    
    // تطبيق تحسينات التباين وزيادة حدة الصورة
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // تحسين التباين والحدة - زيادة التباين بشكل كبير للحصول على نص أكثر وضوحًا
    const contrast = 2.5; // زيادة التباين أكثر
    const brightness = 30; // زيادة السطوع بشكل أكبر
    
    for (let i = 0; i < data.length; i += 4) {
      // تطبيق التباين والسطوع
      data[i] = Math.min(255, Math.max(0, (data[i] - 128) * contrast + 128 + brightness));
      data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * contrast + 128 + brightness));
      data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * contrast + 128 + brightness));
      
      // تحويل إلى الأبيض والأسود بشكل أكثر حدة للتعرف على الأرقام بشكل أفضل
      const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (luminance > 170) { // عتبة أقل للألوان الفاتحة
        // تحويل الألوان الفاتحة إلى أبيض
        data[i] = data[i + 1] = data[i + 2] = 255;
      } else if (luminance < 120) { // عتبة أعلى للألوان الداكنة
        // تحويل الألوان الداكنة إلى أسود
        data[i] = data[i + 1] = data[i + 2] = 0;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // تطبيق فلتر لتحسين حدة الصورة
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (tempCtx) {
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      
      // نسخ الصورة المحسنة إلى الكانفاس المؤقت
      tempCtx.drawImage(canvas, 0, 0);
      
      // تطبيق فلتر لتعزيز الحدة
      ctx.globalAlpha = 0.3; // قيمة أقل للمزج الشفاف
      ctx.drawImage(tempCanvas, -1, -1);
      ctx.drawImage(tempCanvas, 1, 1);
      ctx.drawImage(tempCanvas, -1, 1);
      ctx.drawImage(tempCanvas, 1, -1);
      ctx.globalAlpha = 1.0;
    }
    
    // تكبير الأرقام وزيادة حدتها بمسح منطقة الأرقام المتوقعة
    // نفترض أن الأرقام موجودة في الوسط أو في منطقة معينة من الصورة
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const zoomRegionSize = Math.min(canvas.width, canvas.height) * 0.5;
    
    // استخراج منطقة الأرقام وتكبيرها
    const zoomRegion = ctx.getImageData(
      centerX - zoomRegionSize / 2,
      centerY - zoomRegionSize / 2,
      zoomRegionSize,
      zoomRegionSize
    );
    
    // زيادة تباين منطقة الأرقام المستخرجة
    const zoomData = zoomRegion.data;
    for (let i = 0; i < zoomData.length; i += 4) {
      // تحويل منطقة الأرقام إلى أسود وأبيض بشكل حاد جدًا
      const luminance = 0.299 * zoomData[i] + 0.587 * zoomData[i + 1] + 0.114 * zoomData[i + 2];
      if (luminance > 160) {
        zoomData[i] = zoomData[i + 1] = zoomData[i + 2] = 255;
      } else {
        zoomData[i] = zoomData[i + 1] = zoomData[i + 2] = 0;
      }
    }
    
    // إعادة رسم منطقة الأرقام المحسنة
    ctx.putImageData(zoomRegion, centerX - zoomRegionSize / 2, centerY - zoomRegionSize / 2);
    
    // تحويل الكانفاس إلى صورة base64 بأعلى جودة
    const enhancedImageUrl = canvas.toDataURL('image/png', 1.0);
    console.log('تم تحسين الصورة بنجاح، طول البيانات:', enhancedImageUrl.length);
    
    // طباعة الجزء المركزي من الصورة للتحقق من وجود أرقام
    console.log('تم تحسين منطقة الأرقام المركزية بشكل خاص');
    
    return enhancedImageUrl;
  } catch (error) {
    console.error('خطأ في تحسين الصورة:', error);
    // في حالة فشل التحسين، نرجع الصورة الأصلية
    return imageUrl;
  }
};
