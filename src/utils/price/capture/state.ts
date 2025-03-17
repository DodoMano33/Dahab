
// حالة خدمة التقاط السعر
let isCapturing = false;
let lastExtractedPrice: number | null = null;
let priceElement: HTMLElement | null = null;
let captureInterval: NodeJS.Timeout | null = null;
let ocrWorker: any = null; // نوع محرك OCR

// الحصول على حالة التقاط
export const getCaptureState = () => ({
  isCapturing,
  lastExtractedPrice,
  hasPriceElement: priceElement !== null
});

// تعيين العنصر المستهدف
export const setPriceElement = (element: HTMLElement | null) => {
  priceElement = element;
};

// الحصول على عنصر السعر الحالي
export const getPriceElement = () => priceElement;

// تعيين آخر سعر مستخرج
export const setLastExtractedPrice = (price: number | null) => {
  lastExtractedPrice = price;
};

// الحصول على آخر سعر مستخرج
export const getLastExtractedPrice = (): number | null => {
  return lastExtractedPrice;
};

// تعيين حالة التقاط
export const setCapturingState = (state: boolean) => {
  isCapturing = state;
};

// الحصول على حالة التقاط
export const isCapturingActive = () => isCapturing;

// إعادة تعيين الحالة
export const resetState = () => {
  isCapturing = false;
  lastExtractedPrice = null;
  priceElement = null;
};

// إضافة وظائف لإدارة فاصل التقاط
export const setCaptureInterval = (interval: NodeJS.Timeout | null) => {
  captureInterval = interval;
};

export const getCaptureInterval = (): NodeJS.Timeout | null => {
  return captureInterval;
};

// إضافة وظائف لإدارة محرك OCR
export const setOcrWorker = (worker: any) => {
  ocrWorker = worker;
};

export const getOcrWorker = () => {
  return ocrWorker;
};
