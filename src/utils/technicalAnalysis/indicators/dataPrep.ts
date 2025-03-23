
import { PriceData } from "./types";

// وظيفة مساعدة لتحويل البيانات إلى التنسيق المطلوب لبعض المؤشرات
export const prepareDataForIndicators = (data: PriceData[]): {
  open: number[],
  high: number[],
  low: number[],
  close: number[],
  volume: number[]
} => {
  return {
    open: data.map(d => d.open),
    high: data.map(d => d.high),
    low: data.map(d => d.low),
    close: data.map(d => d.close),
    volume: data.map(d => d.volume || 0)
  };
};
