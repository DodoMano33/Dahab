import { ImageUploader } from "../ImageUploader";
import { TradingViewSelector } from "../TradingViewSelector";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";

type AnalysisMode = 'upload' | 'tradingview';

interface ChartInputProps {
  mode: AnalysisMode;
  onImageCapture: (imageData: string) => void;
  onTradingViewConfig: (symbol: string, timeframe: string) => void;
  isAnalyzing: boolean;
}

export const ChartInput = ({ 
  mode, 
  onImageCapture, 
  onTradingViewConfig, 
  isAnalyzing 
}: ChartInputProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-right">
        {mode === 'upload' ? 'تحميل الشارت' : 'تحليل من TradingView'}
      </h2>
      
      {mode === 'upload' ? (
        <>
          <ImageUploader onImageCapture={onImageCapture} />
          <div className="flex gap-4 mt-4 justify-center">
            <Button 
              variant="outline"
              onClick={() => document.getElementById('fileInput')?.click()}
              className="hover:bg-gray-100"
            >
              <Upload className="ml-2" />
              تحميل صورة
            </Button>
            
            <Button
              variant="outline"
              onClick={() => document.getElementById('cameraInput')?.click()}
              className="hover:bg-gray-100"
            >
              <Camera className="ml-2" />
              التقاط صورة
            </Button>
          </div>
        </>
      ) : (
        <TradingViewSelector 
          onConfigSubmit={onTradingViewConfig}
          isLoading={isAnalyzing}
        />
      )}
    </div>
  );
};