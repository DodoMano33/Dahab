interface TradingViewWidget {
  widget: (config: {
    container_id: string;
    width?: string | number;
    height?: string | number;
    symbol: string;
    interval?: string;
    timezone?: string;
    theme?: string;
    style?: string;
    locale?: string;
    toolbar_bg?: string;
    enable_publishing?: boolean;
    hide_side_toolbar?: boolean;
    allow_symbol_change?: boolean;
    save_image?: boolean;
    studies?: string[];
    autosize?: boolean;
  }) => any;
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
    TradingView: {
      widget: new (config: any) => TradingViewWidget;
    };
  }
}

export {};