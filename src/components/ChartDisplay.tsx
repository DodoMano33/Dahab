import { Canvas } from "./Canvas";
import { AnalysisResult } from "./AnalysisResult";
import { AnalysisData } from "@/types/analysis";
import { useEffect, useState } from "react";
import { priceUpdater } from "@/utils/priceUpdater";

interface ChartDisplayProps {
  image: string | null;
  analysis: AnalysisData | null;
  isAnalyzing: boolean;
  onClose: () => void;
  symbol?: string;
}

export const ChartDisplay = ({ image, analysis, isAnalyzing, onClose, symbol }: ChartDisplayProps) => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!symbol) return;

    const onUpdate = (price: number) => {
      setCurrentPrice(price);
    };

    const onError = (error: Error) => {
      console.error("Error updating price:", error);
    };

    priceUpdater.subscribe({ symbol, onUpdate, onError });

    return () => {
      priceUpdater.unsubscribe(symbol, onUpdate);
    };
  }, [symbol]);

  return (
    <div className="space-y-8">
      {symbol && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 p-2 rounded-lg shadow-lg w-36">
          <div className="text-center">
            <div className="text-white text-xs mb-0.5">السعر الحالي</div>
            <div className="text-white text-lg font-bold">{currentPrice || '...'}</div>
            <div className="text-white text-xs opacity-75">{symbol}</div>
          </div>
        </div>
      )}

      {image && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-right">تحليل الشارت</h2>
          <Canvas image={image} analysis={analysis!} onClose={onClose} />
        </div>
      )}

      {analysis && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-right">نتائج التحليل</h2>
          <AnalysisResult analysis={analysis} isLoading={isAnalyzing} />
        </div>
      )}
    </div>
  );
};