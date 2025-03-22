
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { fetchPrice } from '../update-real-time-prices/priceService.ts';

// قائمة الأدوات المالية المدعومة للتحديث
// يمكن توسيعها في المستقبل لتشمل أدوات أخرى
const SUPPORTED_SYMBOLS = ['XAUUSD'];

// مدة التحديث بالدقائق
const UPDATE_INTERVAL_MINUTES = 5;

Deno.serve(async (req) => {
  // التعامل مع طلبات CORS المسبقة
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`بدء تحديث الأسعار المجدول (كل ${UPDATE_INTERVAL_MINUTES} دقائق)...`);
    
    // التحقق من بيانات الاعتماد
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('بيانات اعتماد Supabase مفقودة');
      return new Response(
        JSON.stringify({ error: 'بيانات اعتماد Supabase مفقودة' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // إعداد عميل Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // جلب وتخزين أسعار الأدوات المالية المدعومة
    const results = [];
    
    for (const symbol of SUPPORTED_SYMBOLS) {
      try {
        console.log(`محاولة جلب سعر ${symbol}...`);
        // جلب السعر الحالي
        const price = await fetchPrice(symbol);
        
        if (price !== null) {
          console.log(`تم جلب سعر ${symbol}: ${price}`);
          
          // تخزين السعر في قاعدة البيانات
          const { data, error } = await supabase
            .from('real_time_prices')
            .upsert({ 
              symbol, 
              price, 
              updated_at: new Date().toISOString() 
            }, { 
              onConflict: 'symbol' 
            });
          
          if (error) {
            console.error(`خطأ في تخزين سعر ${symbol}:`, error);
            results.push({ symbol, success: false, error: error.message });
          } else {
            console.log(`تم تحديث سعر ${symbol} بنجاح`);
            results.push({ symbol, success: true, price });
          }
        } else {
          console.error(`فشل في جلب سعر ${symbol}`);
          results.push({ symbol, success: false, error: "سعر غير متاح" });
        }
      } catch (error: any) {
        console.error(`خطأ في معالجة سعر ${symbol}:`, error);
        results.push({ symbol, success: false, error: error.message });
      }
    }

    // جدولة الوظيفة للعمل كل خمس دقائق
    try {
      const { error: scheduleError } = await supabase.sql`
        SELECT cron.schedule(
          'update-prices-every-five-minutes',
          '*/5 * * * *',
          $cron$
          SELECT net.http_post(
            url:='${supabaseUrl}/functions/v1/scheduled-price-update',
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${supabaseKey}"}'::jsonb,
            body:='{}'::jsonb
          ) as request_id;
          $cron$
        );
      `;

      if (scheduleError) {
        console.error('خطأ في جدولة تحديث الأسعار:', scheduleError);
        // لن نعيد خطأ هنا لأن التحديث الأساسي قد تم بالفعل
      } else {
        console.log(`تم جدولة تحديث الأسعار بنجاح كل ${UPDATE_INTERVAL_MINUTES} دقائق`);
      }
    } catch (scheduleError) {
      console.error('خطأ في إنشاء الجدولة:', scheduleError);
      // لا نريد أن نفشل التنفيذ كاملاً إذا فشل الجدولة
    }
    
    return new Response(
      JSON.stringify({
        message: `تم تحديث أسعار ${results.filter(r => r.success).length} من ${SUPPORTED_SYMBOLS.length} أداة بنجاح`,
        updated_at: new Date().toISOString(),
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('خطأ غير معالج في scheduled-price-update:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
