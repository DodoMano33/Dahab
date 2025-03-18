
import React from 'react';

interface RecognizedTextDisplayProps {
  recognizedText: string;
  extractedPrice: number | null;
}

export const RecognizedTextDisplay: React.FC<RecognizedTextDisplayProps> = ({
  recognizedText,
  extractedPrice
}) => {
  if (!recognizedText) return null;
  
  return (
    <div className="mt-2 text-xs text-center text-gray-600">
      <div>النص المستخرج: <span className="font-mono">{recognizedText}</span></div>
      {extractedPrice && (
        <div className="font-bold text-green-600">
          السعر المستخرج: {extractedPrice.toFixed(2)}
        </div>
      )}
    </div>
  );
};
