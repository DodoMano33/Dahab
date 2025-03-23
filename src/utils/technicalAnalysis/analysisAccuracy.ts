
/**
 * وحدة تقييم دقة التحليلات
 * تحسب معدلات نجاح التحليلات وتساعد في تحسين التوقعات المستقبلية
 */

import { supabase } from "@/lib/supabase";
import { AnalysisData } from "@/types/analysis";

/**
 * حساب نسبة دقة الاتجاه للتحليلات السابقة
 * @param analysisType - نوع التحليل المطلوب حساب دقته
 * @param timeFrames - الأطر الزمنية المطلوب تقييمها (اختياري)
 * @returns نسبة الدقة والإحصائيات المتعلقة بها
 */
export const calculateDirectionAccuracy = async (
  analysisType: string,
  timeFrames?: string[]
): Promise<{
  accuracy: number;
  totalAnalyses: number;
  correctPredictions: number;
  detailedStats: {
    [timeframe: string]: {
      accuracy: number;
      totalAnalyses: number;
      correctPredictions: number;
    }
  }
}> => {
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

/**
 * حساب متوسط الوقت للوصول إلى الأهداف
 * @param analysisType - نوع التحليل
 * @returns متوسط الوقت للوصول إلى كل هدف (بالساعات)
 */
export const calculateAverageTimeToTarget = async (
  analysisType: string
): Promise<{
  averageTimeToFirstTarget: number;
  averageTimeToLastTarget: number;
  timeframeStats: {
    [timeframe: string]: {
      averageTimeToFirstTarget: number;
      averageTimeToLastTarget: number;
    }
  }
}> => {
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

/**
 * حساب نسبة التعرض لوقف الخسارة
 * @param analysisType - نوع التحليل
 * @returns نسبة التحليلات التي وصلت إلى وقف الخسارة
 */
export const calculateStopLossRate = async (
  analysisType: string
): Promise<{
  stopLossRate: number;
  totalAnalyses: number;
  stopLossHits: number;
  timeframeStats: {
    [timeframe: string]: {
      stopLossRate: number;
      totalAnalyses: number;
      stopLossHits: number;
    }
  }
}> => {
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

/**
 * تقييم أداء نوع التحليل بناءً على النتائج السابقة
 * @param analysisType - نوع التحليل
 * @returns تقييم شامل لأداء التحليل
 */
export const evaluateAnalysisPerformance = async (
  analysisType: string
): Promise<{
  overallScore: number;
  directionAccuracy: number;
  targetHitRate: number;
  stopLossRate: number;
  averageTimeToTarget: number;
  recommendedTimeframes: string[];
  recommendedSymbols: string[];
  weaknesses: string[];
  strengths: string[];
}> => {
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
