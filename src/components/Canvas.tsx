import { useEffect, useRef } from "react";

interface CanvasProps {
  image: string;
  analysis: {
    pattern: string;
    direction: string;
    support: number;
    resistance: number;
    targets?: number[];
  };
}

export const Canvas = ({ image, analysis }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

      // رسم الصورة
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (analysis) {
        // رسم خط الدعم
        ctx.beginPath();
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;
        ctx.moveTo(0, canvas.height - (analysis.support * ratio));
        ctx.lineTo(canvas.width, canvas.height - (analysis.support * ratio));
        ctx.stroke();

        // رسم خط المقاومة
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.moveTo(0, canvas.height - (analysis.resistance * ratio));
        ctx.lineTo(canvas.width, canvas.height - (analysis.resistance * ratio));
        ctx.stroke();

        // رسم الاتجاه المتوقع
        const arrowLength = 50;
        const arrowAngle = analysis.direction === "صاعد" ? Math.PI / 6 : -Math.PI / 6;
        
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 3;
        
        const startX = canvas.width * 0.7;
        const startY = canvas.height * 0.5;
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
            const y = canvas.height - (target * ratio);
            
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = "purple";
            ctx.lineWidth = 1;
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
            ctx.setLineDash([]);

            // كتابة قيمة الهدف
            ctx.font = "12px Arial";
            ctx.fillStyle = "purple";
            ctx.fillText(`الهدف ${index + 1}: ${target}`, 10, y - 5);
          });
        }
      }
    };
  }, [image, analysis]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-auto border border-gray-200 rounded-lg"
    />
  );
};