import { Canvas } from "../Canvas";
import { AnalysisResult } from "../AnalysisResult";
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

      {symbol && (
        <div className="fixed bottom-4 left-4 bg-red-600 p-4 rounded-lg shadow-lg w-64">
          <div className="text-center">
            <div className="text-white text-sm mb-1">السعر الحالي</div>
            <div className="text-white text-2xl font-bold">{currentPrice || '...'}</div>
            <div className="text-white text-sm opacity-75">{symbol}</div>
          </div>
        </div>
      )}
    </div>
  );
};