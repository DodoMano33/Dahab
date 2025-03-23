
/**
 * وحدة تحليل الشارت باستخدام خوارزميات التعلم الآلي
 * هذا الملف يعمل كواجهة لتصدير جميع وظائف تحليل التعلم الآلي
 */

// تصدير الوظائف الأساسية من وحدة التحليل الأساسي
import { analyzeMLChart as baseAnalyzeMLChart } from './ml/basicMLAnalysis';
import { analyzeMultiTimeframeML as baseMultiTimeframeML } from './ml/multiTimeframeAnalysis';
import { performEnhancedMLAnalysis } from './ml/enhancedPrediction';

// إعادة تصدير الوظائف مع تحديثات للواجهة إذا لزم الأمر
export const analyzeMLChart = baseAnalyzeMLChart;
export const analyzeMultiTimeframeML = baseMultiTimeframeML;

// تصدير الوظائف الإضافية
export * from './ml/index';
