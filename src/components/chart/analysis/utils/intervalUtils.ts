export const getIntervalInMs = (interval: string): number => {
  const intervals: { [key: string]: number } = {
    "1m": 60000,
    "5m": 300000,
    "30m": 1800000,
    "1h": 3600000,
    "4h": 14400000,
    "1d": 86400000
  };
  return intervals[interval] || 60000;
};