
/**
 * تقييم أداء التحليلات
 */

import { supabase } from "@/lib/supabase";
import { calculateDirectionAccuracy } from "./directionAccuracy";
import { calculateAverageTimeToTarget } from "./targetTime";
import { calculateStopLossRate } from "./stopLossRate";
import { AnalysisPerformanceResult } from "./types";

/**
 * تقييم أداء نوع التحليل بناءً على النتائج السابقة
 * @param analysisType - نوع التحليل
 * @returns تقييم شامل لأداء التحليل
 */
export const evaluateAnalysisPerformance = async (
  analysisType: string
): Promise<AnalysisPerformanceResult> => {
  try {
    // جمع كل إحصائيات التحليل
    const directionAccuracyStats = await calculateDirectionAccuracy(analysisType);
    const timeToTargetStats = await calculateAverageTimeToTarget(analysisType);
    const stopLossStats = await calculateStopLossRate(analysisType);
    
    // جلب التحليلات المكتملة
    const { data: completedAnalyses, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('analysis_type', analysisType)
      .not('result_timestamp', 'is', null);
      
    if (error) throw error;
    
    // حساب نسبة الوصول للهدف
    let targetHits = 0;
    const symbolStats: { [symbol: string]: { hits: number, total: number } } = {};
    
    if (completedAnalyses && completedAnalyses.length > 0) {
      for (const analysis of completedAnalyses) {
        if (analysis.target_hit) {
          targetHits++;
        }
        
        // جمع إحصائيات الرموز
        const symbol = analysis.symbol || 'غير محدد';
        if (!symbolStats[symbol]) {
          symbolStats[symbol] = { hits: 0, total: 0 };
        }
        
        symbolStats[symbol].total++;
        if (analysis.target_hit) {
          symbolStats[symbol].hits++;
        }
      }
    }
    
    const targetHitRate = completedAnalyses && completedAnalyses.length > 0 ? 
      targetHits / completedAnalyses.length : 0;
    
    // تحديد الأطر الزمنية الموصى بها
    const recommendedTimeframes: string[] = [];
    const timeframeScores: { timeframe: string, score: number }[] = [];
    
    Object.keys(directionAccuracyStats.detailedStats).forEach(timeframe => {
      const directionAcc = directionAccuracyStats.detailedStats[timeframe].accuracy;
      const stopLossRate = 
        timeframe in stopLossStats.timeframeStats ? 
        stopLossStats.timeframeStats[timeframe].stopLossRate : 1;
      
      // حساب النتيجة الإجمالية للإطار الزمني
      const score = (directionAcc * 0.7) + ((1 - stopLossRate) * 0.3);
      timeframeScores.push({ timeframe, score });
    });
    
    // ترتيب الأطر الزمنية حسب النتيجة
    timeframeScores.sort((a, b) => b.score - a.score);
    
    // اختيار أفضل 3 أطر زمنية
    recommendedTimeframes.push(...timeframeScores.slice(0, 3).map(item => item.timeframe));
    
    // تحديد الرموز الموصى بها
    const recommendedSymbols: string[] = [];
    const symbolScores: { symbol: string, score: number }[] = [];
    
    Object.keys(symbolStats).forEach(symbol => {
      const stats = symbolStats[symbol];
      const hitRate = stats.total > 0 ? stats.hits / stats.total : 0;
      symbolScores.push({ symbol, score: hitRate });
    });
    
    // ترتيب الرموز حسب معدل النجاح
    symbolScores.sort((a, b) => b.score - a.score);
    
    // اختيار أفضل 3 رموز
    recommendedSymbols.push(...symbolScores.slice(0, 3).map(item => item.symbol));
    
    // تحديد نقاط القوة والضعف
    const weaknesses: string[] = [];
    const strengths: string[] = [];
    
    if (directionAccuracyStats.accuracy < 0.5) {
      weaknesses.push('دقة تحديد الاتجاه منخفضة');
    } else if (directionAccuracyStats.accuracy > 0.7) {
      strengths.push('دقة عالية في تحديد الاتجاه');
    }
    
    if (stopLossStats.stopLossRate > 0.4) {
      weaknesses.push('معدل مرتفع للوصول إلى وقف الخسارة');
    } else if (stopLossStats.stopLossRate < 0.2) {
      strengths.push('معدل منخفض للوصول إلى وقف الخسارة');
    }
    
    if (targetHitRate < 0.3) {
      weaknesses.push('معدل منخفض للوصول إلى الأهداف');
    } else if (targetHitRate > 0.6) {
      strengths.push('معدل مرتفع للوصول إلى الأهداف');
    }
    
    // حساب النتيجة الإجمالية
    const overallScore = 
      (directionAccuracyStats.accuracy * 0.4) + 
      (targetHitRate * 0.4) + 
      ((1 - stopLossStats.stopLossRate) * 0.2);
    
    return {
      overallScore,
      directionAccuracy: directionAccuracyStats.accuracy,
      targetHitRate,
      stopLossRate: stopLossStats.stopLossRate,
      averageTimeToTarget: timeToTargetStats.averageTimeToFirstTarget,
      recommendedTimeframes,
      recommendedSymbols,
      weaknesses,
      strengths
    };
  } catch (error) {
    console.error('خطأ في تقييم أداء التحليل:', error);
    throw error;
  }
};
