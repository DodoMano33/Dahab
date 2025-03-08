import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisData } from "@/types/analysis";

interface CanvasProps {
  image: string;
  analysis: AnalysisData;
  onClose: () => void;
}

export const Canvas = ({ image, analysis, onClose }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

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
      const containerWidth = containerRef.current?.clientWidth || 600;
      const containerHeight = containerRef.current?.clientHeight || 400;
      const ratio = Math.min(containerWidth / img.width, containerHeight / img.height);
      
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // تطبيق التكبير/التصغير على كامل المحتوى
      ctx.save();
      ctx.scale(scale, scale);

      // رسم الصورة
      ctx.drawImage(img, 0, 0, canvas.width / scale, canvas.height / scale);

      if (analysis) {
        // رسم خط الدعم
        ctx.beginPath();
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;
        const supportY = (canvas.height - ((analysis.support / img.height) * canvas.height)) / scale;
        ctx.moveTo(0, supportY);
        ctx.lineTo(canvas.width / scale, supportY);
        ctx.stroke();

        // رسم خط المقاومة
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        const resistanceY = (canvas.height - ((analysis.resistance / img.height) * canvas.height)) / scale;
        ctx.moveTo(0, resistanceY);
        ctx.lineTo(canvas.width / scale, resistanceY);
        ctx.stroke();

        // رسم نقطة وقف الخسارة
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.fillStyle = "red";
        const stopLossY = (canvas.height - ((analysis.stopLoss / img.height) * canvas.height)) / scale;
        ctx.arc(30, stopLossY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = `${12/scale}px Arial`;
        ctx.fillText(`وقف الخسارة ${analysis.stopLoss}`, 40, stopLossY);

        // رسم الاتجاه المتوقع
        const arrowLength = 50 / scale;
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
        ctx.lineTo(endX - 10 * Math.cos(arrowAngle - Math.PI / 6) / scale,
                  endY - 10 * Math.sin(arrowAngle - Math.PI / 6) / scale);
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - 10 * Math.cos(arrowAngle + Math.PI / 6) / scale,
                  endY - 10 * Math.sin(arrowAngle + Math.PI / 6) / scale);
        ctx.stroke();

        // رسم الأهداف المتوقعة
        if (analysis.targets) {
          analysis.targets.forEach((target, index) => {
            const targetY = (canvas.height - ((target.price / img.height) * canvas.height)) / scale;
            
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = "purple";
            ctx.lineWidth = 1;
            ctx.moveTo(0, targetY);
            ctx.lineTo(canvas.width / scale, targetY);
            ctx.stroke();
            ctx.setLineDash([]);

            // كتابة قيمة الهدف
            ctx.font = `${12/scale}px Arial`;
            ctx.fillStyle = "purple";
            ctx.fillText(`الهدف ${index + 1}: ${target.price}`, 10, targetY - 5);
          });
        }
      }
      ctx.restore();
    };
  }, [image, analysis, scale]);

  return (
    <div className="relative bg-white p-4 rounded-lg shadow-lg" ref={containerRef}>
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button variant="outline" size="icon" onClick={handleZoomIn} className="bg-white">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut} className="bg-white">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onClose} className="bg-white">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="overflow-auto max-h-[80vh]" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <canvas
          ref={canvasRef}
          className="border border-gray-200 rounded-lg"
        />
      </div>
    </div>
  );
};