export const calculateStandardDeviation = (arr: number[]): number => {
  const mean = arr.reduce((a, b) => a + b) / arr.length;
  return Math.sqrt(arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / arr.length);
};