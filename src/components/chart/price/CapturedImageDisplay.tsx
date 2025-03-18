
import React from 'react';
import { cn } from '@/lib/utils';

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
    <>
      {/* المستطيل الذي يعرض الصورة الملتقطة من ويدجيت TradingView */}
      <div 
        className={cn(
          "mt-4 mx-auto border-2 border-slate-200 rounded-md",
          "flex items-center justify-center overflow-hidden"
        )}
        style={{ 
          width: `${widthInPx}px`, 
          height: `${heightInPx}px`,
        }}
      >
        {capturedImage ? (
          <img 
            src={capturedImage} 
            alt="سعر TradingView" 
            className="object-contain w-full h-full"
            onError={(e) => console.error("خطأ في تحميل الصورة:", e)}
          />
        ) : (
          <div className="text-sm text-slate-400">
            جاري التقاط الصورة... (محاولة #{captureAttempts})
          </div>
        )}
      </div>
      
      {/* زر يدوي لإعادة محاولة التقاط الصورة */}
      <div className="text-center mt-2">
        <button
          onClick={onManualCapture}
          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          تحديث الصورة
        </button>
        
        {captureAttempts > 0 && !capturedImage && (
          <p className="text-xs text-red-500">
            لم يتم العثور على ويدجت TradingView بعد {captureAttempts} محاولات
          </p>
        )}
      </div>
    </>
  );
};
