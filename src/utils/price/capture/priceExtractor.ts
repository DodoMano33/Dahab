
/**
 * استخراج السعر من الرسم البياني
 */
import { extractPriceFromTradingView } from "@/utils/tradingViewUtils";

/**
 * استخراج السعر الحالي من الرسم البياني
 * @returns وعد يحتوي على السعر الحالي أو null في حالة الفشل
 */
export const extractPriceFromChart = async (): Promise<number | null> => {
  try {
    // محاولة استخراج السعر من عناصر DOM الخاصة بالويدجت
    // البحث عن العناصر التي تحتوي على الرقم الكبير المعروض (سعر العملة الحالي)
    const priceElements = document.querySelectorAll('.chart-container .chart-markup-table.pane-legend-line.main-serie .tv-symbol-price-quote__value, .chart-container .apply-overflow-tooltip.apply-common-tooltip, .tv-ticker-tape-price__value');
    
    if (priceElements && priceElements.length > 0) {
      // تجربة كل عنصر محتمل حتى نجد السعر
      for (let i = 0; i < priceElements.length; i++) {
        const priceText = priceElements[i].textContent;
        if (priceText) {
          // تنظيف النص واستخراج الرقم
          const cleanText = priceText.replace(/[^\d.,]/g, '');
          // التعامل مع الفاصلة والنقطة في تنسيقات الأرقام المختلفة
          const normalizedText = cleanText.replace(/,/g, '.');
          const price = parseFloat(normalizedText);
          
          if (!isNaN(price) && price > 0) {
            console.log("تم استخراج السعر من DOM:", price);
            return price;
          }
        }
      }
    }

    // محاولة ثانية - البحث عن عناصر السعر في ويدجيت التكر
    const quoteElements = document.querySelectorAll('.tv-ticker-tape-price__value');
    
    if (quoteElements && quoteElements.length > 0) {
      for (let i = 0; i < quoteElements.length; i++) {
        const priceText = quoteElements[i].textContent;
        if (priceText) {
          // تنظيف النص واستخراج الرقم
          const cleanText = priceText.replace(/[^\d.,]/g, '');
          const normalizedText = cleanText.replace(/,/g, '.');
          const price = parseFloat(normalizedText);
          
          if (!isNaN(price) && price > 0) {
            console.log("تم استخراج السعر من ويدجيت التكر:", price);
            return price;
          }
        }
      }
    }
    
    // محاولة ثالثة - البحث عن عناصر بقيمة رقمية في أي مكان في DOM
    const allElementsWithText = document.querySelectorAll('div, span, p');
    for (let i = 0; i < allElementsWithText.length; i++) {
      const element = allElementsWithText[i];
      if (element.textContent && element.textContent.match(/^\s*[\d,]+\.\d+\s*$/)) {
        const priceText = element.textContent;
        const cleanText = priceText.replace(/[^\d.,]/g, '');
        const normalizedText = cleanText.replace(/,/g, '.');
        const price = parseFloat(normalizedText);
        
        if (!isNaN(price) && price > 0) {
          console.log("تم استخراج السعر من عنصر DOM عام:", price);
          return price;
        }
      }
    }
    
    // محاولة استخراج السعر من الصورة - إضافة جديدة
    try {
      const chartImage = await captureChartScreenshot();
      if (chartImage) {
        const price = await extractPriceFromImage(chartImage);
        if (price !== null && price > 0) {
          console.log("تم استخراج السعر من الصورة:", price);
          return price;
        }
      }
    } catch (imageError) {
      console.error("فشل في استخراج السعر من الصورة:", imageError);
    }
    
    // إذا فشلت كل المحاولات، نستخدم الطريقة الاحتياطية
    return await extractPriceFromTradingView();
  } catch (error) {
    console.error("فشل في استخراج السعر من الرسم البياني:", error);
    return null;
  }
};

/**
 * التقاط صورة للرسم البياني
 * @returns وعد يحتوي على الصورة بتنسيق data URL
 */
const captureChartScreenshot = async (): Promise<string | null> => {
  try {
    const chartElement = document.querySelector('.tradingview-widget-container');
    if (!chartElement) {
      console.warn("لم يتم العثور على عنصر الرسم البياني");
      return null;
    }
    
    // استخدام html2canvas لالتقاط صورة
    const html2canvas = await import('html2canvas').then(module => module.default);
    const canvas = await html2canvas(chartElement as HTMLElement, {
      logging: false,
      useCORS: true,
      allowTaint: true
    });
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error("فشل في التقاط صورة للرسم البياني:", error);
    return null;
  }
};

/**
 * استخراج السعر من الصورة
 * @param imageData صورة بتنسيق data URL
 * @returns وعد يحتوي على السعر المستخرج أو null في حالة الفشل
 */
const extractPriceFromImage = async (imageData: string): Promise<number | null> => {
  try {
    // في هذه المرحلة، سنعتمد على تحليل البيكسلات في منطقة يفترض أن يكون فيها السعر
    const img = new Image();
    
    // انتظار تحميل الصورة
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageData;
    });
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }
    
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    // استخراج المنطقة العلوية من الصورة حيث يحتمل وجود السعر
    // (هذه قيم تقريبية، قد تحتاج للتعديل حسب شكل الرسم البياني)
    const imageDataObj = ctx.getImageData(0, 0, img.width, Math.min(50, img.height));
    
    // تحليل البيكسلات بحثًا عن المناطق ذات التباين العالي (حيث يحتمل وجود أرقام)
    // هذه طريقة بسيطة للكشف عن مناطق النص
    let pixelData = '';
    for (let i = 0; i < imageDataObj.data.length; i += 4) {
      const r = imageDataObj.data[i];
      const g = imageDataObj.data[i + 1];
      const b = imageDataObj.data[i + 2];
      const brightness = (r + g + b) / 3;
      
      pixelData += brightness > 200 ? '1' : '0';
    }
    
    // في هذه المرحلة، لن نستطيع تحليل الأرقام بدقة بدون استخدام OCR متقدمة
    // لكن، يمكننا استخدام هذه البيانات للكشف عن وجود أنماط معينة
    
    // هذا مجرد ملء للمكان، في الواقع سيكون علينا استخدام مكتبة OCR مثل Tesseract.js
    // أو خدمة OCR خارجية لتحقيق هذه الوظيفة بشكل مناسب
    
    // لأغراض هذا المثال، سنعود ببساطة إلى الطرق الأخرى
    return null;
  } catch (error) {
    console.error("فشل في استخراج السعر من الصورة:", error);
    return null;
  }
};
