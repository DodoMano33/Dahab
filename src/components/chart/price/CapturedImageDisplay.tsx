
import React from 'react';

interface CapturedImageDisplayProps {
  capturedImage: string | null;
  captureAttempts: number;
  widthInPx: number;
  heightInPx: number;
  onManualCapture: () => void;
}

export const CapturedImageDisplay: React.FC<CapturedImageDisplayProps> = ({
  capturedImage,
  captureAttempts,
  widthInPx,
  heightInPx,
  onManualCapture
}) => {
  return (
    <div className="mt-2 text-center">
      {captureAttempts > 0 && (
        <p className="text-xs text-slate-400 mb-1">
          عدد محاولات استخراج السعر: {captureAttempts}
        </p>
      )}
      
      {capturedImage && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-1">الصورة الملتقطة:</p>
          <div className="border border-gray-200 rounded p-1 inline-block">
            <img 
              src={capturedImage} 
              alt="صورة ويدجيت التداول" 
              className="max-w-full h-auto"
              style={{ maxWidth: `${widthInPx}px`, maxHeight: `${heightInPx}px` }}
            />
          </div>
          
          <button 
            onClick={onManualCapture}
            className="mt-2 text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            التقاط صورة جديدة
          </button>
        </div>
      )}
      
      {!capturedImage && (
        <button 
          onClick={onManualCapture}
          className="mt-2 text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          التقاط صورة
        </button>
      )}
    </div>
  );
};
