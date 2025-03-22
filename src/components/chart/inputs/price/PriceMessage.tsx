
import React from "react";

interface PriceMessageProps {
  displayPrice: string;
  isAutoPrice: boolean;
  isLoading: boolean;
  hasError: boolean;
}

export const PriceMessage: React.FC<PriceMessageProps> = ({
  displayPrice,
  isAutoPrice,
  isLoading,
  hasError,
}) => {
  if (isLoading || hasError) return null;

  if (isAutoPrice) {
    return (
      <p className="text-sm text-blue-500 mt-1">
        السعر الحالي (Metal Price API): {displayPrice}
      </p>
    );
  }
  
  return (
    <p className="text-sm text-green-500 mt-1">
      السعر المدخل يدوياً: {displayPrice}
    </p>
  );
};
