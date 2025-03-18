
import React from 'react';

interface RecognizedTextDisplayProps {
  recognizedText: string;
  extractedPrice: number | null;
  enhancedImage?: string | null;
}

export const RecognizedTextDisplay: React.FC<RecognizedTextDisplayProps> = ({
  recognizedText,
  extractedPrice,
  enhancedImage
}) => {
  if (!recognizedText && !enhancedImage) return null;

  return (
    <div className="mt-4 text-center text-xs">
      {enhancedImage && (
        <div className="mt-2 mb-2">
          <p className="text-xs text-muted-foreground mb-1">الصورة بعد التحسين:</p>
          <div className="border border-gray-200 rounded p-1 inline-block">
            <img 
              src={enhancedImage} 
              alt="صورة محسنة" 
              className="max-w-full h-auto"
              style={{ maxHeight: '100px' }}
            />
          </div>
        </div>
      )}
      
      {recognizedText && (
        <>
          <p className="text-muted-foreground mb-1">النص المستخرج:</p>
          <div className="border border-gray-200 rounded p-2 bg-slate-50 dark:bg-slate-900 text-right">
            <pre className="whitespace-pre-wrap break-words text-xs font-mono">{recognizedText}</pre>
          </div>

          {extractedPrice && (
            <p className="mt-1">
              <span className="font-semibold">السعر المستخرج: </span>
              <span className="text-green-600 font-bold">{extractedPrice.toFixed(2)}</span>
            </p>
          )}
        </>
      )}
    </div>
  );
};
