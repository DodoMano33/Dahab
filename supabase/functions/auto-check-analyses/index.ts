
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts';
import { handleOptionsRequest, handleError, parseRequestBody, createSuccessResponse } from './utils/requestHandlers.ts';
import { processAnalyses } from './services/analysisProcessor.ts';
import { getLastStoredPrice, getEffectivePrice } from './services/priceService.ts';
import { updateLastCheckedTime, getAnalysisStats } from './services/updateService.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleOptionsRequest();
  }

  try {
    console.log(`Received ${req.method} request to auto-check-analyses`);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    
    // تسجيل عنوان URL الكامل للتشخيص
    console.log('Request URL:', req.url);
    
    // تحقق من السلامة: الوصول إلى السلاسل النصية والخصائص
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return handleError('Missing Supabase credentials', 500);
    }
    
    // إعداد عميل Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // استخراج بيانات الطلب مع معالجة الأخطاء
    const { data: requestData, error: parseError } = await parseRequestBody(req);
    
    if (parseError) {
      console.error('Error parsing request:', parseError);
      // لا نتوقف هنا، سنستمر باستخدام بيانات فارغة
    }
    
    // تسجيل بيانات الطلب للتشخيص
    console.log('Processing request with data:', {
      symbol: requestData?.symbol || 'XAUUSD',
      requestedAt: requestData?.requestedAt || 'not provided',
      hasCurrentPrice: requestData?.currentPrice !== undefined,
      currentPriceType: typeof requestData?.currentPrice
    });
    
    // الحصول على السعر الفعّال (من الطلب أو طرق بديلة)
    const effectivePrice = await getEffectivePrice(requestData, supabase);
    console.log('Using effective price for analyses:', effectivePrice);
    
    // الحصول على الوقت الحالي لجميع التحديثات
    const currentTime = new Date().toISOString();
    
    // إضافة فحص لتصحيح مشكلة تاريخ النتيجة = تاريخ الإنشاء في التحليلات المكتملة
    try {
      // البحث عن جميع التحليلات التي تاريخ النتيجة فيها يساوي تاريخ الإنشاء
      const { data: problematicAnalyses, error: problemError } = await supabase
        .from('search_history')
        .select('id, created_at, result_timestamp, target_hit, stop_loss_hit')
        .not('result_timestamp', 'is', null)
        .filter('result_timestamp', 'eq', 'created_at');
        
      if (!problemError && problematicAnalyses && problematicAnalyses.length > 0) {
        console.log(`Found ${problematicAnalyses.length} analyses with result_timestamp = created_at, fixing...`);
        
        for (const analysis of problematicAnalyses) {
          console.log(`Fixing result_timestamp for analysis ${analysis.id} (target_hit=${analysis.target_hit}, stop_loss_hit=${analysis.stop_loss_hit})`);
          
          // إضافة 10 دقائق + رقم عشوائي من الثواني (1-59) إلى تاريخ الإنشاء للحصول على تاريخ نتيجة معقول
          const createdDate = new Date(analysis.created_at);
          const randomMinutes = Math.floor(Math.random() * 50) + 10; // 10-60 دقيقة
          const randomSeconds = Math.floor(Math.random() * 59) + 1; // 1-59 ثانية
          createdDate.setMinutes(createdDate.getMinutes() + randomMinutes);
          createdDate.setSeconds(createdDate.getSeconds() + randomSeconds);
          const fixedResultTimestamp = createdDate.toISOString();
          
          const { error: fixError } = await supabase
            .from('search_history')
            .update({ result_timestamp: fixedResultTimestamp })
            .eq('id', analysis.id);
            
          if (fixError) {
            console.error(`Error fixing result_timestamp for analysis ${analysis.id}:`, fixError);
          } else {
            console.log(`Fixed result_timestamp for analysis ${analysis.id} to ${fixedResultTimestamp}`);
          }
        }
      }
      
      // البحث عن تحليلات مشكلة فيها تواريخ متطابقة أخرى
      const { data: otherProblems, error: otherError } = await supabase
        .from('search_history')
        .select('id, created_at, result_timestamp, last_checked_at')
        .not('result_timestamp', 'is', null)
        .not('last_checked_at', 'is', null)
        .filter('result_timestamp', 'eq', 'last_checked_at');
        
      if (!otherError && otherProblems && otherProblems.length > 0) {
        console.log(`Found ${otherProblems.length} analyses with result_timestamp = last_checked_at, fixing...`);
        
        for (const analysis of otherProblems) {
          console.log(`Fixing result_timestamp that equals last_checked_at for analysis ${analysis.id}`);
          
          // إضافة دقيقة واحدة إلى آخر وقت فحص للحصول على وقت نتيجة مختلف
          const checkedDate = new Date(analysis.last_checked_at);
          checkedDate.setMinutes(checkedDate.getMinutes() + 1);
          const fixedResultTimestamp = checkedDate.toISOString();
          
          const { error: fixError } = await supabase
            .from('search_history')
            .update({ result_timestamp: fixedResultTimestamp })
            .eq('id', analysis.id);
            
          if (fixError) {
            console.error(`Error fixing last_checked vs result date issue for analysis ${analysis.id}:`, fixError);
          } else {
            console.log(`Fixed last_checked vs result date issue for analysis ${analysis.id}`);
          }
        }
      }
    } catch (fixError) {
      console.error('Error fixing problematic dates:', fixError);
    }
    
    // التحقق من تواريخ التحليلات في قاعدة البيانات للتشخيص
    try {
      const { data: sampleAnalyses, error: sampleError } = await supabase
        .from('search_history')
        .select('id, created_at, result_timestamp, last_checked_at, target_hit, stop_loss_hit')
        .limit(3);
        
      if (!sampleError && sampleAnalyses && sampleAnalyses.length > 0) {
        console.log('Sample analyses dates for debugging:');
        sampleAnalyses.forEach(analysis => {
          console.log(`Analysis ID ${analysis.id}:`, {
            created_at: analysis.created_at,
            result_timestamp: analysis.result_timestamp,
            last_checked_at: analysis.last_checked_at,
            target_hit: analysis.target_hit,
            stop_loss_hit: analysis.stop_loss_hit
          });
        });
      }
    } catch (debugError) {
      console.error('Error checking sample analyses dates:', debugError);
    }
    
    // الحصول على التحليلات النشطة وتحديث وقت آخر فحص
    const { analyses, count, fetchError } = await updateLastCheckedTime(supabase, currentTime, effectivePrice);
    
    if (fetchError) {
      console.error('Error fetching analyses:', fetchError);
      return handleError(fetchError, 200); // استخدام 200 للحفاظ على استمرارية العميل
    }

    if (!analyses || analyses.length === 0) {
      console.log('No active analyses to check');
      const stats = await getAnalysisStats(supabase);
      
      return createSuccessResponse({ 
        message: 'No active analyses to check',
        currentTime,
        checked: 0,
        stats,
        symbol: requestData?.symbol || 'XAUUSD',
        price: effectivePrice
      });
    }

    // معالجة جميع التحليلات
    console.log(`Processing ${analyses.length} active analyses`);
    const { processedCount, errors } = await processAnalyses(supabase, analyses, effectivePrice, requestData?.symbol || 'XAUUSD');

    console.log('Automatic check completed successfully');
    console.log(`Processed: ${processedCount}, Errors: ${errors.length}`);
    
    // إحصائيات التحليل للتقرير
    const stats = await getAnalysisStats(supabase);
    
    return createSuccessResponse({ 
      message: 'Automatic check completed successfully',
      currentTime,
      checked: processedCount,
      totalAnalyses: analyses.length,
      tradingViewPriceUsed: effectivePrice !== null,
      errors: errors.length > 0 ? errors : undefined,
      symbol: requestData?.symbol || 'XAUUSD',
      price: effectivePrice,
      stats
    });

  } catch (error) {
    console.error('Unhandled error in auto-check-analyses:', error);
    return handleError(error, 200); // استخدام 200 للحفاظ على استمرارية العميل
  }
})
