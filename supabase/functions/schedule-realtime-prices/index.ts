
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // التعامل مع طلبات CORS المسبقة
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('إعداد جدولة تحديث الأسعار الحقيقية...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('بيانات اعتماد Supabase مفقودة')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // إنشاء وظيفة قاعدة بيانات لجدولة تحديث الأسعار
    const { error: functionError } = await supabase.rpc('create_real_time_prices_schedule')
    
    if (functionError) {
      console.error('خطأ في إنشاء وظيفة جدولة تحديث الأسعار:', functionError)
      throw functionError
    }

    // جدولة تحديث الأسعار
    const { error: scheduleError } = await supabase.sql`
      SELECT cron.schedule(
        'update-real-time-prices-every-minute',
        '* * * * *',  -- تشغيل كل دقيقة
        $$
        SELECT
          net.http_post(
            url:='${supabaseUrl}/functions/v1/update-real-time-prices',
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${supabaseAnonKey}"}'::jsonb,
            body:='{}'::jsonb
          ) as request_id;
        $$
      );
    `

    if (scheduleError) {
      console.error('خطأ في جدولة تحديث الأسعار:', scheduleError)
      throw scheduleError
    }

    console.log('تمت جدولة تحديث الأسعار الحقيقية كل دقيقة بنجاح')
    
    return new Response(
      JSON.stringify({ 
        message: 'تمت جدولة تحديث الأسعار الحقيقية كل دقيقة بنجاح',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('خطأ في schedule-realtime-prices:', error)
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
