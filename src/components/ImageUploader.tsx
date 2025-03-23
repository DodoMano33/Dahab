
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Clipboard } from "lucide-react";
import { getTradingViewChartImage } from "@/utils/tradingViewUtils";

interface ImageUploaderProps {
  onImageCapture: (imageData: string) => void;
  symbol?: string;
  timeframe?: string;
  currentPrice?: number;
}

export const ImageUploader = ({ 
  onImageCapture, 
  symbol = "XAUUSD", 
  timeframe = "1d", 
  currentPrice = 0 
}: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageCapture(reader.result as string);
        toast.success("تم تحميل الصورة بنجاح");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptureChart = async () => {
    try {
      setIsCapturing(true);
      const chartImage = await getTradingViewChartImage(
        symbol,
        timeframe,
        currentPrice
      );
      onImageCapture(chartImage);
      toast.success("تم التقاط صورة الشارت بنجاح");
    } catch (error) {
      console.error("فشل في التقاط الشارت:", error);
      toast.error("فشل في التقاط صورة الشارت");
    } finally {
      setIsCapturing(false);
    }
  };

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              onImageCapture(reader.result as string);
              toast.success("تم لصق الصورة بنجاح");
            };
            reader.readAsDataURL(file);
          }
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [onImageCapture]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          رفع صورة
        </Button>
        
        <Button 
          type="button" 
          variant="outline"
          onClick={() => cameraInputRef.current?.click()}
          className="flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          التقاط صورة
        </Button>
        
        <Button 
          type="button" 
          variant="default"
          onClick={handleCaptureChart}
          disabled={isCapturing}
          className="flex items-center gap-2"
        >
          <Clipboard className="w-4 h-4" />
          {isCapturing ? "جاري الالتقاط..." : "التقاط الشارت الحالي"}
        </Button>
      </div>
      
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      <input
        id="cameraInput"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        ref={cameraInputRef}
        className="hidden"
      />
      <p className="text-sm text-gray-500 mt-2 text-center">
        يمكنك أيضاً لصق الصورة مباشرة (Ctrl+V)
      </p>
    </div>
  );
};
