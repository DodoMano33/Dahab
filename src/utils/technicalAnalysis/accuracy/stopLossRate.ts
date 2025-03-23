
/**
 * حساب معدل وقف الخسارة
 */

import { supabase } from "@/lib/supabase";
import { StopLossRateResult } from "./types";

/**
 * حساب نسبة التعرض لوقف الخسارة
 * @param analysisType - نوع التحليل
 * @returns نسبة التحليلات التي وصلت إلى وقف الخسارة
 */
export const calculateStopLossRate = async (
  analysisType: string
): Promise<StopLossRateResult> => {
  try {
    // جلب جميع التحليلات المكتملة
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('analysis_type', analysisType)
      .not('result_timestamp', 'is', null);
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return {
        stopLossRate: 0,
        totalAnalyses: 0,
        stopLossHits: 0,
        timeframeStats: {}
      };
    }
    
    let stopLossHits = 0;
    const timeframeStats: { [timeframe: string]: { hits: number, total: number } } = {};
    
    for (const analysis of data) {
      // التحقق ما إذا كان قد تم الوصول لوقف الخسارة
      if (analysis.stop_loss_hit) {
        stopLossHits++;
      }
      
      // إضافة إحصائيات الإطار الزمني
      const timeframe = analysis.timeframe || 'غير محدد';
      if (!timeframeStats[timeframe]) {
        timeframeStats[timeframe] = { hits: 0, total: 0 };
      }
      
      timeframeStats[timeframe].total++;
      if (analysis.stop_loss_hit) {
        timeframeStats[timeframe].hits++;
      }
    }
    
    // حساب نسبة التعرض لوقف الخسارة
    const stopLossRate = data.length > 0 ? stopLossHits / data.length : 0;
    
    // بناء إحصائيات مفصلة لكل إطار زمني
    const timeframeStatsResult: any = {};
    
    Object.keys(timeframeStats).forEach(timeframe => {
      const stats = timeframeStats[timeframe];
      timeframeStatsResult[timeframe] = {
        stopLossRate: stats.total > 0 ? stats.hits / stats.total : 0,
        totalAnalyses: stats.total,
        stopLossHits: stats.hits
      };
    });
    
    return {
      stopLossRate,
      totalAnalyses: data.length,
      stopLossHits,
      timeframeStats: timeframeStatsResult
    };
  } catch (error) {
    console.error('خطأ في حساب نسبة التعرض لوقف الخسارة:', error);
    throw error;
  }
};
