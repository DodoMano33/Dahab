
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts';
import { handleOptionsRequest, handleError, parseRequestBody, createSuccessResponse } from './utils/requestHandlers.ts';
import { processAnalyses } from './services/analysisProcessor.ts';
import { getLastStoredPrice, getEffectivePrice } from './services/priceService.ts';
import { updateLastCheckedTime, getAnalysisStats } from './services/updateService.ts';

Deno.serve(async (req) => {
  // التعامل مع طلبات CORS المسبقة
  if (req.method === 'OPTIONS') {
    return handleOptionsRequest();
  }

  try {
    console.log(`تم استلام طلب ${req.method} إلى auto-check-analyses`);
    console.log('رؤوس الطلب:', Object.fromEntries(req.headers.entries()));
    
    // تسجيل عنوان URL الكامل للتشخيص
    console.log('عنوان URL للطلب:', req.url);
    
    // التحقق من بيانات الاعتماد
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('بيانات اعتماد Supabase مفقودة');
      return handleError('بيانات اعتماد Supabase مفقودة', 500);
    }
    
    // إعداد عميل Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // استخراج JWT من رأس التخويل
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const { data: userData, error: jwtError } = await supabase.auth.getUser(token);
        
        if (jwtError) {
          console.error('خطأ في التحقق من JWT:', jwtError);
        } else if (userData?.user) {
          userId = userData.user.id;
          console.log('تم التحقق من هوية المستخدم:', userId);
        }
      } catch (tokenError) {
        console.error('خطأ في معالجة رمز JWT:', tokenError);
      }
    } else {
      console.log('لا يوجد رأس تخويل في الطلب أو التنسيق غير صالح');
    }
    
    // استخراج بيانات الطلب مع معالجة الأخطاء
    const { data: requestData, error: parseError } = await parseRequestBody(req);
    
    if (parseError) {
      console.error('خطأ في تحليل الطلب:', parseError);
      // لا نتوقف هنا، سنستمر باستخدام بيانات فارغة
    }
    
    // تسجيل بيانات الطلب للتشخيص
    console.log('معالجة الطلب مع البيانات:', {
      symbol: requestData?.symbol || 'XAUUSD',
      requestedAt: requestData?.requestedAt || 'غير مقدم',
      hasCurrentPrice: requestData?.currentPrice !== undefined,
      currentPriceType: typeof requestData?.currentPrice,
      userId: userId || 'غير مخول'
    });
    
    // التحقق من التخويل (يمكن للمستخدمين غير المصادق عليهم الوصول إلى الأسعار الحالية فقط)
    if (!userId) {
      console.log('المستخدم غير مصادق عليه، إرجاع الأسعار الحالية فقط');
      const effectivePrice = await getEffectivePrice(requestData, supabase);
      
      return createSuccessResponse({
        message: 'المستخدم غير مصادق عليه، إرجاع الأسعار الحالية فقط',
        symbol: requestData?.symbol || 'XAUUSD',
        price: effectivePrice,
        timestamp: new Date().toISOString(),
        needsAuth: true
      });
    }
    
    // الحصول على السعر الفعّال (من الطلب أو طرق بديلة)
    const effectivePrice = await getEffectivePrice(requestData, supabase);
    console.log('استخدام السعر الفعال للتحليلات:', effectivePrice);
    
    // الحصول على الوقت الحالي لجميع التحديثات
    const currentTime = new Date().toISOString();
    
    // الحصول على التحليلات النشطة وتحديث وقت آخر فحص
    const { analyses, count, fetchError } = await updateLastCheckedTime(supabase, currentTime, effectivePrice, userId);
    
    if (fetchError) {
      console.error('خطأ في جلب التحليلات:', fetchError);
      return handleError(fetchError, 200); // استخدام 200 للحفاظ على استمرارية العميل
    }

    if (!analyses || analyses.length === 0) {
      console.log('لا توجد تحليلات نشطة للفحص');
      const stats = await getAnalysisStats(supabase, userId);
      
      return createSuccessResponse({ 
        message: 'لا توجد تحليلات نشطة للفحص',
        currentTime,
        checked: 0,
        stats,
        symbol: requestData?.symbol || 'XAUUSD',
        price: effectivePrice
      });
    }

    // معالجة جميع التحليلات
    console.log(`معالجة ${analyses.length} تحليل نشط`);
    const { processedCount, errors } = await processAnalyses(supabase, analyses, effectivePrice, requestData?.symbol || 'XAUUSD');

    console.log('اكتمل الفحص التلقائي بنجاح');
    console.log(`المعالجة: ${processedCount}، الأخطاء: ${errors.length}`);
    
    // إحصائيات التحليل للتقرير
    const stats = await getAnalysisStats(supabase, userId);
    
    return createSuccessResponse({ 
      message: 'اكتمل الفحص التلقائي بنجاح',
      currentTime,
      checked: processedCount,
      totalAnalyses: analyses.length,
      tradingViewPriceUsed: effectivePrice !== null,
      errors: errors.length > 0 ? errors : undefined,
      symbol: requestData?.symbol || 'XAUUSD',
      price: effectivePrice,
      stats,
      userId: userId
    });

  } catch (error) {
    console.error('خطأ غير معالج في auto-check-analyses:', error);
    return handleError(error, 200); // استخدام 200 للحفاظ على استمرارية العميل
  }
})
