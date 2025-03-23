
/**
 * حساب دقة اتجاه التحليلات
 */

import { supabase } from "@/lib/supabase";
import { DirectionAccuracyResult } from "./types";

/**
 * حساب نسبة دقة الاتجاه للتحليلات السابقة
 * @param analysisType - نوع التحليل المطلوب حساب دقته
 * @param timeFrames - الأطر الزمنية المطلوب تقييمها (اختياري)
 * @returns نسبة الدقة والإحصائيات المتعلقة بها
 */
export const calculateDirectionAccuracy = async (
  analysisType: string,
  timeFrames?: string[]
): Promise<DirectionAccuracyResult> => {
  try {
    // بناء الاستعلام للحصول على التحليلات المكتملة فقط
    let query = supabase
      .from('search_history')
      .select('*')
      .eq('analysis_type', analysisType)
      .not('result_timestamp', 'is', null);
      
    // إضافة تصفية الإطار الزمني إذا كان محددًا
    if (timeFrames && timeFrames.length > 0) {
      query = query.in('timeframe', timeFrames);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // التحقق من وجود بيانات كافية
    if (!data || data.length === 0) {
      return {
        accuracy: 0,
        totalAnalyses: 0,
        correctPredictions: 0,
        detailedStats: {}
      };
    }
    
    let correctPredictions = 0;
    const timeframeStats: { [timeframe: string]: { correct: number, total: number } } = {};
    
    // التحقق من دقة التنبؤات لكل تحليل
    for (const analysis of data) {
      const predictedDirection = analysis.analysis?.direction;
      const stopLoss = analysis.analysis?.stopLoss;
      const targets = analysis.analysis?.targets;
      const lastCheckedPrice = analysis.last_checked_price;
      const stopLossHit = analysis.stop_loss_hit;
      const targetHit = analysis.target_hit;
      
      // إذا كانت البيانات غير متوفرة، نتخطى هذا التحليل
      if (!predictedDirection || !stopLoss || !targets || !lastCheckedPrice) {
        continue;
      }
      
      // حساب ما إذا كان التنبؤ بالاتجاه صحيحًا
      let isCorrect = false;
      
      if (targetHit) {
        // إذا تم الوصول للهدف، فالتنبؤ صحيح
        isCorrect = true;
      } else if (stopLossHit) {
        // إذا تم الوصول لوقف الخسارة، فالتنبؤ خاطئ
        isCorrect = false;
      } else {
        // إذا لم يتم الوصول لأي منهما، نقارن السعر الحالي بالسعر الأصلي
        if (predictedDirection === 'صاعد' && lastCheckedPrice > analysis.current_price) {
          isCorrect = true;
        } else if (predictedDirection === 'هابط' && lastCheckedPrice < analysis.current_price) {
          isCorrect = true;
        }
      }
      
      // إضافة الإحصائيات
      if (isCorrect) {
        correctPredictions++;
      }
      
      // إضافة إحصائيات الإطار الزمني
      const timeframe = analysis.timeframe || 'غير محدد';
      if (!timeframeStats[timeframe]) {
        timeframeStats[timeframe] = { correct: 0, total: 0 };
      }
      
      timeframeStats[timeframe].total++;
      if (isCorrect) {
        timeframeStats[timeframe].correct++;
      }
    }
    
    // حساب نسبة الدقة الإجمالية
    const accuracy = data.length > 0 ? correctPredictions / data.length : 0;
    
    // بناء إحصائيات مفصلة لكل إطار زمني
    const detailedStats: any = {};
    
    Object.keys(timeframeStats).forEach(timeframe => {
      const stats = timeframeStats[timeframe];
      detailedStats[timeframe] = {
        accuracy: stats.total > 0 ? stats.correct / stats.total : 0,
        totalAnalyses: stats.total,
        correctPredictions: stats.correct
      };
    });
    
    return {
      accuracy,
      totalAnalyses: data.length,
      correctPredictions,
      detailedStats
    };
  } catch (error) {
    console.error('خطأ في حساب دقة التحليلات:', error);
    throw error;
  }
};
