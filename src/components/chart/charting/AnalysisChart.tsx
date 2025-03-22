
import { useEffect, useRef, useState } from "react";
import { Chart as ChartJS, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip as ChartTooltip, Legend } from "chart.js";
import { getChartOptions, prepareChartData } from "./chartUtils";

// Register chart components
ChartJS.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, ChartTooltip, Legend);

interface AnalysisChartProps {
  labels: string[];
  dataPoints: number[];
  currentPrice: number | null;
  isTargets: boolean;
}

export const AnalysisChart = ({ 
  labels, 
  dataPoints, 
  currentPrice, 
  isTargets 
}: AnalysisChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chart, setChart] = useState<ChartJS | null>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Cleanup previous chart
    if (chart) chart.destroy();
    
    // Create chart data
    const chartData = prepareChartData(labels, dataPoints, currentPrice, isTargets);
    
    // Create new chart
    const newChart = new ChartJS(chartRef.current, {
      type: 'line',
      data: chartData,
      options: getChartOptions(isTargets, currentPrice)
    });
    
    setChart(newChart);
    
    return () => {
      if (newChart) newChart.destroy();
    };
  }, [labels, dataPoints, currentPrice, isTargets]);
  
  return (
    <div className="h-[400px] w-full">
      <canvas ref={chartRef} />
    </div>
  );
};
