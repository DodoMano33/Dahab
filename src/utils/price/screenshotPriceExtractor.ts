
import html2canvas from 'html2canvas';
import { createWorker } from 'tesseract.js';

// التكوين
const CAPTURE_INTERVAL = 1000; // 1 ثانية
const PRICE_SELECTOR = '#tv_chart_container .pane-legend-line span.pane-legend-item-value-wrap'; // محدد CSS لعنصر السعر

// متغيرات الحالة
let captureInterval: NodeJS.Timeout | null = null;
let isCapturing = false;
let lastExtractedPrice: number | null = null;
let priceElement: HTMLElement | null = null;
let ocrWorker: any = null;

// تهيئة محرك OCR
const initOCR = async () => {
  try {
    console.log('تهيئة محرك OCR...');
    ocrWorker = await createWorker('eng');
    await ocrWorker.setParameters({
      tessedit_char_whitelist: '0123456789.',
    });
    console.log('تم تهيئة محرك OCR بنجاح');
    return true;
  } catch (error) {
    console.error('فشل في تهيئة محرك OCR:', error);
    return false;
  }
};

// استخراج النص من الصورة باستخدام OCR
const extractTextFromImage = async (imageData: string): Promise<string> => {
  if (!ocrWorker) {
    throw new Error('لم يتم تهيئة محرك OCR');
  }
  
  try {
    const { data } = await ocrWorker.recognize(imageData);
    return data.text.trim();
  } catch (error) {
    console.error('فشل في استخراج النص من الصورة:', error);
    throw error;
  }
};

// تحويل النص المستخرج إلى رقم
const parseExtractedText = (text: string): number | null => {
  // إزالة أي أحرف غير رقمية باستثناء النقطة العشرية
  const cleanedText = text.replace(/[^\d.]/g, '');
  
  // التحقق من وجود رقم واحد على الأقل ونقطة عشرية واحدة على الأكثر
  if (/^\d*\.?\d+$/.test(cleanedText)) {
    const number = parseFloat(cleanedText);
    if (!isNaN(number) && number > 0) {
      return number;
    }
  }
  
  return null;
};

// التقاط صورة للعنصر
const captureElement = async (element: HTMLElement): Promise<string> => {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      logging: false,
      scale: 2, // مقياس أعلى للحصول على دقة أفضل للـ OCR
    });
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('فشل في التقاط صورة للعنصر:', error);
    throw error;
  }
};

// العثور على عنصر السعر في الشارت
const findPriceElement = (): HTMLElement | null => {
  const elements = document.querySelectorAll(PRICE_SELECTOR);
  if (elements.length > 0) {
    return elements[0] as HTMLElement;
  }
  
  // محاولة العثور على العنصر بطرق بديلة
  const alternativeSelectors = [
    '.pane-legend-line .pane-legend-item-value',
    '.chart-markup-table .price',
    '.chart-status-wrapper .chart-status-price',
    '#tv-chart-price-display',
    '.ts-price-display',
    '.price-value'
  ];
  
  for (const selector of alternativeSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      return element as HTMLElement;
    }
  }
  
  return null;
};

// استخراج السعر من عنصر الشارت
const extractPriceFromChart = async (): Promise<number | null> => {
  try {
    // البحث عن عنصر السعر إذا لم يتم العثور عليه بعد
    if (!priceElement) {
      priceElement = findPriceElement();
      if (!priceElement) {
        console.warn('لم يتم العثور على عنصر السعر في الشارت');
        return null;
      }
    }
    
    // محاولة قراءة النص مباشرة من العنصر
    const directText = priceElement.textContent?.trim();
    if (directText) {
      const directPrice = parseExtractedText(directText);
      if (directPrice !== null) {
        return directPrice;
      }
    }
    
    // استخدام OCR كخطة احتياطية
    const imageData = await captureElement(priceElement);
    const extractedText = await extractTextFromImage(imageData);
    console.log('النص المستخرج من OCR:', extractedText);
    
    const price = parseExtractedText(extractedText);
    if (price !== null) {
      return price;
    }
    
    return null;
  } catch (error) {
    console.error('فشل في استخراج السعر من الشارت:', error);
    return null;
  }
};

// نشر تحديث السعر في جميع أنحاء التطبيق
const broadcastPrice = (price: number) => {
  lastExtractedPrice = price;
  
  // إرسال حدث تحديث السعر
  window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
    detail: { 
      price,
      symbol: 'CFI:XAUUSD',
      timestamp: Date.now()
    }
  }));
  
  console.log('تم نشر تحديث السعر:', price);
};

// الدالة الرئيسية لاستخراج السعر
const extractPrice = async () => {
  try {
    if (!isCapturing) return;
    
    const price = await extractPriceFromChart();
    if (price !== null && (lastExtractedPrice === null || Math.abs(price - lastExtractedPrice) > 0.001)) {
      broadcastPrice(price);
    }
  } catch (error) {
    console.error('فشل في استخراج السعر:', error);
  }
};

// بدء عملية التقاط السعر
export const startPriceCapture = async () => {
  if (isCapturing) return;
  
  isCapturing = true;
  
  // تهيئة محرك OCR إذا لم يكن موجودًا
  if (!ocrWorker) {
    const success = await initOCR();
    if (!success) {
      isCapturing = false;
      return;
    }
  }
  
  // بدء التقاط الأسعار على فترات منتظمة
  captureInterval = setInterval(extractPrice, CAPTURE_INTERVAL);
  console.log('تم بدء التقاط السعر');
  
  // استخراج السعر الأولي فورًا
  extractPrice();
};

// إيقاف عملية التقاط السعر
export const stopPriceCapture = () => {
  if (!isCapturing) return;
  
  if (captureInterval) {
    clearInterval(captureInterval);
    captureInterval = null;
  }
  
  isCapturing = false;
  console.log('تم إيقاف التقاط السعر');
};

// الحصول على آخر سعر مستخرج
export const getLastExtractedPrice = (): number | null => {
  return lastExtractedPrice;
};

// إعادة ضبط الحالة
export const resetPriceCapture = () => {
  stopPriceCapture();
  lastExtractedPrice = null;
  priceElement = null;
};

// تنظيف الموارد
export const cleanupPriceCapture = async () => {
  stopPriceCapture();
  
  if (ocrWorker) {
    await ocrWorker.terminate();
    ocrWorker = null;
  }
  
  lastExtractedPrice = null;
  priceElement = null;
};
