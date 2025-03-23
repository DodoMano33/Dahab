
/**
 * Utilities for formatting and evaluating analysis performance data
 */

/**
 * Format a decimal value as a percentage with one decimal place
 */
export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

/**
 * Format hours into a human-readable time format
 */
export const formatTime = (hours: number): string => {
  if (hours < 1) {
    return `${Math.round(hours * 60)} دقيقة`;
  } else if (hours < 24) {
    return `${hours.toFixed(1)} ساعة`;
  } else {
    return `${(hours / 24).toFixed(1)} يوم`;
  }
};

/**
 * Get CSS class for rating based on value and metric type
 */
export const getRatingClass = (value: number, metric: string): string => {
  if (metric === 'stopLossRate') {
    if (value < 0.2) return 'text-green-600';
    if (value < 0.4) return 'text-yellow-600';
    return 'text-red-600';
  } else {
    if (value > 0.7) return 'text-green-600';
    if (value > 0.5) return 'text-yellow-600';
    return 'text-red-600';
  }
};

/**
 * Calculate progress value based on metric type and performance data
 */
export const calculateProgressValue = (
  performance: Record<string, any>,
  selectedCategory: string
): number => {
  if (selectedCategory === 'stopLossRate') {
    // Make sure to convert to a number before performing arithmetic
    return (1 - (performance.stopLossRate as number)) * 100;
  }
  
  // Type assertion to ensure we're working with a number before multiplication
  const value = performance[selectedCategory];
  if (typeof value === 'number') {
    return value * 100;
  }
  
  // Default case if value is not a number
  return 0;
};
