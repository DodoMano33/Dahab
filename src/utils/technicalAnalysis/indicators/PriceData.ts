
export interface PriceDataPoint {
  time: Date | string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export class PriceData {
  data: PriceDataPoint[];
  
  constructor(data: PriceDataPoint[]) {
    this.data = data;
  }
  
  getCloseValues(): number[] {
    return this.data.map(d => d.close);
  }
  
  getHighValues(): number[] {
    return this.data.map(d => d.high);
  }
  
  getLowValues(): number[] {
    return this.data.map(d => d.low);
  }
  
  getOpenValues(): number[] {
    return this.data.map(d => d.open);
  }
  
  getVolumeValues(): number[] {
    return this.data.map(d => d.volume || 0);
  }
  
  getTimes(): (Date | string)[] {
    return this.data.map(d => d.time);
  }
  
  getLastClose(): number {
    if (this.data.length === 0) return 0;
    return this.data[this.data.length - 1].close;
  }
  
  getLastHigh(): number {
    if (this.data.length === 0) return 0;
    return this.data[this.data.length - 1].high;
  }
  
  getLastLow(): number {
    if (this.data.length === 0) return 0;
    return this.data[this.data.length - 1].low;
  }
  
  getLastOpen(): number {
    if (this.data.length === 0) return 0;
    return this.data[this.data.length - 1].open;
  }
  
  slice(start: number, end?: number): PriceData {
    return new PriceData(this.data.slice(start, end));
  }
  
  static fromImageData(chartImage: string, currentPrice: number): PriceData {
    // This is a simple mock implementation that creates fictional price data
    // In a real scenario, this would analyze the image to extract price data
    console.log("Creating mock price data from chart image");
    
    const data: PriceDataPoint[] = [];
    const now = new Date();
    
    // Generate 30 days of mock data
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Create some variance in the price
      const variance = 0.02; // 2% variance
      const randomFactor = 1 + (Math.random() * variance * 2 - variance);
      
      let close = i === 0 ? currentPrice : currentPrice * randomFactor;
      
      // Add some randomness to create open, high, low
      const dailyVolatility = 0.01; // 1% intraday volatility
      const open = close * (1 + (Math.random() * dailyVolatility * 2 - dailyVolatility));
      const high = Math.max(open, close) * (1 + Math.random() * dailyVolatility);
      const low = Math.min(open, close) * (1 - Math.random() * dailyVolatility);
      
      data.push({
        time: date,
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 10000) + 1000
      });
    }
    
    return new PriceData(data);
  }
}
