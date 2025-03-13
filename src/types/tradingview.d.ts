
interface TradingViewWidget {
  widget: (config: any) => any;
  onChartReady: () => void;
  chart: () => {
    symbolExt: () => { last?: number };
    crossHairPrice: () => number;
    onSymbolChanged: () => {
      subscribe: (callback: null, handler: (symbolInfo: { name: string }) => void) => void;
    };
  };
}

declare global {
  interface Window {
    TradingView: any;
    tvWidget: any;
    lastPriceEvent?: {
      price: number;
      timestamp: string;
      source: string;
      method: string;
    };
  }
}

export {};
