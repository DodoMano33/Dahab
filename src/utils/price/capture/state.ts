
// حالة خدمة التقاط السعر
let captureInterval: NodeJS.Timeout | null = null;
let isCapturing = false;
let lastExtractedPrice: number | null = null;
let priceElement: HTMLElement | null = null;
let ocrWorker: any = null;

// الحصول على حالة التقاط
export const getCaptureState = () => ({
  isCapturing,
  lastExtractedPrice,
  hasPriceElement: priceElement !== null,
  hasOcrWorker: ocrWorker !== null
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

// تعيين محرك OCR
export const setOcrWorker = (worker: any) => {
  ocrWorker = worker;
};

// الحصول على محرك OCR
export const getOcrWorker = () => ocrWorker;

// تعيين فاصل التقاط
export const setCaptureInterval = (interval: NodeJS.Timeout | null) => {
  captureInterval = interval;
};

// الحصول على فاصل التقاط
export const getCaptureInterval = () => captureInterval;

// إعادة تعيين الحالة
export const resetState = () => {
  captureInterval = null;
  isCapturing = false;
  lastExtractedPrice = null;
  priceElement = null;
  // لا نعيد تعيين ocrWorker هنا لأنه سيتم تنظيفه في وظيفة منفصلة
};
