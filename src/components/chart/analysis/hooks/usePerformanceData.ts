
import { useState, useEffect } from 'react';
import { 
  evaluateAnalysisPerformance,
  calculateDirectionAccuracy, 
  calculateStopLossRate 
} from "@/utils/technicalAnalysis/accuracy";

export interface TimeframeData {
  name: string;
  دقة_الاتجاه: number;
  معدل_وقف_الخسارة: number;
  التقييم_العام: number;
}

export const usePerformanceData = (analysisType: string) => {
  const [performance, setPerformance] = useState<any>(null);
  const [timeframeData, setTimeframeData] = useState<TimeframeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // جلب أداء التحليل الشامل
        const performanceData = await evaluateAnalysisPerformance(analysisType);
        setPerformance(performanceData);
        
        // جلب بيانات الأطر الزمنية المختلفة
        const directionAccuracyData = await calculateDirectionAccuracy(analysisType);
        const stopLossData = await calculateStopLossRate(analysisType);
        
        // إعداد بيانات الرسوم البيانية للأطر الزمنية
        const timeframes = Object.keys(directionAccuracyData.detailedStats);
        const tfData = timeframes.map(tf => {
          const dirAcc = directionAccuracyData.detailedStats[tf].accuracy;
          const slRate = tf in stopLossData.timeframeStats 
            ? stopLossData.timeframeStats[tf].stopLossRate 
            : 0;
          
          return {
            name: tf,
            دقة_الاتجاه: Math.round(dirAcc * 100),
            معدل_وقف_الخسارة: Math.round(slRate * 100),
            التقييم_العام: Math.round(((dirAcc * 0.7) + ((1 - slRate) * 0.3)) * 100)
          };
        });
        
        setTimeframeData(tfData);
      } catch (error) {
        console.error('خطأ في جلب بيانات الأداء:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [analysisType]);

  return { performance, timeframeData, loading };
};
