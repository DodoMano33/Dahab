
import { PriceData } from '../indicators/types';

// وظيفة مساعدة لتحويل مصفوفة أسعار الإغلاق إلى كائنات PriceData
export const convertToPriceData = (
  timestamps: number[],
  open: number[],
  high: number[],
  low: number[],
  close: number[],
  volume?: number[]
): PriceData[] => {
  return timestamps.map((timestamp, i) => ({
    timestamp,
    open: open[i],
    high: high[i],
    low: low[i],
    close: close[i],
    volume: volume ? volume[i] : undefined
  }));
};
