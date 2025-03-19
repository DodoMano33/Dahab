
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
