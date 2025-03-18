
import React from 'react';

interface CapturedImageDisplayProps {
  capturedImage: string | null;
  captureAttempts: number;
  widthInPx: number;
  heightInPx: number;
  onManualCapture: () => void;
}

export const CapturedImageDisplay: React.FC<CapturedImageDisplayProps> = ({
  captureAttempts
}) => {
  return (
    <>
      {captureAttempts > 0 && (
        <p className="text-xs text-center text-slate-400 mt-2">
          عدد محاولات استخراج السعر: {captureAttempts}
        </p>
      )}
    </>
  );
};
