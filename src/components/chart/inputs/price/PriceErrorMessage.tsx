
import React from "react";

interface PriceErrorMessageProps {
  message: string;
  onSwitchToManual: () => void;
}

export const PriceErrorMessage: React.FC<PriceErrorMessageProps> = ({
  message,
  onSwitchToManual,
}) => {
  return (
    <div className="flex flex-col mt-1">
      <p className="text-sm text-red-500">{message}</p>
      <button 
        onClick={onSwitchToManual}
        className="text-xs text-blue-500 hover:underline mt-1"
      >
        التحويل إلى الإدخال اليدوي
      </button>
    </div>
  );
};
