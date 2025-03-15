
// توسيع الأنواع الحالية بإضافة ما نحتاجه لقارئ الشاشة

export interface PriceUpdate {
  price: number;
  symbol: string;
  timestamp: number;
}

export interface ScreenReaderOptions {
  interval?: number;
  defaultPrice?: number;
  targetCoordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface MarketStatus {
  isOpen: boolean;
  lastUpdated: number;
}
