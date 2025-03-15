
import html2canvas from 'html2canvas';

/**
 * التقاط صورة للعنصر
 */
export const captureElement = async (element: HTMLElement): Promise<string> => {
  try {
    console.log('جاري التقاط صورة لعنصر السعر...');
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      logging: false,
      scale: 3, // زيادة الدقة للحصول على نتائج OCR أفضل
    });
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('فشل في التقاط صورة للعنصر:', error);
    throw error;
  }
};
