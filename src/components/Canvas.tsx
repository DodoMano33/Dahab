import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CanvasProps {
  image: string;
  analysis: {
    pattern: string;
    direction: string;
    support: number;
    resistance: number;
    stopLoss: number;
    targets?: number[];
  };
  onClose: () => void;
}

export const Canvas = ({ image, analysis, onClose }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

  useEffect(() => {
    if (!canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      console.log("Drawing image and analysis...");
      
      // حساب النسبة للحفاظ على تناسق الصورة
      const ratio = Math.min(600 / img.width, 400 / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // تطبيق التكبير/التصغير
      ctx.save();
      ctx.scale(scale, scale);

      // رسم الصورة
      ctx.drawImage(img, 0, 0, canvas.width / scale, canvas.height / scale);

      if (analysis) {
        // رسم خط الدعم
        ctx.beginPath();
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;
        ctx.moveTo(0, (canvas.height - (analysis.support * ratio)) / scale);
        ctx.lineTo(canvas.width / scale, (canvas.height - (analysis.support * ratio)) / scale);
        ctx.stroke();

        // رسم خط المقاومة
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.moveTo(0, (canvas.height - (analysis.resistance * ratio)) / scale);
        ctx.lineTo(canvas.width / scale, (canvas.height - (analysis.resistance * ratio)) / scale);
        ctx.stroke();

        // رسم نقطة وقف الخسارة
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.fillStyle = "red";
        const stopLossY = (canvas.height - (analysis.stopLoss * ratio)) / scale;
        ctx.arc(30, stopLossY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = "12px Arial";
        ctx.fillText("وقف الخسارة", 40, stopLossY);

        // رسم الاتجاه المتوقع
        const arrowLength = 50;
        const arrowAngle = analysis.direction === "صاعد" ? Math.PI / 6 : -Math.PI / 6;
        
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 3;
        
        const startX = (canvas.width * 0.7) / scale;
        const startY = (canvas.height * 0.5) / scale;
        const endX = startX + (arrowLength * Math.cos(arrowAngle));
        const endY = startY + (arrowLength * Math.sin(arrowAngle));
        
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        
        // رسم رأس السهم
        ctx.lineTo(endX - 10 * Math.cos(arrowAngle - Math.PI / 6),
                  endY - 10 * Math.sin(arrowAngle - Math.PI / 6));
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - 10 * Math.cos(arrowAngle + Math.PI / 6),
                  endY - 10 * Math.sin(arrowAngle + Math.PI / 6));
        ctx.stroke();

        // رسم الأهداف المتوقعة
        if (analysis.targets) {
          analysis.targets.forEach((target, index) => {
            const y = (canvas.height - (target * ratio)) / scale;
            
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = "purple";
            ctx.lineWidth = 1;
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width / scale, y);
            ctx.stroke();
            ctx.setLineDash([]);

            // كتابة قيمة الهدف
            ctx.font = "12px Arial";
            ctx.fillStyle = "purple";
            ctx.fillText(`الهدف ${index + 1}: ${target}`, 10, y - 5);
          });
        }
      }
      ctx.restore();
    };
  }, [image, analysis, scale]);

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 flex gap-2">
        <Button variant="outline" size="icon" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-auto border border-gray-200 rounded-lg"
      />
    </div>
  );
};