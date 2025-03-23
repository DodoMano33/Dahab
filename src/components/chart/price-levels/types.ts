
// تعريفات الأنواع المشتركة لمكونات مستويات الأسعار
export interface PriceLevelData {
  price: number | null;
  label: string;
  id?: string;
}

export type PriceDirection = 'up' | 'down' | null;
