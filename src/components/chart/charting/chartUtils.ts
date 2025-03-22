
import { Chart as ChartJS } from "chart.js";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { SearchHistoryItem } from "@/types/analysis";

export const formatChartLabels = (activeAnalyses: SearchHistoryItem[]) => {
  return activeAnalyses.map(item => 
    `${item.symbol} - ${item.timeframe} - ${format(new Date(item.date), 'MM/dd HH:mm', { locale: ar })}`
  );
};

export const getChartOptions = (isTargets: boolean, currentPrice: number | null) => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        rtl: true,
        labels: {
          font: {
            family: 'Tajawal, sans-serif'
          }
        }
      },
      tooltip: {
        rtl: true,
        titleFont: {
          family: 'Tajawal, sans-serif'
        },
        bodyFont: {
          family: 'Tajawal, sans-serif'
        },
        callbacks: {
          label: function(context: any) {
            const datasetIndex = context.datasetIndex;
            const value = context.raw;
            
            if (datasetIndex === 0) {
              return `${isTargets ? 'الهدف الأول' : 'وقف الخسارة'}: ${value.toFixed(4)}`;
            } else {
              return `السعر الحالي: ${currentPrice?.toFixed(4) || ''}`;
            }
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          font: {
            family: 'Tajawal, sans-serif'
          },
          callback: function(value: any) {
            return value.toFixed(2);
          }
        }
      },
      x: {
        ticks: {
          font: {
            family: 'Tajawal, sans-serif'
          },
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };
};

export const prepareChartData = (
  labels: string[],
  dataPoints: number[],
  currentPrice: number | null,
  isTargets: boolean
) => {
  return {
    labels,
    datasets: [
      {
        label: isTargets ? 'الهدف الأول' : 'وقف الخسارة',
        data: dataPoints,
        borderColor: isTargets ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 159, 64, 1)',
        backgroundColor: isTargets ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 159, 64, 0.2)',
        pointRadius: 5,
        pointHoverRadius: 8
      },
      {
        label: 'السعر الحالي',
        data: labels.map(() => currentPrice || 0),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderDash: [5, 5],
        pointRadius: 0
      }
    ]
  };
};
