import { useState, useRef } from "react";

interface ImageUploaderProps {
  onImageCapture: (imageData: string) => void;
}

export const ImageUploader = ({ onImageCapture }: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="text-center">
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
    </div>
  );
};