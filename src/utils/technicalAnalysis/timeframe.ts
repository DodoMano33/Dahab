
export const getTimeframeMultipliers = (timeframe: string) => {
  switch (timeframe) {
    case '1m':
      return [0.05, 0.1, 0.15];
    case '5m':
      return [0.1, 0.2, 0.3];
    case '15m':
      return [0.15, 0.3, 0.45];
    case '30m':
      return [0.2, 0.4, 0.6]; 
    case '1h':
      return [0.3, 0.6, 0.9];
    case '4h':
      return [0.5, 1.0, 1.5];
    case '1d':
      return [0.8, 1.6, 2.4];
    case '1w':
      return [1.0, 2.0, 3.0];
    default:
      return [0.25, 0.5, 0.75];
  }
};

export const getStopLossMultiplier = (timeframe: string) => {
  switch (timeframe) {
    case '1m':
      return 0.03;
    case '5m':
      return 0.05;
    case '15m':
      return 0.07;
    case '30m':
      return 0.1;
    case '1h':
      return 0.15;
    case '4h':
      return 0.2;
    case '1d':
      return 0.3;
    case '1w':
      return 0.4;
    default:
      return 0.1;
  }
};

export const getRangeMultiplier = (timeframe: string) => {
  switch (timeframe) {
    case '1m':
      return 0.1;
    case '5m':
      return 0.15;
    case '15m':
      return 0.2;
    case '30m':
      return 0.25;
    case '1h':
      return 0.3;
    case '4h':
      return 0.35;
    case '1d':
      return 0.4;
    case '1w':
      return 0.45;
    default:
      return 0.25;
  }
};

export const getEntryMultiplier = (timeframe: string) => {
  switch (timeframe) {
    case '1m':
      return 0.01;
    case '5m':
      return 0.015;
    case '15m':
      return 0.02;
    case '30m':
      return 0.025;
    case '1h':
      return 0.03;
    case '4h':
      return 0.04;
    case '1d':
      return 0.05;
    case '1w':
      return 0.06;
    default:
      return 0.02;
  }
};

export const getTimeframeLabel = (timeframe: string) => {
  switch (timeframe) {
    case '1m':
      return 'دقيقة واحدة';
    case '5m':
      return '5 دقائق';
    case '15m':
      return '15 دقيقة';
    case '30m':
      return '30 دقيقة';
    case '1h':
      return 'ساعة واحدة';
    case '4h':
      return '4 ساعات';
    case '1d':
      return 'يوم واحد';
    case '1w':
      return 'أسبوع واحد';
    default:
      return timeframe;
  }
};
