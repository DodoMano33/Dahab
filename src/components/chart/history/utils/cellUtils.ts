
/**
 * Shared utilities for cell components
 */

// Number formatting utility
export const formatNumber = (num: number | undefined): string => {
  if (num === undefined) return "غير محدد";
  return Number(num).toFixed(3);
};

// Price validation utility
export const validatePrice = (price: number | string | null | undefined): number | undefined => {
  if (price === null || price === undefined) return undefined;
  
  // Convert to number if string
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Check if it's a valid number
  return !isNaN(Number(numericPrice)) ? numericPrice : undefined;
};

// Get appropriate class based on status
export const getStatusClassName = (isSuccess: boolean, isActive: boolean = true): string => {
  if (!isActive) return 'text-muted-foreground';
  return isSuccess ? 'text-green-600 font-semibold' : '';
};
