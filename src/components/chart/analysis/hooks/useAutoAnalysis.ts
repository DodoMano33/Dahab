
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface StartAutoAnalysisParams {
  timeframes: string[];
  interval: string;
  analysisTypes: string[];
  repetitions: number;
  currentPrice: number; // سيكون قيمة ثابتة الآن
  symbol: string;
  duration: number;
  onAnalysisComplete?: (result: any) => void;
}

export const useAutoAnalysis = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [totalIterations, setTotalIterations] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [metrics, setMetrics] = useState<any>({});
  const [lastResult, setLastResult] = useState<any>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stopRequestRef = useRef(false);
  const analysisPromiseRef = useRef<Promise<any> | null>(null);
  
  const cleanupTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  useEffect(() => {
    return () => {
      cleanupTimer();
      stopRequestRef.current = true;
    };
  }, [cleanupTimer]);
  
  const startAutoAnalysis = useCallback(async ({
    timeframes,
    interval,
    analysisTypes,
    repetitions,
    currentPrice,
    symbol,
    duration,
    onAnalysisComplete
  }: StartAutoAnalysisParams) => {
    if (isRunning) {
      console.warn("Auto analysis is already running");
      return;
    }
    
    // إيقاف أي عملية تحليل سابقة
    stopRequestRef.current = false;
    setIsRunning(true);
    
    const totalReps = repetitions > 0 ? repetitions : 1;
    let iterations = 0;
    setTotalIterations(totalReps);
    setCurrentIteration(0);
    
    try {
      console.log(`Starting auto analysis for symbol ${symbol} with ${totalReps} iterations`);
      
      for (let i = 0; i < totalReps; i++) {
        if (stopRequestRef.current) {
          console.log("Auto analysis stopped by user");
          break;
        }
        
        // التحديثات لمؤشرات التقدم
        setCurrentIteration(i + 1);
        setRemainingTime((totalReps - i) * parseInt(interval));
        
        console.log(`Iteration ${i + 1}/${totalReps}`);
        
        try {
          // اختيار نوع تحليل عشوائي من القائمة المتاحة
          const randomTypeIndex = Math.floor(Math.random() * analysisTypes.length);
          const randomAnalysisType = analysisTypes[randomTypeIndex];
          
          // اختيار إطار زمني عشوائي من القائمة المتاحة
          const randomTimeframeIndex = Math.floor(Math.random() * timeframes.length);
          const randomTimeframe = timeframes[randomTimeframeIndex];
          
          console.log(`Using analysis type: ${randomAnalysisType}, timeframe: ${randomTimeframe}`);
          
          // تحميل مكون AnalysisHandler ديناميكيًا
          const AnalysisHandlerModule = await import("../../analysis/AnalysisHandler");
          const handler = AnalysisHandlerModule.useAnalysisHandler();
          
          // إجراء التحليل باستخدام قيمة ثابتة بدلاً من السعر الفعلي
          analysisPromiseRef.current = handler.handleTradingViewConfig(
            symbol, 
            randomTimeframe,
            randomAnalysisType === 'scalping',
            randomAnalysisType === 'smart',
            randomAnalysisType === 'smc',
            randomAnalysisType === 'ict',
            randomAnalysisType === 'turtlesoup',
            randomAnalysisType === 'gann',
            randomAnalysisType === 'waves',
            randomAnalysisType === 'pattern',
            randomAnalysisType === 'priceaction',
            randomAnalysisType === 'neural',
            randomAnalysisType === 'rnn',
            randomAnalysisType === 'timeclustering',
            randomAnalysisType === 'multivariance',
            randomAnalysisType === 'compositecandlestick',
            randomAnalysisType === 'behavioral',
            randomAnalysisType === 'fibonacci',
            randomAnalysisType === 'fibonacciadvanced',
            duration.toString()
          );
          
          const result = await analysisPromiseRef.current;
          
          // تحديث المقاييس والنتائج
          setLastResult(result);
          setMetrics(prev => ({
            ...prev,
            [randomAnalysisType]: (prev[randomAnalysisType] || 0) + 1
          }));
          
          if (result && onAnalysisComplete) {
            onAnalysisComplete(result);
          }
          
          // حفظ النتائج في سجل البحث
          // (تم إزالة saveAnalysisToHistory لأنها تتم داخل handleTradingViewConfig)
          
          iterations++;
          
          // الانتظار حسب الفاصل الزمني المحدد
          if (i < totalReps - 1 && !stopRequestRef.current) {
            await new Promise(resolve => {
              timerRef.current = setTimeout(resolve, parseInt(interval) * 1000);
            });
          }
        } catch (analysisError) {
          console.error("Error in analysis iteration:", analysisError);
          toast.error(`فشل في التحليل ${i + 1}/${totalReps}`);
        }
      }
      
      console.log(`Auto analysis completed with ${iterations} successful iterations`);
      if (iterations > 0) {
        toast.success(`تم إكمال التحليل التلقائي (${iterations}/${totalReps} ناجح)`);
      }
    } catch (error) {
      console.error("Error in auto analysis:", error);
      toast.error("حدث خطأ أثناء التحليل التلقائي");
    } finally {
      setIsRunning(false);
      cleanupTimer();
    }
  }, [isRunning, cleanupTimer]);
  
  const stopAutoAnalysis = useCallback(() => {
    console.log("Stopping auto analysis");
    stopRequestRef.current = true;
    cleanupTimer();
    setIsRunning(false);
    toast.info("تم إيقاف التحليل التلقائي");
  }, [cleanupTimer]);
  
  return {
    startAutoAnalysis,
    stopAutoAnalysis,
    isRunning,
    currentIteration,
    totalIterations,
    remainingTime,
    metrics,
    lastResult
  };
};
