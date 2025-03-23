
/**
 * حساب زمن الوصول إلى الأهداف
 */

import { supabase } from "@/lib/supabase";
import { TimeToTargetResult } from "./types";

/**
 * حساب متوسط الوقت للوصول إلى الأهداف
 * @param analysisType - نوع التحليل
 * @returns متوسط الوقت للوصول إلى كل هدف (بالساعات)
 */
export const calculateAverageTimeToTarget = async (
  analysisType: string
): Promise<TimeToTargetResult> => {
  try {
    // جلب التحليلات التي تم الوصول إلى أهدافها
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('analysis_type', analysisType)
      .eq('target_hit', true)
      .not('result_timestamp', 'is', null);
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return {
        averageTimeToFirstTarget: 0,
        averageTimeToLastTarget: 0,
        timeframeStats: {}
      };
    }
    
    let totalTimeToFirstTarget = 0;
    let totalTimeToLastTarget = 0;
    const timeframeStats: { [timeframe: string]: { firstTarget: number[], lastTarget: number[] } } = {};
    
    for (const analysis of data) {
      const createdAt = new Date(analysis.created_at);
      const resultTimestamp = new Date(analysis.result_timestamp);
      const timeToTarget = (resultTimestamp.getTime() - createdAt.getTime()) / (1000 * 60 * 60); // بالساعات
      
      totalTimeToFirstTarget += timeToTarget;
      totalTimeToLastTarget += timeToTarget;
      
      // إضافة إحصائيات الإطار الزمني
      const timeframe = analysis.timeframe || 'غير محدد';
      if (!timeframeStats[timeframe]) {
        timeframeStats[timeframe] = { firstTarget: [], lastTarget: [] };
      }
      
      timeframeStats[timeframe].firstTarget.push(timeToTarget);
      timeframeStats[timeframe].lastTarget.push(timeToTarget);
    }
    
    // حساب المتوسطات
    const averageTimeToFirstTarget = data.length > 0 ? totalTimeToFirstTarget / data.length : 0;
    const averageTimeToLastTarget = data.length > 0 ? totalTimeToLastTarget / data.length : 0;
    
    // بناء إحصائيات مفصلة لكل إطار زمني
    const timeframeStatsResult: any = {};
    
    Object.keys(timeframeStats).forEach(timeframe => {
      const stats = timeframeStats[timeframe];
      const firstTargetAvg = stats.firstTarget.length > 0 ? 
        stats.firstTarget.reduce((a, b) => a + b, 0) / stats.firstTarget.length : 0;
      const lastTargetAvg = stats.lastTarget.length > 0 ? 
        stats.lastTarget.reduce((a, b) => a + b, 0) / stats.lastTarget.length : 0;
        
      timeframeStatsResult[timeframe] = {
        averageTimeToFirstTarget: firstTargetAvg,
        averageTimeToLastTarget: lastTargetAvg,
      };
    });
    
    return {
      averageTimeToFirstTarget,
      averageTimeToLastTarget,
      timeframeStats: timeframeStatsResult
    };
  } catch (error) {
    console.error('خطأ في حساب متوسط الوقت للأهداف:', error);
    throw error;
  }
};
