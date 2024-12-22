import { useEffect, useRef } from "react";

interface CanvasProps {
  image: string;
  analysis: any;
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
      // حساب النسبة للحفاظ على تناسق الصورة
      const ratio = Math.min(600 / img.width, 400 / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // رسم الصورة
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // إضافة الرسومات التحليلية إذا كان هناك تحليل
      if (analysis) {
        // هنا سيتم إضافة رسم خطوط الدعم والمقاومة والأنماط
        console.log("Drawing analysis overlays...");
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