export const calculateFibonacciLevels = (high: number, low: number) => {
  const difference = high - low;
  const levels = [0.236, 0.382, 0.618];
  
  return levels.map(level => ({
    level,
    price: Number((high - difference * level).toFixed(2))
  }));
};