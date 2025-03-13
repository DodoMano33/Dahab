
export interface PriceRecord {
  price: number;
  timestamp: Date;
  source: string;
}

export interface PriceExtractorProps {
  defaultInterval?: number;
  onPriceExtracted?: (price: number) => void;
}
