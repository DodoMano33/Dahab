
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// مدة التحديث بالدقائق
const UPDATE_INTERVAL_MINUTES = 0.5;

Deno.serve(async (req) => {
  // التعامل مع طلبات CORS المسبقة
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`إعداد جدولة تحديث الأسعار كل ${UPDATE_INTERVAL_MINUTES} دقائق...`);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey || !supabaseAnonKey) {
      throw new Error('بيانات اعتماد Supabase مفقودة');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // إنشاء وظيفة قاعدة بيانات لجدولة تحديث الأسعار
    try {
      const { error: fnError } = await supabase.rpc('create_auto_price_updates_schedule');
      if (fnError) {
        throw fnError;
      }
    } catch (err) {
      console.error('تجاهل خطأ في create_auto_price_updates_schedule:', err);
      // استمر في التنفيذ حتى لو فشلت هذه الخطوة
    }

    // جدولة تحديث الأسعار كل 30 ثانية (0.5 دقيقة)
    const { error: scheduleError } = await supabase.sql`
      SELECT cron.schedule(
        'update-prices-every-thirty-seconds',
        '*/30 * * * * *', -- every 30 seconds
        $cron$
        SELECT net.http_post(
          url:='${supabaseUrl}/functions/v1/scheduled-price-update',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${supabaseAnonKey}"}'::jsonb,
          body:='{}'::jsonb
        ) as request_id;
        $cron$
      );
    `;

    if (scheduleError) {
      console.error('خطأ في جدولة تحديث الأسعار:', scheduleError);
      throw scheduleError;
    }

    console.log(`تمت جدولة تحديث الأسعار كل ${UPDATE_INTERVAL_MINUTES} دقائق بنجاح`);
    
    return new Response(
      JSON.stringify({ 
        message: `تمت جدولة تحديث الأسعار كل ${UPDATE_INTERVAL_MINUTES} دقائق بنجاح`,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('خطأ في schedule-auto-price-updates:', error);
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
